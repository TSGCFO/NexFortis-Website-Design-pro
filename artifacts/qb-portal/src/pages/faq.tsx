import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  { cat: "Conversion", q: "What is a .QBM file?", a: "A .QBM (QuickBooks Portable Company File) is a compact version of your company file that contains all your financial data but in a smaller, transportable format. It's created through File > Create Copy > Portable company file in QuickBooks Enterprise." },
  { cat: "Conversion", q: "How do I create a .QBM file from QuickBooks Enterprise?", a: "Open your company file in QuickBooks Enterprise, go to File > Create Copy, select 'Portable company file (.QBM)', click Next, choose a save location, and QuickBooks will create the file. The typical size is 5-30 MB." },
  { cat: "Conversion", q: "What QuickBooks versions are supported?", a: "We support QuickBooks Enterprise versions 2019 through 2024 for conversion to Premier or Pro. The file must be a Canadian edition." },
  { cat: "Conversion", q: "Is all my data preserved during conversion?", a: "Yes. Our conversion process is penny-perfect — all transactions, chart of accounts, customer/vendor lists, inventory, payroll data, and balances are preserved exactly. You receive a validation report confirming data integrity." },
  { cat: "Conversion", q: "What about GST/HST tax codes?", a: "All Canadian tax codes including GST, HST, PST, and QST are fully preserved during conversion. This is a key advantage of our Canadian-first service." },
  { cat: "Conversion", q: "Does the conversion handle multi-currency files?", a: "Yes, multi-currency settings and transactions are preserved during conversion. If you want multi-currency removed, that's available as a separate service (coming soon)." },
  { cat: "Conversion", q: "How long does the conversion take?", a: "Standard conversion is completed in under 1 hour. With our Rush Delivery add-on ($49), we guarantee delivery within 15 minutes." },
  { cat: "Conversion", q: "How is my data kept secure?", a: "Your file is encrypted during upload using 256-bit SSL/TLS. We process files on secure, access-controlled systems and delete all customer files within 7 days per our privacy policy. We are PIPEDA compliant." },
  { cat: "Conversion", q: "What if the conversion fails?", a: "If we are unable to convert your file for any technical reason, you receive a full refund. No questions asked. We'll also explain what went wrong and suggest alternatives." },
  { cat: "Conversion", q: "Can you convert US QuickBooks files?", a: "We can attempt conversion of US edition files, but our service is optimized for Canadian editions. We'll note in your delivery email if the file appears to be a US edition." },
  { cat: "Conversion", q: "What if I upload the wrong file type?", a: "If you upload a .QBB (backup) or .QBW (working file) instead of a .QBM, we'll send you step-by-step instructions to create the correct file type. Your order is not refunded — simply re-upload the correct file." },
  { cat: "Conversion", q: "What's the difference between Enterprise and Premier?", a: "QuickBooks Enterprise supports up to 1 million list items, advanced inventory, and more concurrent users. Premier has a limit of 14,999 list items and fewer advanced features. Some Enterprise-only features will not be available after conversion." },
  { cat: "Conversion", q: "What is the Premier list limit?", a: "QuickBooks Premier supports a maximum of 14,999 items per list (customers, vendors, items, etc.). If your Enterprise file exceeds this, you may need our List Reduction service before conversion." },
  { cat: "Conversion", q: "Do I need a Premier/Pro licence to use the converted file?", a: "Yes, you'll need a valid QuickBooks Premier or Pro licence to open and use the converted file. The conversion changes the file format but doesn't include software licences." },
  { cat: "Conversion", q: "What Enterprise-only features will I lose?", a: "Features exclusive to Enterprise like advanced inventory, advanced pricing, custom user permissions beyond Premier's level, and certain reports will not be available in Premier/Pro. Core accounting features are fully preserved." },
  { cat: "Conversion", q: "How do I restore the converted .QBM file?", a: "Open QuickBooks Premier or Pro, go to File > Open or Restore Company, select 'Restore a portable file (.QBM)', browse to the converted file, choose a save location, and QuickBooks will restore it." },
  { cat: "Conversion", q: "What's your refund policy?", a: "We offer a full refund if we cannot technically complete the conversion. Refunds for incompatible files (wrong edition, already Premier) are also provided. We do not refund for wrong file types (.QBB, .QBW) — we'll help you upload the correct format." },
  { cat: "Conversion", q: "How does your pricing compare to competitors?", a: "Our core conversion is $149 CAD vs. Big Red Consulting at $249 USD (~$344 CAD) and E-Tech at $299 USD (~$413 CAD). We're also significantly faster — under 1 hour vs. next business day." },
  { cat: "Conversion", q: "Can I convert Premier to Enterprise?", a: "No, our service currently only supports Enterprise-to-Premier/Pro conversion. Converting from Premier to Enterprise requires purchasing a QuickBooks Enterprise licence from Intuit." },
  { cat: "Add-Ons", q: "What is the File Health Check?", a: "The File Health Check ($49) is an add-on that provides a comprehensive pre-conversion integrity report. It identifies potential data issues, verifies list counts, validates balances, and confirms your file is ready for conversion." },
  { cat: "Add-Ons", q: "What does Audit Trail Removal do?", a: "Audit Trail Removal (coming soon, $79) removes the internal audit trail history from your QuickBooks file, significantly reducing file size and improving performance. This is recommended for files with years of transaction history." },
  { cat: "Add-Ons", q: "What is Super Condense?", a: "Super Condense (coming soon, $99) dramatically reduces your QuickBooks file size by condensing old transactions while preserving essential summary data. This is ideal for files that have become slow due to years of data accumulation." },
  { cat: "Add-Ons", q: "What is a CRA Period Copy?", a: "CRA Period Copy (coming soon, $99) creates a copy of your QuickBooks data for a specific time period, formatted for CRA (Canada Revenue Agency) audit compliance and archival purposes." },
  { cat: "Migration", q: "Can you migrate from Sage 50 to QuickBooks?", a: "Yes! Our Sage 50 / Simply Accounting to QuickBooks migration service ($299 CAD) is coming soon. Join the waitlist to be notified when it launches. We support full data migration including chart of accounts, transactions, and contacts." },
  { cat: "Migration", q: "Do you support QuickBooks Online migration?", a: "Yes, our Enterprise to QuickBooks Online Migration ($249 CAD) and Online File Preparation ($249 CAD) services are coming soon. These will prepare and migrate your desktop data to QuickBooks Online." },
  { cat: "Migration", q: "What other platforms can you migrate from?", a: "We're building migrations from NetSuite ($349), Peachtree/Sage ($299), AccountEdge/MYOB ($299), SAP ($349), Xero ($249), DacEasy ($249), and ODOO ($249). All are coming soon — join the waitlist for your platform." },
  { cat: "Migration", q: "How do you compare to E-Tech for migrations?", a: "Our migration services will be priced significantly lower than E-Tech while maintaining the same quality. For example, our QuickBooks conversion is $149 CAD vs E-Tech's $299 USD (~$413 CAD)." },
  { cat: "Tools", q: "When will the QuickBooks tools be available?", a: "Our Tier 3 tools (24 products including importers, converters, and file creators) are in development. Expected timelines vary — join the waitlist for specific tools to get notified when they launch." },
  { cat: "Tools", q: "Are the tools for Desktop or Online?", a: "Most tools are designed for QuickBooks Desktop (Premier and Pro). Some tools like Donor Statements and PositivePay have separate Desktop and Online versions. Check individual product descriptions for compatibility." },
  { cat: "Tools", q: "How does the waitlist work?", a: "Enter your email on any 'Coming Soon' product page. We'll notify you by email when that product launches. You'll only receive emails about products you've specifically signed up for — no spam." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", ...new Set(faqData.map((f) => f.cat))];
  const filtered = activeCategory === "all" ? faqData : faqData.filter((f) => f.cat === activeCategory);

  return (
    <div>
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-white/70 text-lg">Answers to the most common questions about our QuickBooks services</p>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-navy text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {cat === "all" ? `All (${faqData.length})` : `${cat} (${faqData.filter((f) => f.cat === cat).length})`}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 section-brand-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-medium text-primary text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
