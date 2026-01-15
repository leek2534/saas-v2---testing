"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Package, Search, MoreHorizontal, Edit, Trash2, Copy, Sparkles, TrendingUp, Archive, DollarSign } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6 mb-6">
          <Package className="h-16 w-16 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No products yet</h3>
        <p className="text-muted-foreground text-center mb-8 max-w-md">
          Start building your catalog by creating your first product. Add digital products, physical goods, or services.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="products/new">
            <Plus className="h-5 w-5" />
            Create Your First Product
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const products = useQuery(api.catalog.listProducts, 
    statusFilter !== "all" ? { status: statusFilter as any } : 
    typeFilter !== "all" ? { type: typeFilter as any } : 
    undefined
  );
  const createProduct = useMutation(api.catalog.createProduct);
  const deleteProduct = useMutation(api.catalog.deleteProduct);

  if (team == null) return null;

  if (products === undefined) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-11 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.shortDescription && product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         product.tags?.some((tag: any) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleDuplicate = async (productId: string) => {
    try {
      const product = products.find((p: any) => p._id === productId);
      if (!product) return;

      await createProduct({
        name: `${product.name} (Copy)`,
        handle: `${product.handle}-copy-${Date.now()}`,
        status: product.status,
        type: product.type,
        sku: product.sku ? `${product.sku}-COPY` : undefined,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        tags: product.tags,
      });
      
      toast({ title: "Product duplicated", description: "Successfully created a copy of the product." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to duplicate product", variant: "destructive" });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Delete this product and all its prices?")) return;
    
    try {
      await deleteProduct({ productId });
      toast({ title: "Product deleted", description: "Product and associated prices removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-800 border-emerald-200",
      draft: "bg-amber-100 text-amber-800 border-amber-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const getTypeIcon = (type: string) => ({ digital: "💻", physical: "📦", service: "🛠️" }[type] || "📦");
  const getTypeBadge = (type: string) => {
    const styles = {
      digital: "bg-blue-100 text-blue-800",
      physical: "bg-orange-100 text-orange-800",
      service: "bg-purple-100 text-purple-800"
    };
    return styles[type as keyof typeof styles] || styles.digital;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Package className="h-10 w-10 text-blue-600" />
            Products
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage your product catalog and pricing</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href={`/t/${teamSlug}/catalog/products/new`}>
            <Plus className="h-5 w-5" />
            New Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { icon: Package, label: "Total", value: products.length, color: "blue" },
          { icon: Sparkles, label: "Active", value: products.filter((p: any) => p.status === "active").length, color: "emerald" },
          { icon: TrendingUp, label: "Draft", value: products.filter((p: any) => p.status === "draft").length, color: "amber" },
          { icon: Archive, label: "Archived", value: products.filter((p: any) => p.status === "archived").length, color: "gray" }
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-xl bg-${color}-100 p-3`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{label}</p>
                  <p className="text-3xl font-bold">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: any) => (
            <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                      {getTypeIcon(product.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl truncate mb-2">{product.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs font-semibold", getStatusBadge(product.status))}>
                          {product.status}
                        </Badge>
                        <Badge variant="outline" className={cn("text-xs font-semibold", getTypeBadge(product.type))}>
                          {product.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/t/${teamSlug}/catalog/products/${product._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/t/${teamSlug}/catalog/products/${product._id}/prices`}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Manage Prices
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDuplicate(product._id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product._id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {product.shortDescription || "No description"}
                </p>
                
                {product.sku && (
                  <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    SKU: {product.sku}
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag: any) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                    <Link href={`/t/${teamSlug}/catalog/products/${product._id}`}>
                      <Edit className="h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                    <Link href={`/t/${teamSlug}/catalog/products/${product._id}/prices`}>
                      <DollarSign className="h-3 w-3" />
                      Prices
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
