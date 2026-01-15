"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, Package } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function NewProductPage() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  
  const createProduct = useMutation(api.catalog.createProduct);

  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    status: "draft" as "draft" | "active" | "archived",
    type: "digital" as "digital" | "physical" | "service",
    sku: "",
    shortDescription: "",
    longDescription: "",
    tags: [] as string[],
  });

  if (team == null) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
      await createProduct({
        name: formData.name,
        handle: formData.handle,
        status: formData.status,
        type: formData.type,
        sku: formData.sku || undefined,
        shortDescription: formData.shortDescription || undefined,
        longDescription: formData.longDescription || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });
      
      toast({
        title: "Success!",
        description: "Product created successfully",
      });
      router.push(`/t/${teamSlug}/catalog/products`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      await createProduct({
        name: formData.name || "Untitled Product",
        handle: formData.handle || `untitled-${Date.now()}`,
        status: "draft",
        type: formData.type,
        sku: formData.sku || undefined,
        shortDescription: formData.shortDescription || undefined,
        longDescription: formData.longDescription || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      });
      
      toast({
        title: "Draft Saved",
        description: "Your draft has been saved",
      });
      router.push(`/t/${teamSlug}/catalog/products`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
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
            <Link href={`/t/${teamSlug}/catalog/products`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
            <p className="text-muted-foreground">
              Create a new product for your catalog
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential details about your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handle">Handle *</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => handleInputChange("handle", e.target.value)}
                  placeholder="product-handle"
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="PROD-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                placeholder="Brief description of your product"
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.shortDescription.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange("longDescription", e.target.value)}
                placeholder="Detailed description of your product, features, benefits, etc."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help customers find your product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview
            </CardTitle>
            <CardDescription>
              See how your product will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/50">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  {formData.type === "digital" ? "💻" : formData.type === "physical" ? "📦" : "🛠️"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {formData.name || "Product Name"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={
                      formData.status === "active" ? "bg-green-100 text-green-800" :
                      formData.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }>
                      {formData.status || "draft"}
                    </Badge>
                    <Badge className={
                      formData.type === "digital" ? "bg-blue-100 text-blue-800" :
                      formData.type === "physical" ? "bg-orange-100 text-orange-800" :
                      "bg-purple-100 text-purple-800"
                    }>
                      {formData.type || "digital"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {formData.shortDescription || "Product description will appear here..."}
                  </p>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
