import { Users, Shield, Zap, BarChart, Bell, CreditCard } from "lucide-react";

const features = [
  {
    name: "Team Management",
    description:
      "Create teams, invite members, and manage permissions with role-based access control.",
    icon: Users,
  },
  {
    name: "Secure Authentication",
    description:
      "Built-in authentication with Clerk. Sign up, sign in, and manage user sessions securely.",
    icon: Shield,
  },
  {
    name: "Real-time Updates",
    description:
      "Powered by Convex for instant updates. See changes as they happen across your team.",
    icon: Zap,
  },
  {
    name: "Analytics Ready",
    description:
      "Track team activity, member engagement, and usage metrics with built-in analytics.",
    icon: BarChart,
  },
  {
    name: "Notifications",
    description:
      "Stay informed with real-time notifications for invites, messages, and team updates.",
    icon: Bell,
  },
  {
    name: "Billing Ready",
    description:
      "Stripe integration ready. Add subscription plans and manage payments effortlessly.",
    icon: CreditCard,
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Production-ready features out of the box
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Focus on building your product, not setting up infrastructure.
            We&apos;ve handled the complex parts for you.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-primary-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}






