import { PageHero, Section } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";

export default function Terms() {
  return (
    <div>
      <SEO
        title="Terms of Service"
        description="Terms of Service for NexFortis IT Solutions (17756968 Canada Inc.). Read the terms governing our IT services, software products, subscriptions, and use of this website."
        path="/terms"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Terms of Service", url: "/terms" },
        ]}
      />
      <PageHero title="Terms of Service" subtitle="Last Updated: March 2026" />
      <Section bg="white">
        <div className="max-w-3xl mx-auto prose prose-blue lg:prose-lg text-muted-foreground prose-headings:text-foreground">
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client," "you," or "your") and NexFortis IT Solutions, operating as 17756968 Canada Inc. ("NexFortis," "we," "us," or "our"), with its principal office at 204 Hill Farm Rd, Nobleton, ON L7B 0A1, Canada. By accessing our website, engaging our services, or purchasing our products, you agree to be bound by these Terms.
          </p>

          <h2>2. Services</h2>
          <p>
            NexFortis provides information technology services including, but not limited to: managed IT services, Microsoft 365 deployment and migration, QuickBooks data migration and recovery, digital marketing, workflow automation, IT consulting, and custom software development. The specific scope, deliverables, timeline, and fees for each engagement are defined in a separate Statement of Work (SOW) or service agreement between NexFortis and the Client.
          </p>

          <h2>3. Software Products</h2>
          <p>
            NexFortis offers QuickBooks add-on tools and other software products for purchase. Software products are licensed, not sold. Each product is subject to its own End User License Agreement (EULA). Unless otherwise stated, software licenses are perpetual, non-transferable, and limited to the purchasing entity. Product prices are listed in Canadian dollars unless otherwise indicated and are subject to applicable taxes.
          </p>

          <h2>4. Payment Terms</h2>
          <p>
            Service fees are outlined in the applicable SOW or service agreement. Unless otherwise agreed in writing, invoices are due within thirty (30) days of the invoice date. Late payments may be subject to interest at a rate of 1.5% per month (18% per annum) on the outstanding balance. NexFortis reserves the right to suspend services if payment is not received within the agreed timeframe.
          </p>

          <h2>5. Money-Back Guarantee</h2>
          <p>
            Our QuickBooks data migration and recovery services are covered by a money-back guarantee as described on our QuickBooks service page. If the migrated or recovered data does not meet the accuracy standards described in our service documentation, we will either re-perform the service at no additional cost or issue a full refund at the Client's discretion. This guarantee does not apply to services where the Client has provided incomplete, corrupted beyond recovery, or falsified source data.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on the NexFortis website — including text, graphics, logos, images, and software — is the property of NexFortis or its licensors and is protected by Canadian and international intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on our website without our prior written consent.
          </p>
          <p>
            Custom software, scripts, or configurations developed by NexFortis specifically for a Client engagement are owned by the Client upon full payment, unless otherwise specified in the SOW.
          </p>

          <h2>7. Confidentiality</h2>
          <p>
            Both parties agree to maintain the confidentiality of any proprietary or sensitive information disclosed during the course of an engagement. This includes, but is not limited to, financial data, business strategies, technical configurations, and customer information. Confidentiality obligations survive the termination of any service agreement.
          </p>

          <h2>8. Data Handling and Privacy</h2>
          <p>
            NexFortis handles all client data in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation. Our data handling practices are described in detail in our <a href="/privacy">Privacy Policy</a>. Client data provided for migration, recovery, or other services is stored securely, used only for the specified purpose, and permanently deleted from our systems within thirty (30) days of project completion unless the Client requests otherwise in writing.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, NexFortis shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or business opportunities arising out of or in connection with our services or these Terms. Our total liability for any claim arising from our services shall not exceed the total fees paid by the Client for the specific service giving rise to the claim.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless NexFortis, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in connection with your use of our website, your breach of these Terms, or your violation of any applicable law or the rights of a third party.
          </p>

          <h2>11. Termination</h2>
          <p>
            Either party may terminate an ongoing service engagement by providing thirty (30) days' written notice. Upon termination, the Client is responsible for payment of all services rendered through the effective date of termination. NexFortis will return or securely destroy all Client data upon termination, in accordance with our data handling procedures.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising from these Terms or our services shall be resolved in the courts of the Province of Ontario.
          </p>

          <h2>13. Changes to These Terms</h2>
          <p>
            NexFortis reserves the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last Updated" date. Continued use of our website or services after any changes constitutes acceptance of the revised Terms.
          </p>

          <h2>14. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us:
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
