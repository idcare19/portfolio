export type AdminResource =
  | "projects"
  | "skills"
  | "services"
  | "testimonials"
  | "messages"
  | "blogs"
  | "media"
  | "profile"
  | "settings"
  | "activity";

export type BaseEntity = {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Project = BaseEntity & {
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  category: string;
  image: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
};

export type Skill = BaseEntity & {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Tools";
  icon: string;
  level: number;
};

export type Service = BaseEntity & {
  title: string;
  description: string;
  icon: string;
};

export type Testimonial = BaseEntity & {
  clientName: string;
  roleCompany: string;
  message: string;
  image?: string;
};

export type ContactMessage = BaseEntity & {
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
};

export type BlogPost = BaseEntity & {
  title: string;
  slug: string;
  thumbnail?: string;
  content: string;
  tags: string[];
  published: boolean;
};

export type MediaItem = BaseEntity & {
  name: string;
  url: string;
  type: string;
  size: number;
};

export type ProfileSettings = BaseEntity & {
  name: string;
  role: string;
  bio: string;
  profileImage: string;
  resumeUrl: string;
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
    instagram?: string;
    twitter?: string;
  };
};

export type WebsiteSettings = BaseEntity & {
  seoTitle: string;
  seoDescription: string;
  favicon: string;
  logo: string;
  footerText: string;
  theme: "light" | "dark" | "system";
};
