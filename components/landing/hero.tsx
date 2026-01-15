import { Button } from "@/components/ui/button";
import { Link } from "@/components/typography/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Build Your SaaS in{" "}
            <span className="text-primary">No Time</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A production-ready starter template with authentication, team
            management, billing, and everything you need to launch fast.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/t">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}






