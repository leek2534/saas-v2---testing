"use client";

import React from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFunnelEditorStore } from "../store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PriceSelector } from "@/src/features/funnels/components/PriceSelector";
import { cn } from "@/lib/utils";

type AnyConfig = Record<string, any>;

function safeJsonParse(raw?: string | null): AnyConfig {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as AnyConfig) : {};
  } catch {
    return {};
  }
}

function StepBadge({ type }: { type: string }) {
  const label = type === "thankyou" ? "Confirmation" : type;
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 capitalize">
      {label}
    </span>
  );
}

export function StepSettingsPanel() {
  const ctx = useFunnelEditorStore((s) => s.stepContext);
  const activeStepId = useFunnelEditorStore((s) => s.activeStepId);
  const close = useFunnelEditorStore((s) => s.closeStepSettings);

  const updateStep = useMutation(api.funnelSteps.updateStep);
  const updateStepConfig = useMutation(api.funnelSteps.updateStepConfig);

  const step = React.useMemo(() => {
    if (!ctx || !activeStepId) return null;
    return ctx.steps.find((s) => s._id === activeStepId) ?? null;
  }, [ctx, activeStepId]);

  const [name, setName] = React.useState("");
  const [localConfig, setLocalConfig] = React.useState<AnyConfig>({});
  const [saving, setSaving] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!step) return;
    setName(step.name ?? "");
    setLocalConfig(safeJsonParse(step.config));
  }, [step?._id]);

  if (!ctx || !step) {
    return (
      <div className="h-full p-4">
        <div className="text-sm font-semibold text-slate-900">Step Settings</div>
        <p className="mt-2 text-sm text-slate-500">
          No funnel step context found for this page. Open this page from a funnel step.
        </p>
        <Button className="mt-4" variant="outline" onClick={close}>
          Back
        </Button>
      </div>
    );
  }

  const steps = ctx.steps;

  const setCfg = (patch: AnyConfig) => setLocalConfig((c) => ({ ...c, ...patch }));

  const saveAll = async (opts?: { alsoName?: boolean; alsoNext?: boolean }) => {
    setSaving(true);
    try {
      if (opts?.alsoName || opts?.alsoNext) {
        await updateStep({
          stepId: step._id as any,
          name: opts?.alsoName ? name : undefined,
          nextStepId: opts?.alsoNext ? (localConfig.nextStepId ?? step.nextStepId ?? undefined) : undefined,
        } as any);
      }
      // Persist config (without name/nextStepId duplicates)
      const configToSave: AnyConfig = { ...localConfig };
      delete configToSave.__ui;
      await updateStepConfig({
        stepId: step._id as any,
        config: JSON.stringify(configToSave),
      } as any);
      setLastSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  const warn: string[] = [];
  if (step.type === "checkout") {
    const ids: string[] = localConfig.priceIds ?? [];
    if (!Array.isArray(ids) || ids.length === 0) warn.push("Checkout has no prices selected");
  }
  if (step.type === "offer") {
    if (!localConfig.priceId) warn.push("Offer has no price selected");
  }
  if (!step.nextStepId && !localConfig.nextStepId) {
    // not hard error (some steps end)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4">
        <div className="min-w-0">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 gap-2" onClick={close}>
            <ArrowLeft className="h-4 w-4" />
            Back to Inspector
          </Button>
          <div className="flex items-center gap-2">
            <div className="truncate text-base font-semibold text-slate-900">
              Step Settings – {step.name}
            </div>
            <StepBadge type={step.type} />
          </div>
          {warn.length > 0 && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <span>{warn[0]}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button disabled={saving} onClick={() => saveAll({ alsoName: true, alsoNext: true })}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <div className="text-[11px] text-slate-500">
            {lastSavedAt ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}` : "Not saved yet"}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="general">General</TabsTrigger>
            {step.type === "checkout" && <TabsTrigger value="checkout">Checkout</TabsTrigger>}
            {step.type === "offer" && <TabsTrigger value="offer">Offer</TabsTrigger>}
            {step.type === "thankyou" && <TabsTrigger value="confirmation">Confirmation</TabsTrigger>}
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label>Step name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Checkout" />
            </div>

            <div className="space-y-2">
              <Label>Next step</Label>
              <select
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={(localConfig.nextStepId ?? step.nextStepId ?? "") as string}
                onChange={(e) => {
                  const next = e.target.value || null;
                  setCfg({ nextStepId: next });
                }}
              >
                <option value="">(none)</option>
                {steps
                  .filter((s) => s._id !== step._id)
                  .map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.type})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-slate-500">Used when this step completes (unless overridden by step type routing).</p>
            </div>

            <Separator />

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Tip: Use <span className="font-semibold">Design</span> in the Steps tab to change layout/styling. Use Step Settings
              to configure products, routing, and funnel logic.
            </div>
          </TabsContent>

          {step.type === "checkout" && (
            <TabsContent value="checkout" className="space-y-4">
              <div className="space-y-2">
                <Label>Prices</Label>
                <PriceSelector
                  orgId={ctx.orgId as any}
                  multiple
                  selectedPriceIds={(localConfig.priceIds ?? []) as string[]}
                  onSelect={(ids) => setCfg({ priceIds: ids })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900">Enable coupons</div>
                  <div className="text-xs text-slate-500">Allow coupon popup / coupon codes on checkout.</div>
                </div>
                <Switch
                  checked={Boolean(localConfig.couponsEnabled ?? true)}
                  onCheckedChange={(v) => setCfg({ couponsEnabled: v })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Success step</Label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={(localConfig.successStepId ?? "") as string}
                    onChange={(e) => setCfg({ successStepId: e.target.value || null })}
                  >
                    <option value="">(none)</option>
                    {steps.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Cancel step</Label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={(localConfig.cancelStepId ?? "") as string}
                    onChange={(e) => setCfg({ cancelStepId: e.target.value || null })}
                  >
                    <option value="">(none)</option>
                    {steps.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>
          )}

          {step.type === "offer" && (
            <TabsContent value="offer" className="space-y-4">
              <div className="space-y-2">
                <Label>Offer price</Label>
                <PriceSelector
                  orgId={ctx.orgId as any}
                  multiple={false}
                  selectedPriceIds={localConfig.priceId ? [localConfig.priceId] : []}
                  onSelect={(ids) => setCfg({ priceId: ids[0] ?? null })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Accept step</Label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={(localConfig.acceptStepId ?? "") as string}
                    onChange={(e) => setCfg({ acceptStepId: e.target.value || null })}
                  >
                    <option value="">(none)</option>
                    {steps.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Decline step</Label>
                  <select
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={(localConfig.declineStepId ?? "") as string}
                    onChange={(e) => setCfg({ declineStepId: e.target.value || null })}
                  >
                    <option value="">(none)</option>
                    {steps.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Offer headline</Label>
                <Input value={localConfig.headline ?? ""} onChange={(e) => setCfg({ headline: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Offer bullets</Label>
                <Textarea
                  value={(localConfig.bullets ?? []).join("\n")}
                  onChange={(e) => setCfg({ bullets: e.target.value.split("\n").filter(Boolean) })}
                  placeholder={"One bullet per line"}
                />
              </div>
            </TabsContent>
          )}

          {step.type === "thankyou" && (
            <TabsContent value="confirmation" className="space-y-4">
              <div className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                Confirmation steps typically show a receipt, next steps, and any onboarding instructions. Layout is controlled in the
                canvas; this panel controls routing and integrations.
              </div>

              <div className="space-y-2">
                <Label>Order source</Label>
                <Input
                  value={localConfig.orderSource ?? "stripe"}
                  onChange={(e) => setCfg({ orderSource: e.target.value })}
                  placeholder="stripe"
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <div className={cn("border-t border-slate-200 p-3 text-xs text-slate-500")}>
        Step config is stored in Convex under <span className="font-mono">funnelSteps.config</span>.
      </div>
    </div>
  );
}
