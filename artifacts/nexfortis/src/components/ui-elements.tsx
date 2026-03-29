import React, { ReactNode } from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function Section({ children, className = "", bg = "white", id }: { children: ReactNode, className?: string, bg?: "white" | "secondary" | "primary", id?: string }) {
  const bgClasses = {
    white: "bg-background text-foreground",
    secondary: "bg-secondary text-foreground",
    primary: "bg-primary text-primary-foreground"
  };

  return (
    <section id={id} className={`py-20 md:py-32 ${bgClasses[bg]} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ title, subtitle, centered = false, light = false }: { title: string, subtitle?: string, centered?: boolean, light?: boolean }) {
  return (
    <div className={`mb-16 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      <h2
        className={`text-3xl md:text-5xl font-display font-bold tracking-tight mb-6 ${light ? "text-white" : "text-primary"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg md:text-xl leading-relaxed ${light ? "text-white/80" : "text-muted-foreground"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ServiceCard({ title, description, icon: Icon, href, cta = "Get a Free Quote" }: { title: string, description: string, icon: LucideIcon, href: string, cta?: string }) {
  return (
    <div
      className="bg-card rounded-2xl p-8 shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/50 flex flex-col h-full group transition-all duration-200 hover:shadow-xl hover:border-accent/50 hover:-translate-y-2"
    >
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground flex-grow mb-6 leading-relaxed">{description}</p>
      <Link href={href} className="text-accent font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
        {cta} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Link>
    </div>
  );
}

export function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-primary">{question}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`text-accent shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-muted-foreground leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function PageHero({ title, subtitle, imagePath, imageWebpPath }: { title: string, subtitle: string, imagePath?: string, imageWebpPath?: string }) {
  return (
    <div className="relative pt-24 pb-14 md:pt-32 md:pb-20 bg-primary overflow-hidden">
      {imagePath && (
        <div className="absolute inset-0 z-0">
          <picture>
            {imageWebpPath && <source srcSet={imageWebpPath} type="image/webp" />}
            <img src={imagePath} alt="" className="w-full h-full object-cover opacity-20" loading="eager" aria-hidden="true" />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>
      )}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none" aria-hidden="true" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1
          className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight"
        >
          {title}
        </h1>
        <p
          className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto"
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function PageBreadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

