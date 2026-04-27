import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SEO } from "@/components/seo";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo-schemas";

const faqData = [
  { cat: "Conversion", q: "What is a .QBM file?", a: "A .QBM (QuickBooks Portable Company File) is a compact version of your company file that contains all your financial data but in a smaller, transportable format. It's created through File > Create Copy > Portable company file in QuickBooks Enterprise." },
  { cat: "Conversion", q: "How do I create a .QBM file from QuickBooks Enterprise?", a: "Open your company file in QuickBooks Enterprise, go to File > Create Copy, select 'Portable company file (.QBM)', click Next, choose a save location, and QuickBooks will create the file. The typical size is 5–30 MB." },
  { cat: "Conversion", q: "What QuickBooks versions are supported?", a: "We support QuickBooks Enterprise versions 2019 through 2024 for conversion to Premier or Pro. The file must be a Canadian edition." },
  { cat: "Conversion", q: "Is all my data preserved during conversion?", a: "Yes. Our conversion process is penny-perfect — all transactions, chart of accounts, customer/vendor lists, inventory, payroll data, and balances are preserved exactly. You receive a validation report confirming data integrity." },
  { cat: "Conversion", q: "What about GST/HST tax codes?", a: "All Canadian tax codes including GST, HST, PST, and QST are fully preserved during conversion. This is a key advantage of our Canadian-first service." },
  { cat: "Conversion", q: "Does the conversion handle multi-currency files?", a: "Yes, multi-currency settings and transactions are preserved during conversion. If you want multi-currency removed, our Multi-Currency Removal service is available starting at $75 CAD (launch special, reg. $149)." },
  { cat: "Conversion", q: "How long does the conversion take?", a: "Standard conversion is completed in under 1 hour. With our Rush Delivery add-on ($25 with launch special), your file gets priority queue processing for even faster turnaround." },
  { cat: "Conversion", q: "How is my data kept secure?", a: "Your file is encrypted during upload using 256-bit SSL/TLS. We process files on secure, access-controlled systems and delete all customer files within 7 days per our privacy policy. We are PIPEDA compliant." },
  { cat: "Conversion", q: "What if the conversion fails?", a: "If we are unable to convert your file for any technical reason, you receive a full refund. No questions asked. We'll also explain what went wrong and suggest alternatives." },
  { cat: "Conversion", q: "Can you convert US QuickBooks files?", a: "We can attempt conversion of US edition files, but our service is optimized for Canadian editions. We'll note in your delivery email if the file appears to be a US edition." },
  { cat: "Conversion", q: "What if I upload the wrong file type?", a: "If you upload a .QBB (backup) or .QBW (working file) instead of a .QBM, we'll send you step-by-step instructions to create the correct file type. Your order is not refunded — simply re-upload the correct file." },
  { cat: "Conversion", q: "What's the difference between Enterprise and Premier?", a: "QuickBooks Enterprise supports up to 1 million list items, advanced inventory, and more concurrent users. Premier has a limit of 14,999 list items and fewer advanced features. Some Enterprise-only features will not be available after conversion." },
  { cat: "Conversion", q: "What is the Premier list limit?", a: "QuickBooks Premier supports a maximum of 14,999 items per list (customers, vendors, items, etc.). If your Enterprise file exceeds this, you may need our List Reduction service ($40 with launch special) before conversion." },
  { cat: "Conversion", q: "Do I need a Premier/Pro licence to use the converted file?", a: "Yes, you'll need a valid QuickBooks Premier or Pro licence to open and use the converted file. The conversion changes the file format but doesn't include software licences." },
  { cat: "Conversion", q: "What Enterprise-only features will I lose?", a: "Features exclusive to Enterprise like advanced inventory, advanced pricing, custom user permissions beyond Premier's level, and certain reports will not be available in Premier/Pro. Core accounting features are fully preserved." },
  { cat: "Conversion", q: "How do I restore the converted .QBM file?", a: "Open QuickBooks Premier or Pro, go to File > Open or Restore Company, select 'Restore a portable file (.QBM)', browse to the converted file, choose a save location, and QuickBooks will restore it." },
  { cat: "Conversion", q: "What's your refund policy?", a: "We offer a full refund if we cannot technically complete the conversion. Refunds for incompatible files (wrong edition, already Premier) are also provided. We do not refund for wrong file types (.QBB, .QBW) — we'll help you upload the correct format." },
  { cat: "Conversion", q: "How does your pricing compare to competitors?", a: "Our core conversion starts at $75 CAD (launch special) vs. Big Red Consulting at $249 USD (~$344 CAD) and E-Tech at $299 USD (~$413 CAD). We're also significantly faster — under 1 hour vs. next business day." },
  { cat: "Conversion", q: "Can I convert Premier to Enterprise?", a: "No, our service currently only supports Enterprise-to-Premier/Pro conversion. Converting from Premier to Enterprise requires purchasing a QuickBooks Enterprise licence from Intuit." },
  { cat: "Data Services", q: "What is the File Health Check?", a: "The File Health Check ($25 with launch special, reg. $49) is an add-on that provides a comprehensive pre-conversion integrity report. It identifies potential data issues, verifies list counts, validates balances, and confirms your file is ready for conversion." },
  { cat: "Data Services", q: "What does Audit Trail Removal do?", a: "Audit Trail Removal ($50 with launch special, reg. $99) removes the internal audit trail history from your QuickBooks file, significantly reducing file size and improving performance. This is recommended for files with years of transaction history." },
  { cat: "Data Services", q: "What is Super Condense?", a: "Super Condense ($50 with launch special, reg. $99) dramatically reduces your QuickBooks file size by condensing old transactions while preserving essential summary data. This is ideal for files that have become slow due to years of data accumulation." },
  { cat: "Data Services", q: "What is a CRA Period Copy?", a: "CRA Period Copy ($50 with launch special, reg. $99) creates a copy of your QuickBooks data for a specific time period, formatted for CRA (Canada Revenue Agency) audit compliance and archival purposes." },
  { cat: "Data Services", q: "What is the Audit Trail + CRA Period Copy Bundle?", a: "The bundle ($75 with launch special, reg. $149) combines Audit Trail Removal and CRA Period Copy into a single discounted package. If you need both services, the bundle saves you money compared to ordering them separately." },
  { cat: "Data Services", q: "What is QBO Readiness Report?", a: "The QBO Readiness Report ($25 with launch special, reg. $49) analyzes your QuickBooks Desktop file and provides a detailed assessment of what data can and cannot migrate to QuickBooks Online, along with recommended steps to prepare your data." },
  { cat: "Data Services", q: "What is Multi-Currency Removal?", a: "Multi-Currency Removal ($75 with launch special, reg. $149) safely removes multi-currency settings from your QuickBooks file. This is recommended when multi-currency was enabled by mistake or is no longer needed. Processing takes 1–2 business days." },
  { cat: "Data Services", q: "What is List Reduction?", a: "List Reduction ($40 with launch special, reg. $79) reduces the number of items in your QuickBooks lists (customers, vendors, items, etc.) to bring them within Premier/Pro limits. Essential if your Enterprise file exceeds the 14,999 list item limit." },
  { cat: "Migration", q: "Can you migrate from AccountEdge/MYOB to QuickBooks?", a: "Yes! Our AccountEdge/MYOB to QuickBooks migration ($125 with launch special, reg. $249) transfers your chart of accounts, customers, vendors, items, and transaction history. Accepted file formats include .zip, .myo, and .myox. Processing takes 1–2 business days." },
  { cat: "Migration", q: "Can you migrate from Sage 50 to QuickBooks?", a: "Yes! Our Sage 50 / Simply Accounting to QuickBooks migration ($125 with launch special, reg. $249) supports full data migration including chart of accounts, transactions, and contacts. Accepted file formats include .cab, .zip, and .sai. Processing takes 1–2 business days." },
  { cat: "Migration", q: "Do you support migrations from other platforms?", a: "We currently offer migrations from AccountEdge/MYOB and Sage 50 to QuickBooks. Additional platform migrations (NetSuite, Xero, Peachtree, and others) are planned for future releases. Join the waitlist to be notified when your platform is supported." },
  { cat: "Migration", q: "How do you compare to E-Tech for migrations?", a: "Our migration services are priced significantly lower than E-Tech while maintaining the same quality. For example, our QuickBooks conversion starts at $75 CAD (launch special) vs. E-Tech's $299 USD (~$413 CAD)." },
  { cat: "Support", q: "Do I get any support included with my order?", a: "Yes. Every paid order includes 2 support tickets within 30 days of file delivery, with a 2-hour response time during business hours. If you need more, add Extended Support ($25 launch / $49 regular) to your order for 5 tickets with a 1-hour SLA. For ongoing support beyond 30 days, subscribe to one of our Expert Support plans." },
  { cat: "Support", q: "What is QB Expert Support?", a: "QB Expert Support is a monthly subscription service for ongoing QuickBooks Desktop assistance. We offer three tiers: Essentials ($25/mo launch special), Professional ($50/mo launch special), and Premium ($75/mo launch special). All tiers include 1–2 hour response times during business hours." },
  { cat: "Support", q: "What's included in each support tier?", a: "Essentials: 3 tickets/month, 1-hour response, troubleshooting and setup guidance, 1 automated file health check/month. Professional: 8 tickets/month, 1-hour response, data review, custom reporting assistance, 2 file health checks/month. Premium: Unlimited tickets, 30-minute response, dedicated account manager, quarterly file optimization, priority queue for all services." },
  { cat: "Support", q: "Do I need to be a conversion customer to buy support?", a: "No! QB Expert Support is a standalone subscription available to any QuickBooks Desktop user. You don't need to have purchased a conversion or any other service from us." },
  { cat: "Volume", q: "What are Volume Packs?", a: "Volume Packs offer discounted bundles of standard Enterprise → Premier/Pro conversions. The 5-Pack ($325 with launch special, reg. $649) and 10-Pack ($600 with launch special, reg. $1,199) are ideal for accountants and bookkeepers managing multiple client files. Credits are valid for 12 months." },
  { cat: "General", q: "How does the waitlist work?", a: "Enter your email on our waitlist page to be notified when new services launch. You'll only receive emails about services you've specifically signed up for — no spam." },
];

const faqCategories = [...new Set(faqData.map((item) => item.cat))];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>("all");

  const filteredFaq = activeCat === "all" ? faqData : faqData.filter((f) => f.cat === activeCat);
  const faqSchema = generateFAQSchema(faqData.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <div>
      <SEO
        title="Frequently Asked Questions"
        description="Answers to common questions about QuickBooks Enterprise to Premier conversion, .QBM files, pricing, turnaround time, and data security."
        path="/faq"
        jsonLd={[faqSchema, generateBreadcrumbSchema([{ name: "FAQ", path: "/faq" }])]}
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-white/70 text-lg">Answers to the most common questions about our QuickBooks services</p>
        </div>
      </section>

      <div className="brand-divider" />

      <section className="py-8 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => { setActiveCat("all"); setOpenIndex(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCat === "all"
                ? "bg-navy text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({faqData.length})
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setOpenIndex(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCat === cat
                  ? "bg-navy text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat} ({faqData.filter((f) => f.cat === cat).length})
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 section-brand-light">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {filteredFaq.map((faq, i) => {
              const isOpen = openIndex === i;
              const slug = faq.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
              const btnId = `faq-page-btn-${i}-${slug}`;
              const panelId = `faq-page-panel-${i}-${slug}`;
              return (
                <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-medium text-primary text-sm pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
