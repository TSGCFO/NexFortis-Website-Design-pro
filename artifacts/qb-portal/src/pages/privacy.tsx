import { SEO } from "@/components/seo";

export default function Privacy() {
  return (
    <div>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for the NexFortis QuickBooks Service Portal. Learn how we protect your data in compliance with PIPEDA."
        path="/privacy"
        canonical="https://qb.nexfortis.com/privacy"
      />
      <section className="section-brand-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">Privacy Policy</h1>
          <p className="text-white/70">Last updated: March 2026</p>
        </div>
      </section>
      <div className="brand-divider" />
      <section className="py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4 prose prose-sm dark:prose-invert">
          <h2>1. Overview</h2>
          <p>NexFortis IT Solutions (17756968 Canada Inc.) ("we", "us", "our") is committed to protecting the privacy of our customers. This Privacy Policy describes how we collect, use, store, and protect your personal information in compliance with the Personal Information Protection and Electronic Documents Act (PIPEDA).</p>

          <h2>Information we collect and how we use it</h2>

          <h3>2. Information We Collect</h3>
          <ul>
            <li><strong>Account information:</strong> Name, email address, phone number (optional) when you create an account or place an order.</li>
            <li><strong>QuickBooks files:</strong> .QBM files uploaded for conversion or data services. These files may contain financial data, customer/vendor names, transaction records, and other business information.</li>
            <li><strong>Payment information:</strong> Payment is processed by Stripe. We do not store credit card numbers or payment details on our servers.</li>
            <li><strong>Waitlist signups:</strong> Email address and product interest when you join a waitlist for Coming Soon products.</li>
            <li><strong>Support tickets:</strong> Information you provide when submitting support requests.</li>
          </ul>

          <h3>3. How We Use Your Information</h3>
          <ul>
            <li><strong>Service delivery:</strong> To process your orders, perform conversions, and deliver results.</li>
            <li><strong>Communication:</strong> To send order confirmations, delivery notifications, and respond to support requests.</li>
            <li><strong>Waitlist notifications:</strong> To notify you when products you've signed up for become available.</li>
            <li><strong>Service improvement:</strong> To improve our services and troubleshoot technical issues.</li>
          </ul>

          <h2>How we protect your data</h2>

          <h3>4. Data Retention</h3>
          <ul>
            <li><strong>QuickBooks file retention:</strong> All uploaded and converted files are permanently deleted within 7 days of delivery.</li>
            <li><strong>Account data:</strong> Retained while your account is active. You may request deletion at any time.</li>
            <li><strong>Waitlist data:</strong> Retained until the product launches and you are notified, or until you unsubscribe.</li>
            <li><strong>Order records:</strong> Retained for tax and accounting purposes as required by Canadian law.</li>
          </ul>

          <h3>5. Data Sharing</h3>
          <p>We do not sell, trade, or share your personal information with third parties, except:</p>
          <ul>
            <li><strong>Payment processing:</strong> Stripe processes payments on our behalf and has its own privacy policy.</li>
            <li><strong>Legal requirements:</strong> If required by Canadian law, court order, or regulatory authority.</li>
          </ul>

          <h3>6. Data Security</h3>
          <ul>
            <li>All file uploads are encrypted using 256-bit SSL/TLS during transit.</li>
            <li>Files are stored on access-controlled systems during processing.</li>
            <li>Access to customer data is restricted to authorized personnel only.</li>
            <li>Customer files are permanently deleted within 7 days of service completion.</li>
          </ul>

          <h3>7. Cookies and analytics</h3>
          <p>
            Our site uses two distinct cookie postures depending on where you are.
          </p>
          <p>
            <strong>On public marketing pages</strong> (the home page, service
            catalog, FAQ, the QuickBooks Migration Guide at{" "}
            <code>/qbm-guide</code>, service detail pages at <code>/service/...</code>,
            category pages at <code>/category/...</code>, and ad landing pages at{" "}
            <code>/landing/...</code>), we use Google Analytics 4 (GA4) with
            advertising features enabled. This includes remarketing audiences and
            ad measurement, allowing us to show relevant ads on Google services
            and partner sites to people who have visited our marketing pages.
            Cookies set on these pages include analytics cookies (storing a Google
            Analytics client identifier) and advertising cookies used by Google
            for remarketing and ad personalization. Data is sent to Google as a
            data sub-processor. IP addresses are anonymized before being sent to
            Google. For more information, see{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&rsquo;s data practices
            </a>
            .
          </p>
          <p>
            <strong>On customer portal and authenticated pages</strong> (
            <code>/portal</code>, <code>/order</code>, <code>/order/:id</code>,{" "}
            <code>/subscription</code>, <code>/ticket/:id</code>, and any{" "}
            <code>/admin</code> route), we use only essential cookies for
            authentication and session management, plus analytics cookies for
            measuring portal usage. We do not enable advertising cookies on these
            pages. The QuickBooks files you upload, their metadata, and the
            contents of your account dashboards are never shared with Google or
            any other third party for advertising purposes.
          </p>
          <p>
            Analytics events from public marketing pages are retained in Google
            Analytics for 14 months. You can decline cookie usage by clicking{" "}
            <strong>Decline</strong> on the cookie banner the first time you visit
            each of our hosts (you will be asked separately on{" "}
            <code>nexfortis.com</code> and <code>qb.nexfortis.com</code> because
            consent is stored per origin), by clearing site data in your browser,
            or by opting out of personalized advertising at{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              adssettings.google.com
            </a>
            .
          </p>

          <h2>Your rights, updates, and contact</h2>

          <h3>8. Your Rights Under PIPEDA</h3>
          <p>Under the Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:</p>
          <ul>
            <li>Access your personal information held by us</li>
            <li>Request correction of inaccurate information</li>
            <li>Withdraw consent for the use of your information</li>
            <li>Request deletion of your personal information</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada</li>
          </ul>

          <h3>9. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>

          <h3>10. Contact</h3>
          <p>For privacy-related questions or to exercise your PIPEDA rights, contact us at <a href="mailto:support@nexfortis.com">support@nexfortis.com</a>.</p>
          <p>NexFortis IT Solutions<br />Ontario, Canada</p>
        </div>
      </section>
    </div>
  );
}
