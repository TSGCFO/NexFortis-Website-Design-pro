import { SEO } from "@/components/seo";

export default function Terms() {
  return (
    <div>
      <SEO
        title="Terms of Service"
        description="Terms of Service for the NexFortis QuickBooks Service Portal. Read our terms before using our services."
        path="/terms"
        canonical="https://qb.nexfortis.com/terms"
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Terms of Service</h1>
          <p className="text-white/70">Last updated: March 2026</p>
        </div>
      </section>
      <div className="brand-divider" />
      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4 prose prose-sm dark:prose-invert">
          <h2>1. Agreement</h2>
          <p>By using the NexFortis QuickBooks Service Portal ("Service"), operated by NexFortis IT Solutions (17756968 Canada Inc.), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>

          <h2>Services, pricing, and refunds</h2>

          <h3>2. Services Offered</h3>
          <p>NexFortis offers 20 QuickBooks-related services across five categories:</p>
          <ul>
            <li><strong>QuickBooks Conversion:</strong> Enterprise to Premier/Pro Standard and Complex conversions, Guaranteed 30-Minute conversion.</li>
            <li><strong>QuickBooks Data Services:</strong> File Health Check, Rush Delivery, Post-Conversion Care, Audit Trail Removal, Super Condense, List Reduction, Multi-Currency Removal, QBO Readiness Report, CRA Period Copy, Audit Trail + CRA Bundle.</li>
            <li><strong>Platform Migrations:</strong> AccountEdge/MYOB to QuickBooks, Sage 50 to QuickBooks.</li>
            <li><strong>Expert Support:</strong> Essentials, Professional, and Premium monthly support plans.</li>
            <li><strong>Volume Packs:</strong> 5-Pack and 10-Pack conversion bundles at discounted rates.</li>
          </ul>

          <h3>3. Pricing</h3>
          <p>All prices are in Canadian Dollars (CAD). Prices are subject to applicable GST/HST. The current pricing is listed on the Service website and in the product catalog. NexFortis reserves the right to modify pricing with notice.</p>

          <h3>4. Coming Soon Products</h3>
          <p>Products marked "Coming Soon" are available for waitlist registration only. No payment is collected for Coming Soon products. Waitlist registration does not constitute a purchase commitment. Final pricing and availability may change before launch.</p>

          <h3>5. Refund Policy</h3>
          <ul>
            <li><strong>Technical failure:</strong> If we cannot complete the conversion due to a technical error on our end, you receive a full refund.</li>
            <li><strong>Incompatible files:</strong> If your file is already in Premier/Pro format or is a Pro edition (not Enterprise), you receive a full refund.</li>
            <li><strong>Wrong file type:</strong> If you upload a .QBB, .QBW, or other non-.QBM file, we will provide instructions to create the correct file type. No refund is issued — re-upload the correct file for processing.</li>
            <li><strong>Corrupted files:</strong> If your file is corrupted and cannot be processed, you receive a full refund. We may offer our Data Recovery service as an alternative.</li>
          </ul>
          <p>Refunds are processed within 3-5 business days to the original payment method.</p>

          <h2>File handling and affiliations</h2>

          <h3>6. File Upload and Processing</h3>
          <p>Only .QBM (Portable Company File) format is accepted. Maximum file size is 500 MB. Files are processed on secure systems with restricted access. All customer files are deleted within 7 days of delivery.</p>

          <h3>7. No Affiliation</h3>
          <p>NexFortis IT Solutions is not affiliated with, endorsed by, or sponsored by Intuit Inc. (maker of QuickBooks), Sage Software, or any other software vendor mentioned on this site. QuickBooks, Sage 50, and other product names are trademarks of their respective owners.</p>

          <h2>Liability and legal terms</h2>

          <h3>8. Limitation of Liability</h3>
          <p>NexFortis IT Solutions' total liability for any claim related to the Service is limited to the amount paid by the customer for the specific service in question. We are not liable for indirect, incidental, consequential, or punitive damages.</p>

          <h3>9. Data Integrity</h3>
          <p>While we guarantee penny-perfect accuracy in our conversion process, we strongly recommend that customers verify their converted files and maintain original backups. NexFortis is not responsible for data loss resulting from failure to maintain backups.</p>

          <h3>10. Governing Law</h3>
          <p>These Terms are governed by the laws of the Province of Ontario, Canada. Any disputes will be resolved in the courts of Ontario.</p>

          <h3>11. Contact</h3>
          <p>For questions about these Terms, contact us at <a href="mailto:support@nexfortis.com">support@nexfortis.com</a>.</p>
        </div>
      </section>
    </div>
  );
}
