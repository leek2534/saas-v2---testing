"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Tag, Image, FolderOpen, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Mock data - will replace with real Convex calls
const mockStats = {
  totalProducts: 12,
  activeProducts: 8,
  draftProducts: 3,
  archivedProducts: 1,
  totalCollections: 3,
  totalRevenue: "$2,450"
};

const mockProducts = [
  {
    _id: "1",
    name: "Premium Design Template",
    handle: "premium-design-template",
    status: "active" as const,
    type: "digital" as const,
    shortDescription: "Professional design template pack",
    imageIds: [],
    defaultImageId: undefined,
    tags: ["design", "template", "premium"],
    _creationTime: Date.now() - 86400000,
  },
  {
    _id: "2", 
    name: "Website Starter Kit",
    handle: "website-starter-kit",
    status: "draft" as const,
    type: "digital" as const,
    shortDescription: "Complete website starter package",
    imageIds: [],
    defaultImageId: undefined,
    tags: ["website", "starter", "kit"],
    _creationTime: Date.now() - 172800000,
  },
  {
    _id: "3",
    name: "Logo Design Service",
    handle: "logo-design-service", 
    status: "active" as const,
    type: "service" as const,
    shortDescription: "Custom logo design service",
    imageIds: [],
    defaultImageId: undefined,
    tags: ["logo", "design", "service"],
    _creationTime: Date.now() - 259200000,
  }
];

export default function CatalogPage() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  
  if (team == null) {
    return null;
  }

  const filteredProducts = products.filter(product => 
    filter === "all" || product.status === filter
  );

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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Catalog
          </h1>
          <p className="text-muted-foreground">
            Manage your products, prices, and collections
          </p>
        </div>
        <Button asChild>
          <Link href={`/t/${teamSlug}/catalog/products/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.activeProducts} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCollections}</div>
            <p className="text-xs text-muted-foreground">
              Product groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Products</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.draftProducts}</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              All time sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href={`/t/${teamSlug}/catalog/products`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                  <Package className="h-5 w-5" />
                </div>
                Products
              </CardTitle>
              <CardDescription>
                Manage your product catalog
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/t/${teamSlug}/catalog/collections`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center text-white">
                  <FolderOpen className="h-5 w-5" />
                </div>
                Collections
              </CardTitle>
              <CardDescription>
                Organize products into groups
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/t/${teamSlug}/catalog/products`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center text-white">
                  <Tag className="h-5 w-5" />
                </div>
                Pricing
              </CardTitle>
              <CardDescription>
                Manage product pricing options
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/t/${teamSlug}/catalog/images`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                  <Image className="h-5 w-5" />
                </div>
                Images
              </CardTitle>
              <CardDescription>
                Upload and manage product images
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>
                Your latest catalog items
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={filter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("draft")}
              >
                Draft
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {getTypeIcon(product.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(product.status)
                      )}>
                        {product.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.tags.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/t/${teamSlug}/catalog/products/${product._id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/t/${teamSlug}/catalog/products/${product._id}/prices`}>
                      Prices
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                {filter === "all" 
                  ? "Get started by creating your first product"
                  : `No ${filter} products found`
                }
              </p>
              {filter === "all" && (
                <Button className="mt-4" asChild>
                  <Link href={`/t/${teamSlug}/catalog/products/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Product
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
