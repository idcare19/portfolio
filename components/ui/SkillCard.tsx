"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";
import { motion } from "framer-motion";

type SkillCardProps = {
  title: string;
  items: string[];
  delay?: number;
};

export function SkillCard({ title, items, delay = 0 }: SkillCardProps) {
  return (
    <FadeInUp delay={delay} className="glass rounded-3xl p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <motion.span
            key={item}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition-all duration-500 ease-out"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            whileHover={{ y: -2, borderColor: "rgba(59,130,246,0.6)", boxShadow: "0 10px 20px rgba(59,130,246,0.16)" }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </FadeInUp>
  );
}
