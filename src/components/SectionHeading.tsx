import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ label, title, description }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className="text-center max-w-2xl mx-auto mb-16"
  >
    {label && (
      <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
        {label}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">{title}</h2>
    {description && (
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
