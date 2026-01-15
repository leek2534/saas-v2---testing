"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FunnelGuide } from "@/src/features/funnels/components/FunnelGuide";

export default function FunnelsPage() {
  const team = useCurrentTeam();
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  
  const funnels = useQuery(
    api.funnels.listFunnels,
    team ? { orgId: team._id } : "skip"
  );
  
  const createFunnel = useMutation(api.funnels.createFunnel);

  const handleCreate = async () => {
    if (!team || !name || !handle) return;
    
    try {
      const funnelId = await createFunnel({
        orgId: team._id,
        name,
        handle,
      });
      
      setIsCreateOpen(false);
      setName("");
      setHandle("");
      router.push(`/t/${team.slug}/funnels/${funnelId}`);
    } catch (error) {
      console.error("Failed to create funnel:", error);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!handle) {
      setHandle(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Funnels</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage multi-step sales funnels
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Funnel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Funnel</DialogTitle>
              <DialogDescription>
                Create a new multi-step funnel with checkout, offers, and thank you pages.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Funnel Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Product Funnel"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="handle">Handle (URL)</Label>
                <Input
                  id="handle"
                  placeholder="e.g., main-product-funnel"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Public URL: /f/{handle}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name || !handle}>
                Create Funnel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!funnels || funnels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No funnels yet</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Funnel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {funnels.map((funnel) => (
            <Card key={funnel._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {funnel.name}
                      <Badge variant={
                        funnel.status === "active" ? "default" :
                        funnel.status === "draft" ? "secondary" :
                        "outline"
                      }>
                        {funnel.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      /f/{funnel.handle}
                    </CardDescription>
                  </div>
                  
                  <Link href={`/t/${team.slug}/funnels/${funnel._id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Edit Funnel
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      
      <FunnelGuide />
    </div>
  );
}
