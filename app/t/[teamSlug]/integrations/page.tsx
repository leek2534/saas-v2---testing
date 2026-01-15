"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, CheckCircle2 } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "Slack",
      description: "Get notifications and updates in your Slack workspace",
      icon: "💬",
      connected: true,
      category: "Communication"
    },
    {
      name: "Google Analytics",
      description: "Track your website analytics and user behavior",
      icon: "📊",
      connected: true,
      category: "Analytics"
    },
    {
      name: "Stripe",
      description: "Accept payments and manage subscriptions",
      icon: "💳",
      connected: false,
      category: "Payment"
    },
    {
      name: "Zapier",
      description: "Connect with 5000+ apps and automate workflows",
      icon: "⚡",
      connected: false,
      category: "Automation"
    },
    {
      name: "GitHub",
      description: "Sync your repositories and track deployments",
      icon: "🐙",
      connected: false,
      category: "Development"
    },
    {
      name: "Mailchimp",
      description: "Manage email campaigns and newsletters",
      icon: "📧",
      connected: false,
      category: "Marketing"
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your favorite tools and services
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                {integration.connected && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{integration.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              {integration.connected ? (
                <>
                  <span className="text-sm text-muted-foreground">Connected</span>
                  <Switch checked={true} />
                </>
              ) : (
                <Button className="w-full" variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage your API keys and webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Key</p>
                <p className="text-sm text-muted-foreground">sk_live_••••••••••••••••</p>
              </div>
              <Button variant="outline" size="sm">
                Regenerate
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Webhook URL</p>
                <p className="text-sm text-muted-foreground">https://api.yourapp.com/webhooks</p>
              </div>
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
