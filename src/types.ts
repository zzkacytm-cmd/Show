export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  category?: string;
  link?: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string;
  order: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  imageUrl?: string;
  order: number;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  period: string;
  description?: string;
  order: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
  order: number;
}

export interface Profile {
  name: string;
  tagline?: string;
  bio?: string;
  aboutMe?: string;
  moodEmojis?: string[];
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  resumeUrl?: string;
  socialLinks?: {
    wechat?: string;
    linkedin?: string;
    email?: string;
    instagram?: string;
  };
  bannerUrl?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
