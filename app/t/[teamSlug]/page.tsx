"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";

export default function Home() {
  const team = useCurrentTeam();
  
  if (team == null) {
    return null;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to {team.name}</h1>
      <p className="text-muted-foreground">
        Use the sidebar to navigate to Funnel Builder and other features.
      </p>
    </div>
  );
}
