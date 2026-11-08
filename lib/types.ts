export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  readTime: number;
  published: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt" | "slug" | "readTime"> & {
  slug?: string;
  readTime?: number;
  authorRole?: string;
  featured?: boolean;
};

export type PostUpdate = Partial<Omit<Post, "id" | "createdAt" | "updatedAt">>;

export type ListOptions = {
  q?: string;
  search?: string;
  category?: string;
  published?: boolean;
  status?: "all" | "published" | "draft";
  page?: number;
  limit?: number;
};

export type ListResult = {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type BlogDriver = {
  list(options: ListOptions): Promise<ListResult>;
  getByIdOrSlug(idOrSlug: string): Promise<Post | null>;
  create(input: PostInput): Promise<Post>;
  update(id: string, data: PostUpdate): Promise<Post | null>;
  remove(id: string): Promise<boolean>;
  dataSource: "prisma" | "file" | "memory";
};
