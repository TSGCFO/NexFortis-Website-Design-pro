import { useState } from "react";
import { PageHero, Section, PageBreadcrumbs } from "@/components/ui-elements";
import { SEO, BreadcrumbSchema } from "@/components/seo";
import { MapPin, Mail, Clock, Loader2, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number (at least 10 digits)."),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service you're interested in."),
  message: z.string().min(10, "Please provide at least 10 characters of detail."),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to send message");
      }
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 business hours.",
      });
      reset();
    } catch (err: unknown) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 min-h-[44px] rounded-xl bg-secondary border border-border focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all";

  return (
    <div>
      <SEO title="Contact NexFortis — Free IT Consultation" description="Get in touch with NexFortis IT Solutions. Request a quote, schedule a consultation, or ask about our services. Located in Nobleton, Ontario." path="/contact" />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ]}
      />
      <PageHero
        title="Contact Us"
        subtitle="Ready to discuss your next IT project? Get in touch with our experts today."
      />
      <PageBreadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Contact Us" },
      ]} />

      <Section bg="secondary" className="relative">
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-primary mb-8">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Book a free 30-minute consultation. Whether you have a specific project in mind or just want to explore your options, we're here to help.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-accent shrink-0 border border-border" aria-hidden="true">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Headquarters</h3>
                  <address className="text-muted-foreground not-italic">204 Hill Farm Rd<br />Nobleton, ON L7B 0A1</address>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-accent shrink-0 border border-border" aria-hidden="true">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Email</h3>
                  <a href="mailto:contact@nexfortis.com" className="text-muted-foreground hover:text-accent transition-colors">contact@nexfortis.com</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-accent shrink-0 border border-border" aria-hidden="true">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Business Hours</h3>
                  <p className="text-muted-foreground">Mon – Fri: 9:00 AM – 5:00 PM EST</p>
                </div>
              </div>

              {/* TODO: Update this URL when the LinkedIn page is live */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-card rounded-xl shadow-sm flex items-center justify-center text-accent shrink-0 border border-border" aria-hidden="true">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">LinkedIn</h3>
                  <a href="https://www.linkedin.com/company/nexfortis" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent transition-colors">Follow us on LinkedIn</a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-card p-8 md:p-12 rounded-3xl shadow-xl border border-border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <p className="text-sm text-muted-foreground"><span className="text-destructive">*</span> Required field</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-primary mb-2">Full Name <span className="text-destructive" aria-hidden="true">*</span></label>
                  <input
                    id="contact-name"
                    {...register("name")}
                    className={inputClasses}
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby="name-error"
                  />
                  <p id="name-error" className="text-destructive text-sm mt-1" role={errors.name ? "alert" : undefined}>{errors.name?.message ?? ""}</p>
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-primary mb-2">Email Address <span className="text-destructive" aria-hidden="true">*</span></label>
                  <input
                    id="contact-email"
                    {...register("email")}
                    type="email"
                    className={inputClasses}
                    placeholder="john@company.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby="email-error"
                  />
                  <p id="email-error" className="text-destructive text-sm mt-1" role={errors.email ? "alert" : undefined}>{errors.email?.message ?? ""}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-primary mb-2">Phone Number <span className="text-destructive" aria-hidden="true">*</span></label>
                  <input
                    id="contact-phone"
                    {...register("phone")}
                    type="tel"
                    className={inputClasses}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                    aria-required="true"
                    aria-invalid={errors.phone ? "true" : undefined}
                    aria-describedby="phone-error"
                  />
                  <p id="phone-error" className="text-destructive text-sm mt-1" role={errors.phone ? "alert" : undefined}>{errors.phone?.message ?? ""}</p>
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-semibold text-primary mb-2">Company <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input
                    id="contact-company"
                    {...register("company")}
                    className={inputClasses}
                    placeholder="Company Ltd."
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-service" className="block text-sm font-semibold text-primary mb-2">Service Interested In <span className="text-destructive" aria-hidden="true">*</span></label>
                <select
                  id="contact-service"
                  {...register("service")}
                  className={`${inputClasses} text-foreground`}
                  aria-required="true"
                  aria-invalid={errors.service ? "true" : undefined}
                  aria-describedby="service-error"
                >
                  <option value="">Select a service...</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="microsoft-365">Microsoft 365 Solutions</option>
                  <option value="quickbooks">QuickBooks Migration</option>
                  <option value="consulting">IT Consulting</option>
                  <option value="automation">Workflow Automation</option>
                  <option value="other">Other Inquiry</option>
                </select>
                <p id="service-error" className="text-destructive text-sm mt-1" role={errors.service ? "alert" : undefined}>{errors.service?.message ?? ""}</p>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-primary mb-2">Message <span className="text-destructive" aria-hidden="true">*</span></label>
                <textarea
                  id="contact-message"
                  {...register("message")}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Tell us about your project or problem..."
                  aria-required="true"
                  aria-invalid={errors.message ? "true" : undefined}
                  aria-describedby="message-error"
                />
                <p id="message-error" className="text-destructive text-sm mt-1" role={errors.message ? "alert" : undefined}>{errors.message?.message ?? ""}</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 min-h-[48px] rounded-xl bg-warning text-warning-foreground font-bold text-lg hover:bg-warning/90 hover:shadow-lg shadow-warning/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}
