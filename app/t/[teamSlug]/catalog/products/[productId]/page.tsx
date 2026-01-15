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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Package, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Settings
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data - will replace with real Convex calls
const mockProduct = {
  _id: "1",
  name: "Premium Design Template",
  handle: "premium-design-template",
  status: "active" as const,
  type: "digital" as const,
  sku: "PREM-DES-001",
  shortDescription: "Professional design template pack with 50+ templates",
  longDescription: "Complete professional design template pack including business cards, social media templates, presentations, and more. Perfect for businesses, agencies, and freelancers looking to create stunning designs quickly and efficiently.",
  imageIds: ["img_1", "img_2", "img_3"],
  defaultImageId: "img_1",
  tags: ["design", "template", "premium", "business"],
  stripeProductId: "prod_1234567890",
  _creationTime: Date.now() - 86400000,
};

const mockPrices = [
  {
    _id: "price_1",
    nickname: "Standard",
    currency: "USD",
    amount: 4900,
    billing: { type: "one_time" as const },
    active: true,
    isDefault: true,
  },
  {
    _id: "price_2",
    nickname: "Premium",
    currency: "USD",
    amount: 9900,
    billing: { type: "one_time" as const },
    active: true,
    isDefault: false,
  }
];

export default function ProductDetailPage() {
  const team = useCurrentTeam();
  const { teamSlug, productId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState(mockProduct);
  const [prices] = useState(mockPrices);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    name: product.name,
    handle: product.handle,
    status: product.status,
    type: product.type,
    sku: product.sku,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    tags: product.tags,
  });

  if (team == null) {
    return null;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Convex call
      console.log("Saving product:", formData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProduct(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
      setHasChanges(false);
      
      toast({
        title: "Success!",
        description: "Product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      handle: product.handle,
      status: product.status,
      type: product.type,
      sku: product.sku,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      tags: product.tags,
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      // TODO: Replace with actual Convex call
      toast({
        title: "Deleted",
        description: "Product deleted successfully",
      });
      router.push(`/t/${teamSlug}/catalog/products`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async () => {
    try {
      // TODO: Replace with actual Convex call
      toast({
        title: "Duplicated",
        description: "Product duplicated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "digital": return "💻";
      case "physical": return "📦";
      case "service": return "🛠️";
      default: return "📦";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/t/${teamSlug}/catalog/products`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Products
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg">
              {getTypeIcon(product.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                <Badge variant="outline">
                  {product.type}
                </Badge>
                {product.stripeProductId && (
                  <Badge variant="outline" className="text-xs">
                    ✓ Synced to Stripe
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? "View Mode" : "Edit"}
          </Button>
          {hasChanges && (
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Basic information about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle">Handle</Label>
                  <Input
                    id="handle"
                    value={formData.handle}
                    onChange={(e) => handleInputChange("handle", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => handleInputChange("status", value)}
                    disabled={!isEditing}
                  >
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
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: any) => handleInputChange("type", value)}
                    disabled={!isEditing}
                  >
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
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  disabled={!isEditing}
                  maxLength={200}
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
                  disabled={!isEditing}
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
                Help customers find your product with tags
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pricing Options</CardTitle>
                  <CardDescription>
                    Manage pricing and billing options for this product
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/t/${teamSlug}/catalog/products/${productId}/prices`}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Manage Prices
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prices.map((price) => (
                  <div key={price._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{price.nickname}</h4>
                          {price.isDefault && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(price.amount, price.currency)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {price.billing.type === "one_time" ? "One-time" : "Recurring"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/t/${teamSlug}/catalog/products/${productId}/prices`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Manage images for this product
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href={`/t/${teamSlug}/catalog/images`}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Manage Images
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&random=${i}`}
                      alt={`Product image ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
              <CardDescription>
                Advanced settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stripe Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync this product with Stripe
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {product.stripeProductId ? (
                    <>
                      <Badge variant="outline" className="text-xs">
                        ✓ Connected
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View in Stripe
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm">
                      Connect to Stripe
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Track views and conversions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SEO Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Optimize for search engines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground">
                      Irreversible actions for this product
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
