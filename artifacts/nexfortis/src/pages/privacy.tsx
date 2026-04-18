import { PageHero, Section } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";

export default function Privacy() {
  return (
    <div>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for NexFortis IT Solutions — 17756968 Canada Inc. Learn how we collect, use, and protect your personal information in compliance with PIPEDA."
        path="/privacy"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ]}
      />
      <PageHero title="Privacy Policy" subtitle="Last Updated: March 2026" />
      <Section bg="white">
        <div className="max-w-3xl mx-auto prose prose-blue lg:prose-lg text-muted-foreground prose-headings:text-foreground">
          <h2>1. Introduction</h2>
          <p>
            NexFortis IT Solutions, operating as 17756968 Canada Inc. ("NexFortis," "we," "us," or "our"), is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard information when you visit our website (nexfortis.com), use our services, or communicate with us.
          </p>
          <p>
            We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation. By using our website or engaging our services, you consent to the practices described in this policy.
          </p>

          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Fill out our contact form (name, email address, phone number, company name, and message details)</li>
            <li>Request a consultation or quote for our services</li>
            <li>Subscribe to our newsletter or blog updates</li>
            <li>Purchase our QuickBooks add-on tools or services</li>
            <li>Communicate with us via email, phone, or other channels</li>
          </ul>
          <p>We also automatically collect certain technical information when you visit our website, including:</p>
          <ul>
            <li>IP address and approximate geographic location</li>
            <li>Browser type, operating system, and device information</li>
            <li>Pages visited, time spent on pages, and referring URLs</li>
            <li>Cookies and similar tracking technologies (see Section 7)</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the personal information we collect for the following purposes:</p>
          <ul>
            <li>To respond to your inquiries and provide requested services</li>
            <li>To process transactions and deliver products or services you have purchased</li>
            <li>To communicate with you about your projects, account, or service updates</li>
            <li>To send you marketing communications (with your consent, which you may withdraw at any time)</li>
            <li>To improve our website, services, and customer experience</li>
            <li>To comply with legal obligations and protect our rights</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We may share your information in the following limited circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving you (e.g., email delivery services, payment processors). These providers are contractually obligated to protect your data and use it only for the purposes we specify.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, regulation, legal process, or governmental request.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction.</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, to provide our services, or as required by law. Contact form submissions are retained for up to 24 months unless you request earlier deletion. Client project data is retained for the duration of our engagement plus a reasonable period thereafter to support warranty and follow-up services.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission (TLS/SSL), secure server infrastructure, access controls, and regular security assessments. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            Our website uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie preferences through your browser settings. Disabling cookies may affect the functionality of certain features on our website.
          </p>

          <h2>8. Your Rights Under PIPEDA</h2>
          <p>Under PIPEDA, you have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of any inaccurate or incomplete information</li>
            <li>Withdraw consent for the collection, use, or disclosure of your information (subject to legal or contractual restrictions)</li>
            <li>File a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided in Section 10 below.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised "Last Updated" date. We encourage you to review this page periodically.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, wish to exercise your privacy rights, or have concerns about how we handle your personal information, please contact us:
          </p>
          <p>
            <strong>NexFortis IT Solutions</strong><br />
            17756968 Canada Inc.<br />
            204 Hill Farm Rd, Nobleton, ON L7B 0A1<br />
            Email: <a href="mailto:contact@nexfortis.com">contact@nexfortis.com</a>
          </p>
        </div>
      </Section>
    </div>
  );
}
