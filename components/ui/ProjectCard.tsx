"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  project: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 230, damping: 18 }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-blue-500/15 before:via-cyan-300/10 before:to-violet-400/15 before:opacity-0 before:transition before:duration-500 hover:border-blue-300/70 hover:before:opacity-100 hover:shadow-[0_24px_48px_rgba(59,130,246,0.22)]"
    >
      <motion.div
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        animate={{ x: ["-120%", "320%"] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70">
        <Image
          src={project.image}
          alt={project.title}
          width={1200}
          height={700}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-52"
        />
        <div className="pointer-events-none absolute inset-0 translate-y-4 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
      </div>

      <div className="relative mt-4">
        <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((tech, index) => (
            <motion.span
              key={tech}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.12 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {project.liveUrl !== "#" && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-all duration-500 ease-out hover:scale-105 hover:border-blue-500 hover:bg-blue-100"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live
            </Link>
          )}
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-all duration-500 ease-out hover:scale-105 hover:border-blue-400 hover:text-blue-700"
          >
            <Github className="h-3.5 w-3.5 transition group-hover:-rotate-6" /> Code
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
