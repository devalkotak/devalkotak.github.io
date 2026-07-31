export type PortfolioProject = {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
  topics: string[];
};

export type ProjectLoadState = {
  projects: PortfolioProject[];
  error: string | null;
};

export type WriteupCategory = string;

export type RichText = {
  plainText: string;
  href: string | null;
  bold: boolean;
  italic: boolean;
  code: boolean;
};

export type NotionBlock = {
  id: string;
  type: string;
  richText?: RichText[];
  language?: string;
  url?: string;
  children?: NotionBlock[];
  cells?: RichText[][];
  hasColumnHeader?: boolean;
  isToggleable?: boolean;
};

export type WriteupSummary = {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  properties?: Record<string, string | string[] | number | boolean | null>;
};

export type WriteupDetail = WriteupSummary & {
  blocks: NotionBlock[];
};

export type ResourceItem = {
  id: string;
  title: string;
  description: string;
  href?: string | null;
  kind: string;
  category: string;
  tags: string[];
  date: string;
  source?: string;
  properties?: Record<string, string | string[] | number | boolean | null>;
};

export type ResourceLoadState = {
  resources: ResourceItem[];
  error: string | null;
};

export type OptiverseContent = {
  title: string | null;
  blocks: NotionBlock[];
  error: string | null;
};
