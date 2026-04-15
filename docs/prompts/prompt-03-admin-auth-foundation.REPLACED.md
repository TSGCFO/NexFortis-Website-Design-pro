# Prompt 03: Admin Auth Foundation — Role Column, Operator Middleware, Admin Layout Shell

## Step 0: Setup

Read these files before making any changes:
1. `replit.md` — project overview, architecture, conventions, current state
2. `docs/prd/qb-portal/feature-operator-admin-panel.md` — admin panel PRD (especially Section 6.1: Authentication & Authorization)
3. `docs/prompts/prompt-03-admin-auth-foundation.md` — this file (complete instructions)

**Do NOT modify any files in `docs/`.**
**Do NOT run any git commands** — the Replit worktree system handles commits automatically.

---

## Step 1: Add `role` Column to `qb_users` Table

**File:** `lib/db/src/schema/qb-portal.ts`

Add a `role` column to the `qbUsers` table. The column stores the user's role — either `"customer"` (default for all existing users) or `"operator"` (admin access).

Change the `qbUsers` table definition from:

```typescript
export const qbUsers = pgTable("qb_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

To:

```typescript
export const qbUsers = pgTable("qb_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

The `role` column:
- Type: `text` (not an enum — keeps it flexible for future roles without migrations)
- Default: `"customer"` — all existing users and new registrations get this role
- Valid values at launch: `"customer"` or `"operator"`
- NOT NULL — every user must have a role

---

## Step 2: Generate and Run the Database Migration

After modifying the schema file, generate and run the Drizzle migration:

```bash
cd /home/user/workspace/NexFortis-Website-Design-pro
npx drizzle-kit generate
npx drizzle-kit push
```

If `drizzle-kit push` is not available or the project uses a different migration strategy, check `package.json` for the correct migration command. Common alternatives:
- `pnpm db:push`
- `pnpm db:migrate`

The migration should add the `role` column with default `'customer'` to the existing `qb_users` table. All existing user rows will automatically get `role = 'customer'`.

**Verify the migration worked** by checking the database. If you can access it, run:
```sql
SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'qb_users' AND column_name = 'role';
```

---

## Step 3: Seed the Operator Account

**File:** Create a new file `artifacts/api-server/src/seed-operator.ts`

This script seeds the operator account for Hassan Sadiq. It should be idempotent — safe to run multiple times without creating duplicates.

```typescript
import { db } from "@workspace/db";
import { qbUsers } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const OPERATOR_EMAIL = "h.sadiq@nexfortis.com";
const OPERATOR_NAME = "Hassan Sadiq";
const OPERATOR_PASSWORD = "Hassan8488$@";
const BCRYPT_ROUNDS = 12;

async function seedOperator() {
  console.log("[Seed] Checking for existing operator account...");

  const existing = await db
    .select()
    .from(qbUsers)
    .where(eq(qbUsers.email, OPERATOR_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    const user = existing[0];
    if (user.role !== "operator") {
      // Upgrade existing account to operator
      await db
        .update(qbUsers)
        .set({ role: "operator" })
        .where(eq(qbUsers.id, user.id));
      console.log(`[Seed] Upgraded existing user ${user.email} to operator role.`);
    } else {
      console.log(`[Seed] Operator account already exists: ${user.email}`);
    }
    return;
  }

  // Create new operator account
  const passwordHash = await bcrypt.hash(OPERATOR_PASSWORD, BCRYPT_ROUNDS);
  const [user] = await db
    .insert(qbUsers)
    .values({
      email: OPERATOR_EMAIL,
      passwordHash,
      name: OPERATOR_NAME,
      role: "operator",
    })
    .returning();

  console.log(`[Seed] Created operator account: ${user.email} (id: ${user.id})`);
}

seedOperator()
  .then(() => {
    console.log("[Seed] Operator seed complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("[Seed] Error:", err);
    process.exit(1);
  });
```

**Add a script to `package.json`** in the root or in `artifacts/api-server/package.json`:

```json
"seed:operator": "npx tsx artifacts/api-server/src/seed-operator.ts"
```

Run the seed script after the migration:
```bash
pnpm seed:operator
```

Or if that doesn't work:
```bash
npx tsx artifacts/api-server/src/seed-operator.ts
```

---

## Step 4: Update Token Generation to Include Role

**File:** `artifacts/api-server/src/routes/qb-portal.ts`

The current token system stores only `uid` in the HMAC payload. Update it to also store the user's role, so the middleware can check operator access without a database query on every request.

### 4a. Update `generateToken`

Change the `generateToken` function to accept and include a role:

```typescript
function generateToken(userId: number, role: string = "customer"): string {
  const payload = Buffer.from(JSON.stringify({
    uid: userId,
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_MS,
  })).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
```

### 4b. Update `verifyToken`

Change `verifyToken` to return both userId and role:

```typescript
interface TokenPayload {
  uid: number;
  role: string;
}

function verifyToken(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(payload!).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig!), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload!, "base64url").toString());
    if (typeof data.uid !== "number") return null;
    if (data.exp && Date.now() > data.exp) return null;
    return { uid: data.uid, role: data.role || "customer" };
  } catch {
    return null;
  }
}
```

### 4c. Update `extractUserId`

Rename to `extractAuth` and return the full payload:

```typescript
function extractAuth(req: Request): TokenPayload | null {
  const cookieToken = (req as unknown as Record<string, Record<string, string>>).cookies?.[COOKIE_NAME];
  if (cookieToken) {
    const payload = verifyToken(cookieToken);
    if (payload) return payload;
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }
  return null;
}
```

**IMPORTANT:** Also keep a backward-compatible `extractUserId` function that calls `extractAuth` internally, so existing code that uses `extractUserId` doesn't break:

```typescript
function extractUserId(req: Request): number | null {
  const auth = extractAuth(req);
  return auth ? auth.uid : null;
}
```

### 4d. Update `requireAuth` middleware

Update the middleware to store both userId and role on the request:

```typescript
const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const auth = extractAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  (req as unknown as Record<string, unknown>)["userId"] = auth.uid;
  (req as unknown as Record<string, unknown>)["userRole"] = auth.role;
  next();
};
```

### 4e. Create `requireOperator` middleware

Add a new middleware that checks for operator role:

```typescript
const requireOperator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const auth = extractAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (auth.role !== "operator") {
    res.status(403).json({ error: "Operator access required" });
    return;
  }
  (req as unknown as Record<string, unknown>)["userId"] = auth.uid;
  (req as unknown as Record<string, unknown>)["userRole"] = auth.role;
  next();
};
```

### 4f. Update login route to include role in token

In the `POST /auth/login` handler, after verifying the password, fetch the user's role and include it in the token:

Change:
```typescript
const token = generateToken(user.id);
```

To:
```typescript
const token = generateToken(user.id, user.role || "customer");
```

Also update the login response to include the role:
```typescript
res.json({
  user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role || "customer" },
  token,
});
```

### 4g. Update register route

In `POST /auth/register`, new users always get `role: "customer"`:

```typescript
const token = generateToken(user.id, "customer");
```

The response should also include role:
```typescript
res.json({
  user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: "customer" },
  token,
});
```

### 4h. Update the `/me` endpoint

In the `GET /me` handler, include role in the response:

Change:
```typescript
res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
```

To:
```typescript
res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role || "customer" } });
```

Do the same for the `PUT /me` response.

---

## Step 5: Add Admin API Routes Shell

**File:** `artifacts/api-server/src/routes/qb-portal.ts`

Add placeholder admin routes at the bottom of the file, before `export default router`. These are empty shells that return basic data — the full implementations come in Prompt 05. The purpose here is to set up the route structure and confirm the `requireOperator` middleware works.

```typescript
// ============================================
// ADMIN ROUTES — Operator-only endpoints
// ============================================

// Admin dashboard summary
router.get("/admin/dashboard", requireOperator, async (_req: Request, res: Response) => {
  try {
    const pendingOrders = await db.select().from(qbOrders).where(eq(qbOrders.status, "submitted"));
    const openTickets = await db.select().from(qbSupportTickets).where(eq(qbSupportTickets.status, "open"));
    const totalUsers = await db.select().from(qbUsers);

    res.json({
      pendingOrderCount: pendingOrders.length,
      openTicketCount: openTickets.length,
      totalCustomerCount: totalUsers.filter(u => (u.role || "customer") !== "operator").length,
      totalOrderCount: 0, // Will be implemented with proper counting in Prompt 05
      revenueToday: 0,    // Will be implemented with Stripe integration in Prompt 05
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

// Admin: list all orders (not just current user's)
router.get("/admin/orders", requireOperator, async (_req: Request, res: Response) => {
  try {
    const orders = await db.select().from(qbOrders).orderBy(desc(qbOrders.createdAt));
    res.json({ orders });
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin: list all support tickets (not just current user's)
router.get("/admin/tickets", requireOperator, async (_req: Request, res: Response) => {
  try {
    const tickets = await db.select().from(qbSupportTickets).orderBy(desc(qbSupportTickets.createdAt));
    res.json({ tickets });
  } catch (err) {
    console.error("Admin tickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

// Admin: list all customers
router.get("/admin/customers", requireOperator, async (_req: Request, res: Response) => {
  try {
    const customers = await db.select({
      id: qbUsers.id,
      email: qbUsers.email,
      name: qbUsers.name,
      phone: qbUsers.phone,
      role: qbUsers.role,
      createdAt: qbUsers.createdAt,
    }).from(qbUsers).orderBy(desc(qbUsers.createdAt));
    res.json({ customers });
  } catch (err) {
    console.error("Admin customers error:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});
```

---

## Step 6: Update Frontend Auth Context

**File:** `artifacts/qb-portal/src/lib/auth.tsx`

### 6a. Add `role` to the User interface

Update the `User` interface:

```typescript
interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
}
```

### 6b. Add `isOperator` computed property to the auth context

Update the `AuthContextType` interface:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOperator: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}
```

In the `AuthProvider`, add the computed value:

```typescript
const isOperator = user?.role === "operator";
```

And include it in the provider value:

```typescript
<AuthContext.Provider value={{ user, loading, isOperator, login, register, logout }}>
```

---

## Step 7: Create the Admin Layout Shell

### 7a. Create the admin layout component

**File:** Create `artifacts/qb-portal/src/components/admin-layout.tsx`

```tsx
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, ShoppingCart, Users, MessageSquare, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/tickets", label: "Tickets", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isOperator, logout } = useAuth();
  const [location] = useLocation();

  if (!user || !isOperator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display text-primary mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">You must be logged in as an operator to access this area.</p>
          <Link href="/login">
            <Button className="bg-navy hover:bg-navy/90 text-white">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-lg font-bold font-display">NexFortis Admin</h1>
          <p className="text-xs text-white/60 mt-1">{user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white cursor-pointer mt-1 transition-colors">
              ← Back to Portal
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 7b. Create admin page shells

**File:** Create `artifacts/qb-portal/src/pages/admin/dashboard.tsx`

```tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, MessageSquare, Users, DollarSign } from "lucide-react";
import { getAuthToken } from "@/lib/auth";
import { SEO } from "@/components/seo";

interface DashboardData {
  pendingOrderCount: number;
  openTicketCount: number;
  totalCustomerCount: number;
  totalOrderCount: number;
  revenueToday: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    fetch("/api/qb/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <SEO title="Admin Dashboard" description="NexFortis QB Portal admin dashboard" path="/admin" noIndex />
      <h1 className="text-2xl font-bold font-display text-primary mb-6">Dashboard</h1>
      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShoppingCart} label="Pending Orders" value={data.pendingOrderCount} color="text-amber-500" />
          <StatCard icon={MessageSquare} label="Open Tickets" value={data.openTicketCount} color="text-blue-500" />
          <StatCard icon={Users} label="Total Customers" value={data.totalCustomerCount} color="text-green-500" />
          <StatCard icon={DollarSign} label="Revenue Today" value={`$${(data.revenueToday / 100).toFixed(2)}`} color="text-accent" />
        </div>
      ) : (
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
      )}
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold font-display text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}
```

**File:** Create `artifacts/qb-portal/src/pages/admin/orders.tsx`

```tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthToken } from "@/lib/auth";
import { SEO } from "@/components/seo";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    fetch("/api/qb/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <SEO title="Orders — Admin" description="Manage all QB Portal orders" path="/admin/orders" noIndex />
      <h1 className="text-2xl font-bold font-display text-primary mb-6">Orders</h1>
      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No orders yet. Orders will appear here once customers start purchasing.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Total</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">#{order.id}</td>
                      <td className="p-3">{order.customerName}<br /><span className="text-xs text-muted-foreground">{order.customerEmail}</span></td>
                      <td className="p-3">{order.serviceName}</td>
                      <td className="p-3">${(order.totalCad / 100).toFixed(2)}</td>
                      <td className="p-3"><StatusBadge status={order.status} /></td>
                      <td className="p-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    submitted: "bg-amber-100 text-amber-700",
    pending_payment: "bg-gray-100 text-gray-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
```

**File:** Create `artifacts/qb-portal/src/pages/admin/customers.tsx`

```tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthToken } from "@/lib/auth";
import { SEO } from "@/components/seo";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    fetch("/api/qb/admin/customers", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <SEO title="Customers — Admin" description="View all QB Portal customers" path="/admin/customers" noIndex />
      <h1 className="text-2xl font-bold font-display text-primary mb-6">Customers</h1>
      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading customers...</div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No customers yet. Customers will appear here once they register.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any) => (
                    <tr key={c.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">#{c.id}</td>
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.role === "operator" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {c.role || "customer"}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
```

**File:** Create `artifacts/qb-portal/src/pages/admin/tickets.tsx`

```tsx
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthToken } from "@/lib/auth";
import { SEO } from "@/components/seo";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    fetch("/api/qb/admin/tickets", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <SEO title="Tickets — Admin" description="Manage all support tickets" path="/admin/tickets" noIndex />
      <h1 className="text-2xl font-bold font-display text-primary mb-6">Support Tickets</h1>
      {loading ? (
        <div className="animate-pulse text-muted-foreground">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No support tickets yet. Tickets will appear here once customers submit them.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Subject</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t: any) => (
                    <tr key={t.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">#{t.id}</td>
                      <td className="p-3">{t.subject}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "open" ? "bg-amber-100 text-amber-700" :
                          t.status === "resolved" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
```

---

## Step 8: Register Admin Routes in the Frontend Router

**File:** `artifacts/qb-portal/src/App.tsx`

### 8a. Import the admin page components

Add these imports at the top with the other page imports:

```tsx
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminCustomers from "@/pages/admin/customers";
import AdminTickets from "@/pages/admin/tickets";
```

### 8b. Add admin routes

Inside the `<Switch>` block, add the admin routes **before** the `<Route component={NotFound} />` catch-all:

```tsx
<Route path="/admin" component={AdminDashboard} />
<Route path="/admin/orders" component={AdminOrders} />
<Route path="/admin/customers" component={AdminCustomers} />
<Route path="/admin/tickets" component={AdminTickets} />
```

### 8c. Add admin link in the portal header/navigation

**File:** `artifacts/qb-portal/src/components/layout.tsx`

Find where the user navigation links are rendered (typically in the header/navbar). If there's a user dropdown or menu showing "Portal", "Logout", etc., add an "Admin" link that only appears for operators:

```tsx
{user?.role === "operator" && (
  <Link href="/admin">
    <span className="text-sm text-rose-gold hover:underline font-medium">Admin</span>
  </Link>
)}
```

Import `useAuth` if not already imported in layout.tsx and destructure `user` from it.

---

## Step 9: Update robots.txt and sitemap.xml

**File:** `artifacts/qb-portal/public/robots.txt`

Add `/admin` to the disallow list:

```
Disallow: /admin
```

**File:** `artifacts/qb-portal/public/sitemap.xml`

Do NOT add any admin routes to the sitemap. Admin pages should never be indexed.

---

## Step 10: Verify

1. Run `pnpm typecheck` from the repo root — fix any TypeScript errors
2. Run the database migration and seed (Step 2 and Step 3)
3. Test in the Replit preview:
   - **Login as operator** (h.sadiq@nexfortis.com / Hassan8488$@):
     - Login should succeed
     - "Admin" link should appear in the header/navigation
     - Navigate to `/admin` — should see the admin dashboard with stat cards
     - Navigate to `/admin/orders` — should see orders table (may be empty)
     - Navigate to `/admin/customers` — should see customers list
     - Navigate to `/admin/tickets` — should see tickets list (may be empty)
     - Sidebar navigation should highlight the active page
     - "Back to Portal" link should return to the main portal
   - **Login as regular customer** (or register a new account):
     - "Admin" link should NOT appear in the header
     - Navigate to `/admin` directly — should see "Admin Access Required" message with link to login
   - **API security test** — use the browser dev tools Network tab:
     - As a customer, try `GET /api/qb/admin/dashboard` — should return 403
     - As operator, try `GET /api/qb/admin/dashboard` — should return 200 with dashboard data
4. Grep for security issues:
   - `grep -rn "operator" artifacts/api-server/src/routes/qb-portal.ts` — confirm requireOperator is on all admin routes
   - `grep -rn "admin" artifacts/qb-portal/public/robots.txt` — confirm /admin is disallowed
5. Fix any issues found in steps 1–4 before considering this task complete.

---

## Constraints

- Do NOT modify any files in `docs/` — documentation is managed separately
- Do NOT modify `artifacts/nexfortis/` — main site changes come later
- Do NOT modify `artifacts/qb-portal/public/products.json` — catalog data is managed separately
- Do NOT implement full order management (status updates, file upload/download) — that comes in Prompt 05
- Do NOT implement ticket reply functionality — that comes in Prompt 08
- Do NOT implement promo code management — that comes in Prompt 10
- Do NOT implement subscription management — that comes in Prompt 07
- Do NOT build the audit log table yet — that comes with the full admin panel in Prompt 05
- The admin pages created here are functional shells — they read data but do not write/update data yet
- The admin layout does NOT use the main `<Layout>` component (no customer-facing header/footer) — it has its own sidebar navigation
