"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Plus, 
  FolderOpen, 
  Search, 
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  DragDrop,
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - will replace with real Convex calls
const mockCollections = [
  {
    _id: "col_1",
    name: "Design Templates",
    handle: "design-templates",
    description: "Professional design templates for various purposes",
    productCount: 8,
    createdAt: Date.now() - 86400000,
    products: [
      { _id: "1", name: "Premium Design Template", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      { _id: "2", name: "Business Card Template", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop" },
      { _id: "3", name: "Social Media Kit", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    _id: "col_2",
    name: "Website Builders",
    handle: "website-builders",
    description: "Complete website starter kits and builders",
    productCount: 5,
    createdAt: Date.now() - 172800000,
    products: [
      { _id: "4", name: "Website Starter Kit", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop" },
      { _id: "5", name: "Landing Page Template", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop" },
    ]
  },
  {
    _id: "col_3",
    name: "Services",
    handle: "services",
    description: "Professional services and consulting packages",
    productCount: 3,
    createdAt: Date.now() - 259200000,
    products: [
      { _id: "6", name: "Logo Design Service", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop" },
      { _id: "7", name: "Brand Consulting", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    _id: "col_4",
    name: "Digital Products",
    handle: "digital-products",
    description: "Downloadable digital goods and resources",
    productCount: 12,
    createdAt: Date.now() - 604800000,
    products: [
      { _id: "8", name: "Ebook Template", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
      { _id: "9", name: "Icon Set", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop" },
    ]
  }
];

export default function CollectionsPage() {
  const team = useCurrentTeam();
  const { teamSlug } = useParams();
  const { toast } = useToast();
  const [collections, setCollections] = useState(mockCollections);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [newCollection, setNewCollection] = useState({
    name: "",
    handle: "",
    description: "",
  });

  if (team == null) {
    return null;
  }

  const filteredCollections = collections.filter(collection => 
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setNewCollection(prev => ({
      ...prev,
      name: value,
      handle: prev.handle || generateHandle(value)
    }));
  };

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Replace with actual Convex call
      const collectionData = {
        ...newCollection,
        productCount: 0,
        createdAt: Date.now(),
        products: [],
      };

      console.log("Creating collection:", collectionData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to local state
      const createdCollection = {
        _id: `col_${Date.now()}`,
        ...collectionData,
      };
      setCollections(prev => [createdCollection, ...prev]);
      
      toast({
        title: "Success!",
        description: "Collection created successfully",
      });
      
      setIsCreateDialogOpen(false);
      
      // Reset form
      setNewCollection({
        name: "",
        handle: "",
        description: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection? Products will not be deleted.")) return;
    
    try {
      // TODO: Replace with actual Convex call
      setCollections(prev => prev.filter(col => col._id !== collectionId));
      
      toast({
        title: "Deleted",
        description: "Collection deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/t/${teamSlug}/catalog`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Catalog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-muted-foreground">
              Organize your products into themed groups
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
                <DialogDescription>
                  Create a new collection to organize your products
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Collection Name *</Label>
                  <Input
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Design Templates"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handle">Handle *</Label>
                  <Input
                    id="handle"
                    value={newCollection.handle}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="design-templates"
                    pattern="[a-z0-9-]+"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL-friendly identifier (lowercase, numbers, hyphens only)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this collection"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCollection}>
                    Create Collection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{collections.length}</div>
                <p className="text-sm text-muted-foreground">Total Collections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collections.reduce((total, col) => total + col.productCount, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Products Organized</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Grid3X3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(collections.reduce((total, col) => total + col.productCount, 0) / collections.length)}
                </div>
                <p className="text-sm text-muted-foreground">Avg Products/Collection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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

      {/* Collections Grid/List */}
      {filteredCollections.length > 0 ? (
        <div className={cn(
          viewMode === "grid" 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredCollections.map((collection) => (
            <Card key={collection._id} className="group hover:shadow-lg transition-shadow">
              {viewMode === "grid" ? (
                <>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{collection.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {collection.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Collection
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteCollection(collection._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Product Preview Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {collection.products.slice(0, 6).map((product, index) => (
                          <div key={product._id} className="aspect-square rounded-md bg-muted overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {collection.productCount > 6 && (
                          <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              +{collection.productCount - 6}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Collection Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            {collection.productCount} products
                          </span>
                          <span className="text-muted-foreground">
                            {formatDate(collection.createdAt)}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {collection.products.slice(0, 4).map((product) => (
                        <div key={product._id} className="h-10 w-10 rounded-full bg-muted overflow-hidden border-2 border-background">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {collection.productCount > 4 && (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                          <span className="text-xs text-muted-foreground">
                            +{collection.productCount - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{collection.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {collection.productCount} products
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created {formatDate(collection.createdAt)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}`}>
                              View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Collection
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/t/${teamSlug}/catalog/collections/${collection._id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteCollection(collection._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No collections found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search" : "Create your first collection to organize products"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
