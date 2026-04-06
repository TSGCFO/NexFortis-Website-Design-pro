import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center section-brand-light">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <img src={`${import.meta.env.BASE_URL}images/logo-original.svg`} alt="NexFortis" className="h-12 mx-auto mb-4 dark:hidden" />
          <img src={`${import.meta.env.BASE_URL}images/logo-white.svg`} alt="NexFortis" className="h-12 mx-auto mb-4 hidden dark:block" />
          <h1 className="text-2xl font-bold font-display text-primary mb-2">Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button className="bg-navy text-white hover:bg-navy/90 font-display">Go Home</Button>
            </Link>
            <Link href="/catalog">
              <Button variant="outline" className="font-display">Browse Services</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
