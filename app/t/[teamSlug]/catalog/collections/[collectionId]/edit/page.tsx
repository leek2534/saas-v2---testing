"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Mock data - will replace with real Convex calls
const mockCollection = {
  _id: "col_1",
  name: "Design Templates",
  handle: "design-templates",
  description: "Professional design templates for various purposes",
  createdAt: Date.now() - 86400000,
};

export default function EditCollectionPage() {
  const team = useCurrentTeam();
  const { teamSlug, collectionId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: mockCollection.name,
    handle: mockCollection.handle,
    description: mockCollection.description,
  });

  if (team == null) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      handle: prev.handle || generateHandle(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual Convex call
      console.log("Updating collection:", formData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: "Collection updated successfully",
      });
      
      router.push(`/t/${teamSlug}/catalog/collections/${collectionId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/t/${teamSlug}/catalog/collections/${collectionId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collection
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
              <p className="text-muted-foreground">
                Update collection information and settings
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/t/${teamSlug}/catalog/collections/${collectionId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Information</CardTitle>
            <CardDescription>
              Basic details about your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter collection name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handle">Handle *</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => handleInputChange("handle", e.target.value)}
                  placeholder="collection-handle"
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this collection contains"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Collection Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Statistics</CardTitle>
            <CardDescription>
              Information about this collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {new Date(mockCollection.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Created</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
