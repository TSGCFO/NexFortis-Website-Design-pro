import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f7fa]">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 text-[#1a2744] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1a2744] mb-2">Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button className="bg-[#1a2744]">Go Home</Button>
            </Link>
            <Link href="/catalog">
              <Button variant="outline">Browse Services</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
