import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Shield, Lock, AlertTriangle, Info, CheckCircle, Package } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

interface SvcOption {
  id: number;
  name: string;
  price: number;
}

interface OrderFormProps {
  services: SvcOption[];
  addons: SvcOption[];
  selectedService: number | null;
  setSelectedService: (id: number) => void;
  selectedAddons: number[];
  toggleAddon: (id: number) => void;
  isAvailableService: boolean | undefined;
  showFileUpload: boolean;
  isVolumePack: boolean;
  isSubscription: boolean;
  selectedProduct?: Product;
  acceptAttr?: string;
  file: File | null;
  fileError: string;
  fileWarning: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  qbVersion: string;
  setQbVersion: (v: string) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  total: number;
  submitting: boolean;
  submitError: string;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const qbVersions = ["2024", "2023", "2022", "2021", "2020", "2019"];

export default function OrderForm(props: OrderFormProps) {
  const { services, addons, selectedService, setSelectedService, selectedAddons, toggleAddon, isAvailableService,
    showFileUpload, isVolumePack, isSubscription, selectedProduct, acceptAttr,
    file, fileError, fileWarning, handleFileChange, qbVersion, setQbVersion, confirmed, setConfirmed,
    name, setName, email, setEmail, phone, setPhone, total, submitting, submitError, canSubmit, onSubmit } = props;

  let stepNumber = 2;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold font-display text-primary mb-4">1. Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Phone (optional)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold font-display text-primary mb-4">{++stepNumber - 1}. Select Service</h2>
          <div className="space-y-3">
            {services.map((svc) => (
              <label key={svc.id} className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${selectedService === svc.id ? "border-accent bg-accent/5 cursor-pointer" : "border-border hover:border-accent/30 cursor-pointer"}`}>
                <input type="radio" name="service" checked={selectedService === svc.id} onChange={() => setSelectedService(svc.id)} className="accent-accent" />
                <div className="flex-1"><span className="font-medium text-sm">{svc.name}</span></div>
                <span className="font-bold text-accent">{formatPrice(svc.price)}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {isAvailableService && !isVolumePack && !isSubscription && addons.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-display text-primary mb-4">{stepNumber++}. Add-Ons</h2>
            <div className="space-y-3">
              {addons.map((addon) => (
                <label key={addon.id} className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${selectedAddons.includes(addon.id) ? "border-accent bg-accent/5 cursor-pointer" : "border-border hover:border-accent/30 cursor-pointer"}`}>
                  <input type="checkbox" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} className="accent-accent" />
                  <div className="flex-1"><span className="font-medium text-sm">{addon.name}</span></div>
                  <span className="font-bold text-accent">+{formatPrice(addon.price)}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isAvailableService && isVolumePack && selectedProduct && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-display text-primary mb-4">{stepNumber++}. Pack Details</h2>
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  You are purchasing a pack of {selectedProduct.pack_size || "multiple"} conversions.
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  You will submit individual files for conversion after your order is confirmed. Credits are valid for 12 months.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isAvailableService && isSubscription && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-display text-primary mb-4">{stepNumber++}. Subscription Details</h2>
            <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg border border-accent/20">
              <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">
                  This is a monthly subscription service. No file upload is required at this time.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedProduct?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isAvailableService && showFileUpload && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-display text-primary mb-4">
              {stepNumber++}. Upload Your File
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <div className="mb-3">
                <label htmlFor="order-file" className="cursor-pointer">
                  <span className="text-accent font-medium hover:underline">Choose a file</span>
                  <input id="order-file" type="file" accept={acceptAttr} onChange={handleFileChange} className="hidden" />
                </label>
                <span className="text-sm text-muted-foreground ml-1">or drag and drop</span>
              </div>
              {file && (
                <div className="flex items-center gap-2 justify-center text-sm">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
              )}
              {fileError && <p className="text-sm text-red-500 mt-2 flex items-center gap-1 justify-center"><AlertTriangle className="w-4 h-4" /> {fileError}</p>}
              {fileWarning && <p className="text-sm text-amber-600 mt-2 flex items-center gap-1 justify-center"><Info className="w-4 h-4" /> {fileWarning}</p>}
              <p className="text-xs text-muted-foreground mt-3">
                Max file size: 500 MB &bull; Accepted: {selectedProduct?.accepted_file_types.join(", ") || ".qbm"}
                {selectedProduct?.accepted_file_types.includes(".qbm") && (
                  <> &bull; <Link href="/qbm-guide" className="text-accent">How to create a .QBM file</Link></>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isAvailableService && showFileUpload && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold font-display text-primary mb-4">{stepNumber++}. QuickBooks Version</h2>
            <select value={qbVersion} onChange={(e) => setQbVersion(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
              <option value="">Select your QuickBooks version year</option>
              {qbVersions.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold font-display text-primary mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {selectedService && services.find((s) => s.id === selectedService) && (
              <div className="flex justify-between">
                <span>{services.find((s) => s.id === selectedService)!.name}</span>
                <span className="font-semibold">{formatPrice(services.find((s) => s.id === selectedService)!.price)}</span>
              </div>
            )}
            {selectedAddons.map((id) => {
              const addon = addons.find((a) => a.id === id);
              return addon ? (
                <div key={id} className="flex justify-between text-muted-foreground">
                  <span>{addon.name}</span>
                  <span>+{formatPrice(addon.price)}</span>
                </div>
              ) : null;
            })}
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>
          </div>

          {selectedProduct?.slug === "audit-trail-cra-bundle" && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium text-primary mb-1">What's included:</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Audit Trail Removal</li>
                <li>CRA Period Copy</li>
              </ul>
            </div>
          )}

          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 accent-accent" />
              <span className="text-sm text-muted-foreground">
                I confirm {showFileUpload ? "this is a Canadian QuickBooks file and " : ""}I agree to the{" "}
                <Link href="/terms" className="text-accent underline">Terms of Service</Link> and{" "}
                <Link href="/privacy" className="text-accent underline">Privacy Policy</Link>.
              </span>
            </label>
          </div>
          <div className="mt-6" id="stripe-payment-element">
            <div className="p-4 bg-muted rounded-lg text-center text-sm text-muted-foreground">
              <Lock className="w-5 h-5 mx-auto mb-2 text-accent" />
              Stripe payment integration - test mode
            </div>
          </div>
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
              {submitError}
            </div>
          )}
          <Button type="submit" disabled={!canSubmit || submitting} className="w-full mt-6 bg-rose-gold text-rose-gold-foreground hover:bg-rose-gold-hover font-display font-bold text-lg py-3" size="lg">
            {submitting ? "Processing..." : `${showFileUpload ? "Upload & " : ""}Pay ${formatPrice(total)}`}
          </Button>
          <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> PIPEDA</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Money-back guarantee</span>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
