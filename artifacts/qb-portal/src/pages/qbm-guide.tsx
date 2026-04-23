import { AlertTriangle, CheckCircle, FileText, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SEO, BASE_URL } from "@/components/seo";
import { generateBreadcrumbSchema } from "@/lib/seo-schemas";

// Lifted out of JSX so the HowTo JSON-LD and the visible instruction list
// share a single source of truth — if we reorder, rename, or add a step,
// the schema stays in sync automatically.
const QBM_STEPS: { step: number; title: string; desc: string }[] = [
  { step: 1, title: "Open Your Company File", desc: "Open QuickBooks Enterprise and ensure your company file is loaded. Make sure you're logged in as the Admin user." },
  { step: 2, title: "Go to File Menu", desc: "Click on File in the top menu bar, then select Create Copy." },
  { step: 3, title: "Select Portable Company File", desc: "In the dialog that appears, select Portable company file (.QBM). Do NOT select 'Backup copy' — that creates a .QBB file which we cannot process." },
  { step: 4, title: "Click Next", desc: "Click the Next button to proceed to the save location dialog." },
  { step: 5, title: "Choose Save Location", desc: "Select a location to save the file — your Desktop is a good choice for easy access. Note the file name and location." },
  { step: 6, title: "Wait for Creation", desc: "QuickBooks will close your company file temporarily, create the portable file, then reopen your company file. This may take a few minutes for large files." },
  { step: 7, title: "Upload to NexFortis", desc: "Go to our Order page, select your service, and upload the .QBM file you just created." },
];

const QBM_PAGE_TITLE = "How to Create a .QBM File";
const QBM_PAGE_DESCRIPTION = "Step-by-step guide to creating a QuickBooks Portable Company File (.QBM) from QuickBooks Enterprise for conversion.";

// Emits a HowTo schema that Google can render as a rich step-by-step result.
// Matches the visible Step 1…Step 7 sequence on the page.
function qbmHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: QBM_PAGE_TITLE,
    description: QBM_PAGE_DESCRIPTION,
    url: `${BASE_URL}/qbm-guide`,
    totalTime: "PT10M",
    tool: [
      { "@type": "HowToTool", name: "QuickBooks Enterprise (Admin user)" },
    ],
    step: QBM_STEPS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.desc,
      url: `${BASE_URL}/qbm-guide#step-${s.step}`,
    })),
  };
}

export default function QBMGuide() {
  const schemas = [
    qbmHowToSchema(),
    generateBreadcrumbSchema([
      { name: "QBM Guide", path: "/qbm-guide" },
    ]),
  ];

  return (
    <div>
      <SEO
        title={QBM_PAGE_TITLE}
        description={QBM_PAGE_DESCRIPTION}
        path="/qbm-guide"
        jsonLd={schemas}
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">How to Create a .QBM File</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Step-by-step guide to creating a Portable Company File from QuickBooks Enterprise
          </p>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="mb-8 border-accent/30 bg-accent/5">
            <CardContent className="p-6 flex gap-4">
              <Info className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold font-display text-primary mb-1">What is a .QBM file?</h3>
                <p className="text-sm text-muted-foreground">
                  A .QBM (Portable Company File) is a compact version of your QuickBooks company file. It contains all your financial data in a smaller, transportable format — typically 5-30 MB. This is the file type accepted by our QuickBooks Enterprise conversion service.
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold font-display text-primary mb-6">Step-by-Step Instructions</h2>

          <div className="space-y-6">
            {QBM_STEPS.map((s) => (
              <div key={s.step} id={`step-${s.step}`} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold font-display text-primary mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold font-display text-red-700 dark:text-red-400">Common Mistakes</h3>
                </div>
                <ul className="space-y-2 text-sm text-red-600 dark:text-red-400">
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBB (Backup) file — much larger, different format</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBW (Working) file — cannot be transferred safely</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBO file — this is QuickBooks Online format</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Selecting "Backup copy" instead of "Portable company file"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold font-display text-green-700 dark:text-green-400">File Size Guide</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <li className="flex gap-2"><span className="shrink-0">&#x2713;</span> Typical .QBM size: 5-30 MB</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2713;</span> Maximum upload size: 500 MB</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2713;</span> Files over 100 MB may take longer to process</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2713;</span> If your file exceeds 500 MB, contact us for alternative delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
