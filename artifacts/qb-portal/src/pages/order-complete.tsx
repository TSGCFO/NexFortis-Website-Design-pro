import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { SEO } from "@/components/seo";

interface OrderCompleteProps {
  orderId: number | null;
  serviceName: string | undefined;
  addonNames: string[];
  total: number;
  fileName: string | undefined;
  email: string;
}

export default function OrderComplete({ orderId, serviceName, addonNames, total, fileName, email }: OrderCompleteProps) {
  return (
    <div>
      <SEO title="Order Submitted" description="Your QuickBooks order has been received and is being processed." path="/order" noIndex />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Order Submitted</h1>
        </div>
      </section>
      <div className="brand-divider" />
      <section className="py-16 section-brand-light">
        <div className="max-w-lg mx-auto px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold font-display text-primary mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-4">Your order has been received. We'll begin processing shortly.</p>
              {orderId && <p className="text-sm font-medium text-primary mb-3">Order ID: ORD-{String(orderId).padStart(3, "0")}</p>}
              <div className="bg-muted rounded-lg p-4 text-left text-sm space-y-1">
                <p><strong>Service:</strong> {serviceName}</p>
                {addonNames.length > 0 && (
                  <p><strong>Add-ons:</strong> {addonNames.join(", ")}</p>
                )}
                <p><strong>Total:</strong> {formatPrice(total)}</p>
                <p><strong>File:</strong> {fileName}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">A confirmation email will be sent to {email}</p>
              <div className="mt-6">
                <Link href="/portal">
                  <Button className="bg-navy text-white hover:bg-navy/90 font-display">Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
