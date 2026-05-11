export type Experience = {
  title: string;
  period: string;
  summary: string;
  skills: string[];
  milestones: string[];
  current: boolean;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
  summary: string;
  content: string;
  readingTime: string;
};
