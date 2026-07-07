import type { ReactNode } from "react";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Bot,
  CheckCircle2,
  Code2,
  Cloud,
  Database,
  Download,
  ExternalLink,
  FileText,
  Figma,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers3,
  Laptop,
  Link as LinkIcon,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Palette,
  PenTool,
  Phone,
  Rocket,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  UploadCloud,
  User,
  Users,
  Workflow,
  Wrench,
  Eye,
  Bug,
  ChartLine,
  Activity,
  Zap,
  Key,
  BookOpenCheck,
  CalendarDays,
  Clock3,
  FileJson,
  Box,
  Package,
} from "lucide-react";

export type IconSystemOption = {
  key: string;
  label: string;
  category: string;
  type: "lucide" | "tech";
  slug?: string;
  icon?: ReactNode;
};

const tech = (key: string, label: string, slug: string, category = "Development"): IconSystemOption => ({ key, label, category, type: "tech", slug });
const lucide = (key: string, label: string, icon: ReactNode, category = "General"): IconSystemOption => ({ key, label, category, type: "lucide", icon });

export const iconCategories = ["General", "Development", "Frontend", "Backend", "Database", "DevOps", "Cloud", "Design", "AI", "Business", "Social"];

export const iconOptions: IconSystemOption[] = [
  lucide("code", "Code", <Code2 className="h-4 w-4" />),
  lucide("terminal", "Terminal", <Terminal className="h-4 w-4" />),
  lucide("database", "Database", <Database className="h-4 w-4" />),
  lucide("server", "Server", <Box className="h-4 w-4" />),
  lucide("cloud", "Cloud", <Cloud className="h-4 w-4" />),
  lucide("globe", "Globe", <Globe className="h-4 w-4" />),
  lucide("rocket", "Rocket", <Rocket className="h-4 w-4" />),
  lucide("briefcase", "Briefcase", <Briefcase className="h-4 w-4" />),
  lucide("user", "User", <User className="h-4 w-4" />),
  lucide("users", "Users", <Users className="h-4 w-4" />),
  lucide("building", "Building", <Building2 className="h-4 w-4" />),
  lucide("laptop", "Laptop", <Laptop className="h-4 w-4" />),
  lucide("monitor", "Monitor", <Monitor className="h-4 w-4" />),
  lucide("smartphone", "Smartphone", <Smartphone className="h-4 w-4" />),
  lucide("mail", "Mail", <Mail className="h-4 w-4" />),
  lucide("phone", "Phone", <Phone className="h-4 w-4" />),
  lucide("map-pin", "Map Pin", <MapPin className="h-4 w-4" />),
  lucide("link", "Link", <LinkIcon className="h-4 w-4" />),
  lucide("external-link", "External Link", <ExternalLink className="h-4 w-4" />),
  lucide("github", "GitHub", <Github className="h-4 w-4" />),
  lucide("linkedin", "LinkedIn", <Users className="h-4 w-4" />),
  lucide("star", "Star", <Star className="h-4 w-4" />),
  lucide("trophy", "Trophy", <Trophy className="h-4 w-4" />),
  lucide("award", "Award", <Award className="h-4 w-4" />),
  lucide("badge-check", "Badge Check", <BadgeCheck className="h-4 w-4" />),
  lucide("certificate", "Certificate", <FileText className="h-4 w-4" />),
  lucide("graduation-cap", "Graduation Cap", <GraduationCap className="h-4 w-4" />),
  lucide("calendar", "Calendar", <CalendarDays className="h-4 w-4" />),
  lucide("clock", "Clock", <Clock3 className="h-4 w-4" />),
  lucide("zap", "Zap", <Zap className="h-4 w-4" />),
  lucide("shield", "Shield", <Shield className="h-4 w-4" />),
  lucide("lock", "Lock", <Lock className="h-4 w-4" />),
  lucide("key", "Key", <Key className="h-4 w-4" />),
  lucide("settings", "Settings", <Settings className="h-4 w-4" />),
  lucide("wrench", "Wrench", <Wrench className="h-4 w-4" />),
  lucide("bug", "Bug", <Bug className="h-4 w-4" />),
  lucide("git-branch", "Git Branch", <GitBranch className="h-4 w-4" />),
  lucide("upload-cloud", "Upload Cloud", <UploadCloud className="h-4 w-4" />),
  lucide("download", "Download", <Download className="h-4 w-4" />),
  lucide("file-text", "File Text", <FileText className="h-4 w-4" />),
  lucide("book-open", "Book Open", <BookOpen className="h-4 w-4" />),
  lucide("layers", "Layers", <Layers3 className="h-4 w-4" />),
  lucide("workflow", "Workflow", <Workflow className="h-4 w-4" />),
  lucide("chart-line", "Chart Line", <ChartLine className="h-4 w-4" />),
  lucide("bar-chart", "Bar Chart", <BarChart3 className="h-4 w-4" />),
  lucide("activity", "Activity", <Activity className="h-4 w-4" />),
  lucide("sparkles", "Sparkles", <Sparkles className="h-4 w-4" />),
  lucide("brain", "Brain", <Brain className="h-4 w-4" />),
  lucide("bot", "Bot", <Bot className="h-4 w-4" />),
  lucide("eye", "Eye", <Eye className="h-4 w-4" />),
  lucide("image", "Image", <ImageIcon className="h-4 w-4" />),
  lucide("palette", "Palette", <Palette className="h-4 w-4" />),
  lucide("pen-tool", "Pen Tool", <PenTool className="h-4 w-4" />),
  lucide("box", "Box", <Box className="h-4 w-4" />),
  lucide("package", "Package", <Package className="h-4 w-4" />),
  lucide("check-circle", "Check Circle", <CheckCircle2 className="h-4 w-4" />),
  lucide("alert-circle", "Alert Circle", <AlertCircle className="h-4 w-4" />),
  lucide("info", "Info", <Info className="h-4 w-4" />),
  lucide("help-circle", "Help Circle", <HelpCircle className="h-4 w-4" />),
  lucide("message-circle", "Message Circle", <MessageCircle className="h-4 w-4" />),
  tech("html5", "HTML5", "html5", "Frontend"),
  tech("css3", "CSS3", "css3", "Frontend"),
  tech("javascript", "JavaScript", "javascript", "Frontend"),
  tech("typescript", "TypeScript", "typescript", "Frontend"),
  tech("react", "React", "react", "Frontend"),
  tech("nextjs", "Next.js", "nextdotjs", "Frontend"),
  tech("nodejs", "Node.js", "nodedotjs", "Backend"),
  tech("express", "Express", "express", "Backend"),
  tech("python", "Python", "python", "Backend"),
  tech("django", "Django", "django", "Backend"),
  tech("fastapi", "FastAPI", "fastapi", "Backend"),
  tech("php", "PHP", "php", "Backend"),
  tech("laravel", "Laravel", "laravel", "Backend"),
  tech("mysql", "MySQL", "mysql", "Database"),
  tech("postgresql", "PostgreSQL", "postgresql", "Database"),
  tech("mongodb", "MongoDB", "mongodb", "Database"),
  tech("redis", "Redis", "redis", "Database"),
  tech("firebase", "Firebase", "firebase", "Cloud"),
  tech("supabase", "Supabase", "supabase", "Cloud"),
  tech("appwrite", "Appwrite", "appwrite", "Cloud"),
  tech("docker", "Docker", "docker", "DevOps"),
  tech("kubernetes", "Kubernetes", "kubernetes", "DevOps"),
  tech("git", "Git", "git", "Development"),
  tech("github-tech", "GitHub", "github", "Development"),
  tech("tailwindcss", "Tailwind CSS", "tailwindcss", "Frontend"),
  tech("bootstrap", "Bootstrap", "bootstrap", "Frontend"),
  tech("vercel", "Vercel", "vercel", "Cloud"),
  tech("render", "Render", "render", "Cloud"),
  tech("railway", "Railway", "railway", "Cloud"),
  tech("aws", "AWS", "amazonwebservices", "Cloud"),
  tech("cloudinary", "Cloudinary", "cloudinary", "Cloud"),
  tech("figma", "Figma", "figma", "Design"),
  tech("photoshop", "Photoshop", "adobephotoshop", "Design"),
  tech("flutter", "Flutter", "flutter", "Frontend"),
];

const optionMap = new Map(iconOptions.map((option) => [option.key, option] as const));
const labelMap = new Map(iconOptions.map((option) => [option.label.toLowerCase(), option] as const));

export function suggestSkillIconKey(name?: string, category?: string) {
  const raw = String(name || category || "").trim().toLowerCase();
  if (!raw) return "";
  const normalized = raw.replace(/[^a-z0-9#+]+/g, "");
  return labelMap.get(raw)?.key || optionMap.get(normalized)?.key || normalized;
}

export function getIconOption(key?: string) {
  const normalized = String(key || "").trim().toLowerCase();
  return optionMap.get(normalized) || labelMap.get(normalized) || null;
}

export function getIconOptions(query = "", category?: string) {
  const q = query.trim().toLowerCase();
  return iconOptions.filter((entry) => {
    const matchesQuery = !q || entry.label.toLowerCase().includes(q) || entry.key.includes(q) || entry.category.toLowerCase().includes(q);
    const matchesCategory = !category || entry.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function renderIcon(key?: string, color?: string, className = "h-4 w-4") {
  const option = getIconOption(key);
  if (!option) {
    return <Code2 className={className} style={color ? { color } : undefined} />;
  }
  if (option.type === "lucide") {
    return <span className={className} style={color ? { color } : undefined}>{option.icon}</span>;
  }
  const slug = option.slug || "code";
  return <img src={`https://cdn.simpleicons.org/${slug}${color ? `/${String(color).replace("#", "")}` : ""}`} alt="" aria-hidden="true" className={className} loading="lazy" />;
}
