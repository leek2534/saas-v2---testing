"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";

export function SignOutButton() {
  return (
    <ClerkSignOutButton redirectUrl="/">
      <Button variant="outline">Sign Out</Button>
    </ClerkSignOutButton>
  );
}

export function SignOutButtonClient() {
  return (
    <ClerkSignOutButton redirectUrl="/">
      <Button variant="outline">Sign Out</Button>
    </ClerkSignOutButton>
  );
}






