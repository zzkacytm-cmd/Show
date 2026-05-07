import { ReactNode } from "react";
import { motion } from "motion/react";

interface SectionProps {
  id: string;
  title?: string;
  children: ReactNode;
  bgColor?: string;
  className?: string;
}

export default function Section({ id, title, children, bgColor = "bg-white", className = "" }: SectionProps) {
  return (
    <section 
      id={id} 
      className={`relative py-32 px-6 md:px-12 ${bgColor} ${className} overflow-hidden`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {title && (
          <motion.h2 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-display mb-24 uppercase italic tracking-tighter"
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}
