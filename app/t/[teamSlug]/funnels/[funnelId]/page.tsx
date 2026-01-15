"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentTeam } from "@/app/t/[teamSlug]/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Settings, ExternalLink, Trash2, Check } from "lucide-react";
import Link from "next/link";
import type { CheckoutConfig, OfferConfig } from "@/src/features/funnels/types";
import { TemplateSelector } from "@/src/features/funnels/components/TemplateSelector";
import type { PageTemplate } from "@/src/features/funnels/templates/checkout-templates";

export default function FunnelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const team = useCurrentTeam();
  const funnelId = params.funnelId as string;
  
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [pendingStepType, setPendingStepType] = useState<"checkout" | "offer" | "thankyou" | "page" | null>(null);
  
  console.log("FunnelDetailPage render - selectedStepId:", selectedStepId);
  
  const funnel = useQuery(
    api.funnels.getFunnelById,
    funnelId ? { funnelId: funnelId as Id<"funnels"> } : "skip"
  );
  
  const steps = useQuery(
    api.funnelSteps.listStepsByFunnel,
    funnelId ? { funnelId: funnelId as Id<"funnels"> } : "skip"
  );
  
  const createStep = useMutation(api.funnelSteps.createStep);
  const deleteStep = useMutation(api.funnelSteps.deleteStep);
  
  const selectedStep = steps?.find((s: any) => s._id === selectedStepId);

  const handleCreateStep = async (type: "checkout" | "offer" | "thankyou" | "page") => {
    console.log("handleCreateStep called with type:", type);
    
    if (!team || !funnelId) {
      console.log("No team or funnelId, returning");
      return;
    }
    
    // For checkout steps, show template selector
    if (type === "checkout") {
      console.log("Opening template selector for checkout step");
      setPendingStepType(type);
      setTemplateSelectorOpen(true);
      setIsAddingStep(false);
      return;
    }
    
    // For other types, create directly
    const names = {
      checkout: "Checkout",
      offer: "Offer",
      thankyou: "Thank You",
      page: "Page",
    };
    
    try {
      await createStep({
        orgId: team._id,
        funnelId: funnelId as Id<"funnels">,
        type,
        name: names[type],
      });
      setIsAddingStep(false);
    } catch (error) {
      console.error("Failed to create step:", error);
    }
  };

  const handleTemplateSelect = async (template: PageTemplate | null) => {
    if (!team || !funnelId || !pendingStepType) return;
    
    const names = {
      checkout: "Checkout",
      offer: "Offer",
      thankyou: "Thank You",
      page: "Page",
    };
    
    try {
      const pageTree = template ? JSON.stringify({ version: 2, tree: template.tree }) : undefined;
      
      await createStep({
        orgId: team._id,
        funnelId: funnelId as Id<"funnels">,
        type: pendingStepType,
        name: names[pendingStepType],
        pageTree,
      });
      
      setPendingStepType(null);
    } catch (error) {
      console.error("Failed to create step:", error);
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm("Delete this step?")) return;
    
    try {
      await deleteStep({ stepId: stepId as Id<"funnelSteps"> });
      if (selectedStepId === stepId) {
        setSelectedStepId(null);
      }
    } catch (error) {
      console.error("Failed to delete step:", error);
    }
  };

  if (!team || !funnel) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <Link href={`/t/${team.slug}/funnels`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Funnels
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{funnel.name}</h1>
          <p className="text-muted-foreground mt-1">/f/{funnel.handle}</p>
        </div>
        
        <Badge variant={
          funnel.status === "active" ? "default" :
          funnel.status === "draft" ? "secondary" :
          "outline"
        }>
          {funnel.status}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Funnel Steps</CardTitle>
            
            <DropdownMenu open={isAddingStep} onOpenChange={setIsAddingStep}>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleCreateStep("checkout")}>
                  Checkout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateStep("offer")}>
                  Offer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateStep("thankyou")}>
                  Thank You
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateStep("page")}>
                  Page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          {!steps || steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No steps yet. Add your first step to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {steps.map((step: any, index: number) => (
                <div
                  key={step._id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  
                  <Badge variant="outline" className="capitalize">
                    {step.type}
                  </Badge>
                  
                  <div className="flex-1">
                    <div className="font-medium">{step.name}</div>
                    {step.page && (
                      <div className="text-sm text-muted-foreground">
                        Page: {step.page.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/t/${team.slug}/pages/${step.pageId}/edit`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Edit Page
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("Settings clicked for step:", step._id);
                        setSelectedStepId(step._id);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStep(step._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStepId && (
        <Sheet open={true} onOpenChange={(open) => !open && setSelectedStepId(null)}>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            {selectedStep ? (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedStep.name} Settings</SheetTitle>
                  <SheetDescription>
                    Configure this {selectedStep.type} step
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6">
                  {selectedStep.type === "checkout" && (
                    <CheckoutStepSettings step={selectedStep} />
                  )}
                  {selectedStep.type === "offer" && (
                    <OfferStepSettings step={selectedStep} />
                  )}
                  {selectedStep.type === "thankyou" && (
                    <ThankYouStepSettings step={selectedStep} />
                  )}
                  {selectedStep.type === "page" && (
                    <PageStepSettings step={selectedStep} />
                  )}
                  {!["checkout", "offer", "thankyou", "page"].includes(selectedStep.type) && (
                    <div className="p-4 text-sm text-muted-foreground">
                      No settings available for this step type: {selectedStep.type}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">
                Loading step settings...
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}

      <TemplateSelector
        open={templateSelectorOpen}
        onClose={() => {
          setTemplateSelectorOpen(false);
          setPendingStepType(null);
        }}
        onSelect={handleTemplateSelect}
        stepType={pendingStepType || "checkout"}
      />
    </div>
  );
}

function CheckoutStepSettings({ step }: { step: any }) {
  const updateStepConfig = useMutation(api.funnelSteps.updateStepConfig);
  const products = useQuery(api.catalog.products.listProducts, {});
  const steps = useQuery(api.funnelSteps.listStepsByFunnel, { funnelId: step.funnelId });
  
  console.log("CheckoutStepSettings - products:", products);
  console.log("CheckoutStepSettings - steps:", steps);
  
  const [config, setConfig] = useState<Partial<CheckoutConfig>>(() => {
    try {
      return step.config ? JSON.parse(step.config) : {
        mode: "payment_intent" as const,
        priceIds: [],
        quantities: [],
        enableOneClickOffers: false,
        onSuccessStepId: null,
      };
    } catch {
      return {
        mode: "payment_intent" as const,
        priceIds: [],
        quantities: [],
        enableOneClickOffers: false,
        onSuccessStepId: null,
      };
    }
  });
  
  const [selectedPrices, setSelectedPrices] = useState<Set<string>>(new Set(
    config.priceIds || []
  ));

  if (!products) {
    return <div className="p-4 text-sm text-muted-foreground">Loading products...</div>;
  }

  if (!steps) {
    return <div className="p-4 text-sm text-muted-foreground">Loading steps...</div>;
  }
  
  const handleSave = async () => {
    const priceIds = Array.from(selectedPrices);
    const quantities = priceIds.map(() => 1); // Default quantity of 1 for each
    
    const newConfig: CheckoutConfig = {
      mode: config.mode || "payment_intent",
      priceIds,
      quantities,
      enableOneClickOffers: config.enableOneClickOffers || false,
      onSuccessStepId: config.onSuccessStepId || null,
    };
    
    await updateStepConfig({
      stepId: step._id,
      config: JSON.stringify(newConfig),
    });
  };
  
  const togglePrice = (priceId: string) => {
    const newSet = new Set(selectedPrices);
    if (newSet.has(priceId)) {
      newSet.delete(priceId);
    } else {
      newSet.add(priceId);
    }
    setSelectedPrices(newSet);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Products</CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products found. Create products in the Catalog first.
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((product: any) => (
                <div key={product._id} className="border rounded-lg p-3">
                  <div className="font-medium mb-2">{product.name}</div>
                  {product.prices?.map((price: any) => {
                    const isSelected = selectedPrices.has(price._id);
                    const billingLabel = price.billing.type === "recurring" 
                      ? `$${(price.amount / 100).toFixed(2)}/${price.billing.interval}`
                      : `$${(price.amount / 100).toFixed(2)} one-time`;
                    
                    return (
                      <button
                        key={price._id}
                        type="button"
                        onClick={() => togglePrice(price._id)}
                        className={`w-full flex items-center justify-between p-2 rounded border text-sm transition-colors ${
                          isSelected 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "hover:bg-accent"
                        }`}
                      >
                        <span>{billingLabel}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="one-click">Enable One-Click Offers</Label>
            <Switch
              id="one-click"
              checked={config.enableOneClickOffers || false}
              onCheckedChange={(checked) => setConfig({ ...config, enableOneClickOffers: checked })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Save payment method for one-click upsells
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Routing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>On Success</Label>
            <select 
              className="w-full p-2 border rounded"
              value={config.onSuccessStepId || ""}
              onChange={(e) => setConfig({ ...config, onSuccessStepId: e.target.value || null })}
            >
              <option value="">Select next step...</option>
              {steps?.filter((s: any) => s._id !== step._id).map((s: any) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Checkout Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="colorPrimary">Primary Color</Label>
            <div className="flex gap-2">
              <input
                id="colorPrimary"
                type="color"
                value={config.appearance?.colorPrimary || "#0070f3"}
                onChange={(e) => setConfig({ 
                  ...config, 
                  appearance: { ...config.appearance, colorPrimary: e.target.value }
                })}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={config.appearance?.colorPrimary || "#0070f3"}
                onChange={(e) => setConfig({ 
                  ...config, 
                  appearance: { ...config.appearance, colorPrimary: e.target.value }
                })}
                className="flex-1 p-2 border rounded text-sm"
                placeholder="#0070f3"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colorText">Text Color</Label>
            <div className="flex gap-2">
              <input
                id="colorText"
                type="color"
                value={config.appearance?.colorText || "#30313d"}
                onChange={(e) => setConfig({ 
                  ...config, 
                  appearance: { ...config.appearance, colorText: e.target.value }
                })}
                className="h-10 w-20 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={config.appearance?.colorText || "#30313d"}
                onChange={(e) => setConfig({ 
                  ...config, 
                  appearance: { ...config.appearance, colorText: e.target.value }
                })}
                className="flex-1 p-2 border rounded text-sm"
                placeholder="#30313d"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius</Label>
            <select
              id="borderRadius"
              value={config.appearance?.borderRadius || "8px"}
              onChange={(e) => setConfig({ 
                ...config, 
                appearance: { ...config.appearance, borderRadius: e.target.value }
              })}
              className="w-full p-2 border rounded"
            >
              <option value="0px">Sharp (0px)</option>
              <option value="4px">Small (4px)</option>
              <option value="8px">Medium (8px)</option>
              <option value="12px">Large (12px)</option>
              <option value="16px">Extra Large (16px)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Font Family</Label>
            <select
              id="fontFamily"
              value={config.appearance?.fontFamily || "system-ui, sans-serif"}
              onChange={(e) => setConfig({ 
                ...config, 
                appearance: { ...config.appearance, fontFamily: e.target.value }
              })}
              className="w-full p-2 border rounded"
            >
              <option value="system-ui, sans-serif">System UI</option>
              <option value="Inter, sans-serif">Inter</option>
              <option value="Roboto, sans-serif">Roboto</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
            </select>
          </div>
          
          <p className="text-xs text-muted-foreground">
            These styles will be applied to the Stripe checkout form at runtime.
          </p>
        </CardContent>
      </Card>
      
      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}

function OfferStepSettings({ step }: { step: any }) {
  const updateStepConfig = useMutation(api.funnelSteps.updateStepConfig);
  const products = useQuery(api.catalog.products.listProducts, {});
  const steps = useQuery(api.funnelSteps.listStepsByFunnel, { funnelId: step.funnelId });
  
  const [config, setConfig] = useState<Partial<OfferConfig>>(() => {
    try {
      return step.config ? JSON.parse(step.config) : {
        offerId: `offer_${Date.now()}`,
        priceId: "",
        quantity: 1,
        onAcceptStepId: null,
        onDeclineStepId: null,
      };
    } catch {
      return {
        offerId: `offer_${Date.now()}`,
        priceId: "",
        quantity: 1,
        onAcceptStepId: null,
        onDeclineStepId: null,
      };
    }
  });

  if (!products) {
    return <div className="p-4 text-sm text-muted-foreground">Loading products...</div>;
  }

  if (!steps) {
    return <div className="p-4 text-sm text-muted-foreground">Loading steps...</div>;
  }
  
  const handleSave = async () => {
    const newConfig: OfferConfig = {
      offerId: config.offerId || `offer_${Date.now()}`,
      priceId: config.priceId || "",
      quantity: config.quantity || 1,
      onAcceptStepId: config.onAcceptStepId || null,
      onDeclineStepId: config.onDeclineStepId || null,
      headline: config.headline,
      subheadline: config.subheadline,
      bullets: config.bullets,
      imageUrl: config.imageUrl,
    };
    
    await updateStepConfig({
      stepId: step._id,
      config: JSON.stringify(newConfig),
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Offer Product</CardTitle>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products found. Create products in the Catalog first.
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((product: any) => (
                <div key={product._id} className="border rounded-lg p-3">
                  <div className="font-medium mb-2">{product.name}</div>
                  {product.prices?.map((price: any) => {
                    const isSelected = config.priceId === price._id;
                    const billingLabel = price.billing.type === "recurring" 
                      ? `$${(price.amount / 100).toFixed(2)}/${price.billing.interval}`
                      : `$${(price.amount / 100).toFixed(2)} one-time`;
                    
                    return (
                      <button
                        key={price._id}
                        type="button"
                        onClick={() => setConfig({ ...config, priceId: price._id })}
                        className={`w-full flex items-center justify-between p-2 rounded border text-sm transition-colors ${
                          isSelected 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "hover:bg-accent"
                        }`}
                      >
                        <span>{billingLabel}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Offer Copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Headline</Label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Special Offer!"
              value={config.headline || ""}
              onChange={(e) => setConfig({ ...config, headline: e.target.value })}
            />
          </div>
          <div>
            <Label>Subheadline</Label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Get this exclusive offer..."
              value={config.subheadline || ""}
              onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Routing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>On Accept</Label>
            <select 
              className="w-full p-2 border rounded"
              value={config.onAcceptStepId || ""}
              onChange={(e) => setConfig({ ...config, onAcceptStepId: e.target.value || null })}
            >
              <option value="">Select next step...</option>
              {steps?.filter((s: any) => s._id !== step._id).map((s: any) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>On Decline</Label>
            <select 
              className="w-full p-2 border rounded"
              value={config.onDeclineStepId || ""}
              onChange={(e) => setConfig({ ...config, onDeclineStepId: e.target.value || null })}
            >
              <option value="">Select next step...</option>
              {steps?.filter((s: any) => s._id !== step._id).map((s: any) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}

function ThankYouStepSettings({ step }: { step: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Linked to page: {step.page?.name || "Unknown"}
        </p>
        <Link href={`/t/${step.orgId}/pages/${step.pageId}/edit`}>
          <Button variant="outline" size="sm" className="mt-4">
            <ExternalLink className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function PageStepSettings({ step }: { step: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Linked to page: {step.page?.name || "Unknown"}
        </p>
        <Link href={`/t/${step.orgId}/pages/${step.pageId}/edit`}>
          <Button variant="outline" size="sm" className="mt-4">
            <ExternalLink className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
