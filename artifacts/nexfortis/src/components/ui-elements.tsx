import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

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
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`text-3xl md:text-5xl font-display font-bold tracking-tight mb-6 ${light ? "text-white" : "text-primary"}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className={`text-lg md:text-xl leading-relaxed ${light ? "text-white/80" : "text-muted-foreground"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function ServiceCard({ title, description, icon: Icon, href }: { title: string, description: string, icon: LucideIcon, href: string }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-card rounded-2xl p-8 shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/50 flex flex-col h-full group transition-all duration-200 hover:shadow-xl hover:border-accent/50"
    >
      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-200">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-muted-foreground flex-grow mb-6 leading-relaxed">{description}</p>
      <Link href={href} className="text-accent font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
        Learn More <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Link>
    </motion.div>
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
        <ChevronDown className={`w-5 h-5 text-accent shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="pb-5 text-muted-foreground leading-relaxed pr-8">
          {answer}
        </div>
      )}
    </div>
  );
}

export function PageHero({ title, subtitle, imagePath, imageWebpPath }: { title: string, subtitle: string, imagePath?: string, imageWebpPath?: string }) {
  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-primary overflow-hidden">
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
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
}
