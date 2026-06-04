export interface Identity {
  name: string;
  title: string;
  employer: string;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  year: number;
  problem: string;
  impact: string;
  stack: string[];
  github: string;
  demo?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  readTime: number;
  tag: string;
  summary: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  phone: string;
  availability: {
    show: boolean;
    message: string;
  };
}

export interface HomeContent {
  roleBadge: string;
  headline: string;
  subheading: string;
  bio: string;
  stats: Array<{ value: string; label: string }>;
  suggestions: string[];
}
