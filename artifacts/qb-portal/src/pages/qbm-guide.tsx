import { AlertTriangle, CheckCircle, FileText, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function QBMGuide() {
  return (
    <div>
      <section className="bg-[#1a2744] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">How to Create a .QBM File</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Step-by-step guide to creating a Portable Company File from QuickBooks Enterprise
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <Card className="mb-8 border-[#f0a500]/30 bg-[#f0a500]/5">
            <CardContent className="p-6 flex gap-4">
              <Info className="w-6 h-6 text-[#f0a500] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-[#1a2744] mb-1">What is a .QBM file?</h3>
                <p className="text-sm text-muted-foreground">
                  A .QBM (Portable Company File) is a compact version of your QuickBooks company file. It contains all your financial data in a smaller, transportable format — typically 5-30 MB. This is the only file type accepted by our conversion service.
                </p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-[#1a2744] mb-6">Step-by-Step Instructions</h2>

          <div className="space-y-6">
            {[
              { step: 1, title: "Open Your Company File", desc: "Open QuickBooks Enterprise and ensure your company file is loaded. Make sure you're logged in as the Admin user." },
              { step: 2, title: "Go to File Menu", desc: "Click on File in the top menu bar, then select Create Copy." },
              { step: 3, title: "Select Portable Company File", desc: "In the dialog that appears, select Portable company file (.QBM). Do NOT select 'Backup copy' — that creates a .QBB file which we cannot process." },
              { step: 4, title: "Click Next", desc: "Click the Next button to proceed to the save location dialog." },
              { step: 5, title: "Choose Save Location", desc: "Select a location to save the file — your Desktop is a good choice for easy access. Note the file name and location." },
              { step: 6, title: "Wait for Creation", desc: "QuickBooks will close your company file temporarily, create the portable file, then reopen your company file. This may take a few minutes for large files." },
              { step: 7, title: "Upload to NexFortis", desc: "Go to our Order page, select your service, and upload the .QBM file you just created." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1a2744] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a2744] mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-red-700">Common Mistakes</h3>
                </div>
                <ul className="space-y-2 text-sm text-red-600">
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBB (Backup) file — much larger, different format</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBW (Working) file — cannot be transferred safely</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Uploading a .QBO file — this is QuickBooks Online format</li>
                  <li className="flex gap-2"><span className="shrink-0">&#x2717;</span> Selecting "Backup copy" instead of "Portable company file"</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-700">File Size Guide</h3>
                </div>
                <ul className="space-y-2 text-sm text-green-700">
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
