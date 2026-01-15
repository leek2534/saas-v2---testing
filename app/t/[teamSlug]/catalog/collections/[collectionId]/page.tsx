"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  FolderOpen, 
  Package,
  Edit,
  Trash2,
  Eye,
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Mock data - will replace with real Convex calls
const mockCollection = {
  _id: "col_1",
  name: "Design Templates",
  handle: "design-templates",
  description: "Professional design templates for various purposes",
  productCount: 8,
  createdAt: Date.now() - 86400000,
  products: [
    { 
      _id: "1", 
      name: "Premium Design Template", 
      handle: "premium-design-template",
      status: "active" as const,
      type: "digital" as const,
      shortDescription: "Professional design template pack",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      price: "$49.00"
    },
    { 
      _id: "2", 
      name: "Business Card Template", 
      handle: "business-card-template",
      status: "active" as const,
      type: "digital" as const,
      shortDescription: "Modern business card designs",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      price: "$29.00"
    },
    { 
      _id: "3", 
      name: "Social Media Kit", 
      handle: "social-media-kit",
      status: "draft" as const,
      type: "digital" as const,
      shortDescription: "Complete social media template pack",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
      price: "$39.00"
    },
    { 
      _id: "4", 
      name: "Presentation Template", 
      handle: "presentation-template",
      status: "active" as const,
      type: "digital" as const,
      shortDescription: "Professional presentation slides",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop",
      price: "$59.00"
    },
    { 
      _id: "5", 
      name: "Logo Design Pack", 
      handle: "logo-design-pack",
      status: "active" as const,
      type: "digital" as const,
      shortDescription: "Logo design templates and elements",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop",
      price: "$79.00"
    },
    { 
      _id: "6", 
      name: "Brand Identity Kit", 
      handle: "brand-identity-kit",
      status: "draft" as const,
      type: "digital" as const,
      shortDescription: "Complete brand identity templates",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
      price: "$99.00"
    }
  ]
};

export default function CollectionDetailPage() {
  const team = useCurrentTeam();
  const { teamSlug, collectionId } = useParams();
  const { toast } = useToast();
  const [collection] = useState(mockCollection);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  if (team == null) {
    return null;
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === collection.products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(collection.products.map(p => p._id));
    }
  };

  const handleRemoveFromCollection = async (productId: string) => {
    try {
      // TODO: Replace with actual Convex call
      toast({
        title: "Removed",
        description: "Product removed from collection",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove product",
        variant: "destructive",
      });
    }
  };

  const handleBulkRemove = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      // TODO: Replace with actual Convex call
      toast({
        title: "Removed",
        description: `${selectedProducts.length} products removed from collection`,
      });
      setSelectedProducts([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove products",
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

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/t/${teamSlug}/catalog/collections`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Collections
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
              <p className="text-muted-foreground">
                {collection.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/t/${teamSlug}/catalog/collections/${collectionId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Collection
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/t/${teamSlug}/catalog/products/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Products
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{collection.productCount}</div>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collection.products.filter(p => p.status === "active").length}
                </div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collection.products.filter(p => p.status === "draft").length}
                </div>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {new Date(collection.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm text-muted-foreground">Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={selectedProducts.length === collection.products.length ? "default" : "outline"}
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedProducts.length === collection.products.length ? "Deselect All" : "Select All"}
              </Button>
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedProducts.length} selected
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleBulkRemove}
                  >
                    Remove from Collection
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "space-y-4"
      )}>
        {collection.products.map((product) => (
          <Card 
            key={product._id} 
            className={cn(
              "group relative overflow-hidden transition-all hover:shadow-lg",
              selectedProducts.includes(product._id) && "ring-2 ring-primary"
            )}
          >
            {viewMode === "grid" ? (
              <>
                <div className="aspect-square bg-muted relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="h-4 w-4 rounded border-white bg-white/80"
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(product.type)}</span>
                    <h3 className="font-medium truncate">{product.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      {product.price}
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/t/${teamSlug}/catalog/products/${product._id}`}>
                          <Eye className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveFromCollection(product._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <Badge className={getStatusColor(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">
                        {product.price}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/t/${teamSlug}/catalog/products/${product._id}`}>
                            View
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveFromCollection(product._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="h-4 w-4 rounded"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {collection.products.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products in this collection</h3>
              <p className="text-muted-foreground mb-6">
                Add products to this collection to get started
              </p>
              <Button asChild>
                <Link href={`/t/${teamSlug}/catalog/products/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
