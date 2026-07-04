import type { ReactNode } from "react";
import { 
  Code2, 
  Database, 
  Server, 
  Github, 
  GitBranch, 
  CheckCircle, 
  Rocket, 
  Globe, 
  Wrench, 
  Sparkles,
  Layout,
  Palette,
  Terminal,
  Cloud,
  type LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Core mapping for simple names (siteData.json usage)
  html: Code2,
  css: Palette,
  javascript: Code2,
  bootstrap: Layout,
  tailwind: Sparkles,
  next: Rocket,
  react: Layout,
  database: Database,
  mysql: Database,
  laravel: Server,
  django: Server,
  server: Server,
  php: Terminal,
  appwrite: Cloud,
  wordpress: Layout,
  git: GitBranch,
  "git-branch": GitBranch,
  github: Github,
  testing: CheckCircle,
  "check-circle": CheckCircle,
  deployment: Rocket,
  rocket: Rocket,
  vercel: Globe,
  layout: Layout,
  code: Code2,
  wrench: Wrench,
  // Backward compatibility for Si* names
  SiHtml5: Code2,
  SiCss3: Palette,
  SiJavascript: Code2,
  SiTypescript: Code2,
  SiReact: Layout,
  SiNextdotjs: Rocket,
  SiMongodb: Database,
  SiMysql: Database,
  SiLaravel: Server,
  SiDjango: Server,
  SiPhp: Terminal,
  SiGit: GitBranch,
  SiGithub: Github,
  SiVercel: Globe,
  SiAppwrite: Cloud,
  SiTailwindcss: Sparkles,
  SiBootstrap: Layout,
  SiWordpress: Layout,
};

export const skillIconOptions = Object.keys(iconMap).filter(key => !key.startsWith('Si'));

export function renderSkillIcon(iconKey?: string, color?: string): ReactNode {
  const SelectedIcon = (iconKey ? iconMap[iconKey] : null) || Code2;
  return (
    <span style={color ? { color } : undefined} className="inline-flex text-base">
      <SelectedIcon />
    </span>
  );
}
