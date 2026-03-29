import { PageHero, Section } from "@/components/ui-elements";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <PageHero title={title} subtitle="Last Updated: October 2023" />
      <Section bg="white">
        <div className="max-w-3xl mx-auto prose prose-blue lg:prose-lg text-muted-foreground">
          <h2>1. Introduction</h2>
          <p>
            This is a placeholder page for the {title}. In a production environment, this would contain the full legal text provided by your legal counsel.
          </p>
          <p>
            NexFortis IT Solutions takes privacy and terms of service seriously. We adhere to all Canadian regulations regarding data protection and business operations.
          </p>
          <h2>2. Data Collection</h2>
          <p>
            Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis.
          </p>
        </div>
      </Section>
    </div>
  );
}
