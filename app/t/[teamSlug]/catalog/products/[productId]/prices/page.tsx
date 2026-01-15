"use client";

import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - will replace with real Convex calls
const mockProduct = {
  _id: "1",
  name: "Premium Design Template",
  handle: "premium-design-template",
  status: "active" as const,
  type: "digital" as const,
  shortDescription: "Professional design template pack",
  stripeProductId: "prod_1234567890",
};

const mockPrices = [
  {
    _id: "price_1",
    productId: "1",
    nickname: "Standard",
    currency: "USD",
    amount: 4900, // $49.00
    billing: { type: "one_time" as const },
    active: true,
    isDefault: true,
    stripePriceId: "price_1234567890",
  },
  {
    _id: "price_2",
    productId: "1", 
    nickname: "Premium",
    currency: "USD",
    amount: 9900, // $99.00
    billing: { type: "one_time" as const },
    active: true,
    isDefault: false,
    stripePriceId: "price_1234567891",
  },
  {
    _id: "price_3",
    productId: "1",
    nickname: "Monthly Subscription",
    currency: "USD", 
    amount: 2900, // $29.00
    billing: { 
      type: "recurring" as const,
      interval: "month" as const,
      intervalCount: 1
    },
    active: true,
    isDefault: false,
    stripePriceId: "price_1234567892",
  },
  {
    _id: "price_4",
    productId: "1",
    nickname: "Annual Subscription",
    currency: "USD",
    amount: 29000, // $290.00
    billing: {
      type: "recurring" as const,
      interval: "year" as const,
      intervalCount: 1
    },
    active: false,
    isDefault: false,
    stripePriceId: "price_1234567893",
  }
];

export default function ProductPricesPage() {
  const team = useCurrentTeam();
  const { teamSlug, productId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  // Convex hooks for real data
  const product = useQuery(api.catalog.getProduct, { productId: productId as string });
  const prices = useQuery(api.catalog.listPrices, { productId: productId as string });
  const createPrice = useMutation(api.catalog.createPrice);
  const updatePrice = useMutation(api.catalog.updatePrice);
  const deletePrice = useMutation(api.catalog.deletePrice);

  const [newPrice, setNewPrice] = useState({
    nickname: "",
    currency: "USD",
    amount: "",
    billing: {
      type: "one_time" as "one_time" | "recurring",
      interval: "month" as "month" | "year",
      intervalCount: 1,
    },
    active: true,
    isDefault: false,
  });

  if (team == null) {
    return null;
  }

  // Handle loading states
  if (product === undefined || prices === undefined) {
    return <div className="p-8">Loading pricing information...</div>;
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const getBillingDisplay = (billing: any) => {
    if (billing.type === "one_time") {
      return "One-time";
    } else {
      const interval = billing.intervalCount === 1 ? billing.interval : `${billing.intervalCount} ${billing.interval}s`;
      return `Every ${interval}`;
    }
  };

  const handleCreatePrice = async () => {
    setIsLoading(true);
    try {
      const priceData = {
        productId: productId as string,
        nickname: newPrice.nickname,
        currency: newPrice.currency,
        amount: parseInt(newPrice.amount) * 100, // Convert to cents
        billing: newPrice.billing,
        isDefault: newPrice.isDefault,
      };

      await createPrice(priceData);
      
      toast({
        title: "Success!",
        description: "Price created successfully",
      });
      setIsCreateDialogOpen(false);
      
      // Reset form
      setNewPrice({
        nickname: "",
        currency: "USD",
        amount: "",
        billing: {
          type: "one_time",
          interval: "month",
          intervalCount: 1,
        },
        active: true,
        isDefault: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create price",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (priceId: string, active: boolean) => {
    try {
      await updatePrice({ 
        priceId, 
        active 
      });
      toast({
        title: "Updated",
        description: `Price ${active ? "activated" : "deactivated"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (priceId: string) => {
    try {
      // First, unset all prices as default, then set the new one
      const allPrices = await prices || [];
      for (const price of allPrices) {
        if (price.isDefault) {
          await updatePrice({ priceId: price._id, isDefault: false });
        }
      }
      await updatePrice({ priceId, isDefault: true });
      toast({
        title: "Updated",
        description: "Default price updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default price",
        variant: "destructive",
      });
    }
  };

  const handleDeletePrice = async (priceId: string) => {
    if (!confirm("Are you sure you want to delete this price?")) return;
    
    try {
      await deletePrice({ priceId });
      toast({
        title: "Deleted",
        description: "Price deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete price",
        variant: "destructive",
      });
    }
  };

  const handleEditPrice = (priceId: string) => {
    const price = prices.find((p: any) => p._id === priceId);
    if (price) {
      setEditingPriceId(priceId);
      setNewPrice({
        nickname: price.nickname,
        currency: price.currency,
        amount: price.amount.toString(),
        billing: price.billing,
        active: price.active,
        isDefault: price.isDefault,
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdatePrice = async () => {
    if (!newPrice.nickname || !newPrice.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const priceData = {
        nickname: newPrice.nickname,
        currency: newPrice.currency,
        amount: parseInt(newPrice.amount) * 100, // Convert to cents
        billing: newPrice.billing,
        active: newPrice.active,
        isDefault: newPrice.isDefault,
      };

      await updatePrice({ 
        priceId: editingPriceId as string, 
        ...priceData 
      });
      
      toast({
        title: "Success!",
        description: "Price updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingPriceId(null);
      
      // Reset form
      setNewPrice({
        nickname: "",
        currency: "USD",
        amount: "",
        billing: {
          type: "one_time",
          interval: "month",
          intervalCount: 1,
        },
        active: true,
        isDefault: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prices</h1>
            <p className="text-muted-foreground">
              Manage pricing options for "{product.name}"
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/t/${teamSlug}/catalog/products/${productId}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Price
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Price</DialogTitle>
                <DialogDescription>
                  Create a new pricing option for this product
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Display Name</Label>
                  <Input
                    id="nickname"
                    value={newPrice.nickname}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="e.g., Standard, Premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newPrice.amount}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="49.00"
                    step="0.01"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={newPrice.currency} onValueChange={(value) => setNewPrice(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Type</Label>
                    <Select value={newPrice.billing.type} onValueChange={(value: "one_time" | "recurring") => 
                      setNewPrice(prev => ({ 
                        ...prev, 
                        billing: { ...prev.billing, type: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newPrice.billing.type === "recurring" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interval</Label>
                      <Select value={newPrice.billing.interval} onValueChange={(value: "month" | "year") => 
                        setNewPrice(prev => ({ 
                          ...prev, 
                          billing: { ...prev.billing, interval: value }
                        }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intervalCount">Interval Count</Label>
                      <Input
                        id="intervalCount"
                        type="number"
                        value={newPrice.billing.intervalCount}
                        onChange={(e) => setNewPrice(prev => ({ 
                          ...prev, 
                          billing: { ...prev.billing, intervalCount: parseInt(e.target.value) || 1 }
                        }))}
                        min="1"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Price is available for purchase
                    </p>
                  </div>
                  <Switch
                    checked={newPrice.active}
                    onCheckedChange={(checked) => setNewPrice(prev => ({ ...prev, active: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default Price</Label>
                    <p className="text-xs text-muted-foreground">
                      Shown as the primary option
                    </p>
                  </div>
                  <Switch
                    checked={newPrice.isDefault}
                    onCheckedChange={(checked) => setNewPrice(prev => ({ ...prev, isDefault: checked }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePrice} disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Creating..." : "Create Price"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Price Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Price</DialogTitle>
                <DialogDescription>
                  Update pricing information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nickname">Price Name *</Label>
                  <Input
                    id="edit-nickname"
                    value={newPrice.nickname}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="e.g., Standard, Premium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={newPrice.amount}
                    onChange={(e) => setNewPrice(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="49.00"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-currency">Currency</Label>
                    <Select value={newPrice.currency} onValueChange={(value) => setNewPrice(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Type</Label>
                    <Select value={newPrice.billing.type} onValueChange={(value: "one_time" | "recurring") => 
                      setNewPrice(prev => ({ 
                        ...prev, 
                        billing: { ...prev.billing, type: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newPrice.billing.type === "recurring" && (
                  <div className="space-y-2">
                    <Label>Interval</Label>
                    <Select value={newPrice.billing.interval} onValueChange={(value: "month" | "year") => 
                      setNewPrice(prev => ({ 
                        ...prev, 
                        billing: { ...prev.billing, interval: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Price is available for purchase
                    </p>
                  </div>
                  <Switch
                    checked={newPrice.active}
                    onCheckedChange={(checked) => setNewPrice(prev => ({ ...prev, active: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Default Price</Label>
                    <p className="text-xs text-muted-foreground">
                      Shown as the primary option
                    </p>
                  </div>
                  <Switch
                    checked={newPrice.isDefault}
                    onCheckedChange={(checked) => setNewPrice(prev => ({ ...prev, isDefault: checked }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingPriceId(null);
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePrice} disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Updating..." : "Update Price"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Product Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg">
              {product.type === "digital" ? "💻" : product.type === "physical" ? "📦" : "🛠️"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-muted-foreground">{product.shortDescription}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  {product.status}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
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
        </CardContent>
      </Card>

      {/* Prices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pricing Options ({prices.length})</h3>
        </div>

        {prices.length > 0 ? (
          <div className="space-y-3">
            {prices.map((price) => (
              <Card key={price._id} className={cn(
                "transition-all",
                !price.active && "opacity-60"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        {price.billing.type === "one_time" ? (
                          <DollarSign className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Calendar className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{price.nickname}</h4>
                          {price.isDefault && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                              Default
                            </Badge>
                          )}
                          {!price.active && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(price.amount, price.currency)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {getBillingDisplay(price.billing)}
                          </span>
                        </div>
                        {price.stripePriceId && (
                          <div className="flex items-center gap-1 mt-2">
                            <CreditCard className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Synced with Stripe
                            </span>
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-4">
                        <Switch
                          checked={price.active}
                          onCheckedChange={(checked) => handleToggleActive(price._id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {price.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {!price.isDefault && price.active && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(price._id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPrice(price._id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View in Stripe
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeletePrice(price._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No prices yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first pricing option for this product
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Price
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
