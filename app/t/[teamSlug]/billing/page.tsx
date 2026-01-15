"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro plan</CardDescription>
            </div>
            <Badge>Pro</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">$29/month</p>
              <p className="text-sm text-muted-foreground">Billed monthly</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Unlimited projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Priority support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">Custom branding</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2024</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your previous invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "Dec 1, 2024", amount: "$29.00", status: "Paid" },
              { date: "Nov 1, 2024", amount: "$29.00", status: "Paid" },
              { date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{invoice.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$0</div>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">5 projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Basic analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Community support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Most popular for teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$29</div>
            <p className="text-sm text-muted-foreground">per month</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>For large organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Custom</div>
            <p className="text-sm text-muted-foreground">contact us</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span className="text-sm">Custom integrations</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
