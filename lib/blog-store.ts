import fs from "fs";
import path from "path";
import type {
  BlogDriver,
  Post,
  PostInput,
  PostUpdate,
  ListOptions,
  ListResult,
} from "./types";
import { getMemoryPosts, setMemoryPosts } from "./memory-store";

export function computeReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function dedupeSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;
  let n = 2;
  while (existingSlugs.includes(`${baseSlug}-${n}`)) n++;
  return `${baseSlug}-${n}`;
}

function generateId(): string {
  return (
    "post_" +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  );
}

function matchesSearch(post: Post, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    post.title.toLowerCase().includes(lower) ||
    post.excerpt.toLowerCase().includes(lower) ||
    post.content.toLowerCase().includes(lower) ||
    post.tags.some((t) => t.toLowerCase().includes(lower))
  );
}

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

function ensureFileExists(): Post[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(POSTS_FILE)) {
      const raw = fs.readFileSync(POSTS_FILE, "utf8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          }));
        }
      }
    }
    const initialPosts = getMemoryPosts().map((p, idx) => ({
      ...p,
      author: p.author === "Tactyqal" ? "Partha Chakraborty" : p.author,
      authorRole: p.authorRole || "Founder, Tactyqal Labs",
      featured: p.featured ?? idx === 0,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
    fs.writeFileSync(POSTS_FILE, JSON.stringify(initialPosts, null, 2), "utf8");
    return initialPosts;
  } catch (err) {
    console.error("Failed to read/write posts.json:", err);
    return getMemoryPosts();
  }
}

function writePostsToFile(posts: Post[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to posts.json:", err);
  }
}

const fileDriver: BlogDriver = {
  dataSource: "file",

  async list({ q, search, category, published, status, page = 1, limit = 10 }: ListOptions): Promise<ListResult> {
    let posts = ensureFileExists();

    if (status === "published") {
      posts = posts.filter((p) => p.published === true);
    } else if (status === "draft") {
      posts = posts.filter((p) => p.published === false);
    } else if (status !== "all" && published !== undefined) {
      posts = posts.filter((p) => p.published === published);
    }

    if (category && category !== "All") {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const query = q || search;
    if (query) {
      posts = posts.filter((p) => matchesSearch(p, query));
    }

    posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = posts.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const sliced = posts.slice(start, start + limit);

    return { posts: sliced, total, page, limit, pages };
  },

  async getByIdOrSlug(idOrSlug: string): Promise<Post | null> {
    const posts = ensureFileExists();
    return (
      posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
    );
  },

  async create(input: PostInput): Promise<Post> {
    const posts = ensureFileExists();
    const existingSlugs = posts.map((p) => p.slug);
    const baseSlug = generateSlug(input.title);
    const slug = input.slug || dedupeSlug(baseSlug, existingSlugs);
    const readTime = input.readTime || computeReadTime(input.content);
    const excerpt = input.excerpt || input.content.slice(0, 150) + "...";

    const now = new Date();
    const post: Post = {
      id: generateId(),
      title: input.title,
      slug,
      excerpt,
      content: input.content,
      coverImage: input.coverImage ?? "/extracted/blog-ele.webp",
      category: input.category,
      tags: Array.isArray(input.tags) ? input.tags : [],
      author: input.author || "Partha Chakraborty",
      authorRole: input.authorRole || "Founder, Tactyqal Labs",
      readTime,
      published: input.published ?? true,
      featured: input.featured ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const nextPosts = [post, ...posts];
    writePostsToFile(nextPosts);
    setMemoryPosts(nextPosts);
    return post;
  },

  async update(id: string, data: PostUpdate): Promise<Post | null> {
    const posts = ensureFileExists();
    const idx = posts.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return null;

    const existing = posts[idx]!;
    const updatedContent = data.content ?? existing.content;
    const updatedTitle = data.title ?? existing.title;

    let slug = existing.slug;
    if (data.title && data.title !== existing.title && !data.slug) {
      const existingSlugs = posts
        .filter((_, i) => i !== idx)
        .map((p) => p.slug);
      const baseSlug = generateSlug(updatedTitle);
      slug = dedupeSlug(baseSlug, existingSlugs);
    } else if (data.slug) {
      slug = data.slug;
    }

    const readTime =
      data.content ? computeReadTime(updatedContent) : existing.readTime;

    const updated: Post = {
      ...existing,
      ...data,
      slug,
      readTime,
      updatedAt: new Date(),
    };

    const newPosts = [...posts];
    newPosts[idx] = updated;
    writePostsToFile(newPosts);
    setMemoryPosts(newPosts);
    return updated;
  },

  async remove(id: string): Promise<boolean> {
    const posts = ensureFileExists();
    const idx = posts.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return false;
    const nextPosts = posts.filter((_, i) => i !== idx);
    writePostsToFile(nextPosts);
    setMemoryPosts(nextPosts);
    return true;
  },
};

function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.length < 15) return false;
  return (
    (trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://")) &&
    !trimmed.includes("USER:PASSWORD") &&
    !trimmed.includes("your_database_url")
  );
}

async function getPrismaDriver(): Promise<BlogDriver> {
  const { default: prisma } = await import("./prisma");

  async function dedupeSlug(baseSlug: string, excludeId?: string): Promise<string> {
    try {
      const existing = await prisma.post.findMany({
        where: excludeId ? { NOT: { id: excludeId } } : {},
        select: { slug: true },
      });
      const slugs = existing.map((p: { slug: string }) => p.slug);
      if (!slugs.includes(baseSlug)) return baseSlug;
      let n = 2;
      while (slugs.includes(`${baseSlug}-${n}`)) n++;
      return `${baseSlug}-${n}`;
    } catch {
      return baseSlug;
    }
  }

  return {
    dataSource: "prisma",

    async list(options: ListOptions): Promise<ListResult> {
      try {
        const { q, search, category, published, status, page = 1, limit = 10 } = options;
        const where: Record<string, unknown> = {};
        if (status === "published") {
          where["published"] = true;
        } else if (status === "draft") {
          where["published"] = false;
        } else if (status !== "all" && published !== undefined) {
          where["published"] = published;
        }

        if (category && category !== "All") {
          where["category"] = { equals: category, mode: "insensitive" };
        }

        const query = q || search;
        if (query) {
          where["OR"] = [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { tags: { has: query } },
          ];
        }

        const [posts, total] = await Promise.all([
          prisma.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.post.count({ where }),
        ]);

        return {
          posts: posts as Post[],
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        };
      } catch {
        return fileDriver.list(options);
      }
    },

    async getByIdOrSlug(idOrSlug: string): Promise<Post | null> {
      try {
        const post = await prisma.post.findFirst({
          where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        });
        return (post as Post | null) ?? fileDriver.getByIdOrSlug(idOrSlug);
      } catch {
        return fileDriver.getByIdOrSlug(idOrSlug);
      }
    },

    async create(input: PostInput): Promise<Post> {
      try {
        const baseSlug = generateSlug(input.title);
        const slug = await dedupeSlug(input.slug || baseSlug);
        const readTime = input.readTime || computeReadTime(input.content);
        const excerpt = input.excerpt || input.content.slice(0, 150) + "...";
        const post = await prisma.post.create({
          data: {
            title: input.title,
            slug,
            excerpt,
            content: input.content,
            coverImage: input.coverImage ?? "/extracted/blog-ele.webp",
            category: input.category,
            tags: Array.isArray(input.tags) ? input.tags : [],
            author: input.author || "Partha Chakraborty",
            authorRole: input.authorRole || "Founder, Tactyqal Labs",
            readTime,
            published: input.published ?? true,
            featured: input.featured ?? false,
          },
        });
        return post as Post;
      } catch {
        return fileDriver.create(input);
      }
    },

    async update(id: string, data: PostUpdate): Promise<Post | null> {
      try {
        const existing = await prisma.post.findFirst({
          where: { OR: [{ id }, { slug: id }] },
        });
        if (!existing) return fileDriver.update(id, data);

        let slug = existing.slug;
        if (data.title && data.title !== existing.title && !data.slug) {
          const baseSlug = generateSlug(data.title);
          slug = await dedupeSlug(baseSlug, existing.id);
        } else if (data.slug) {
          slug = data.slug;
        }

        const readTime = data.content
          ? computeReadTime(data.content)
          : existing.readTime;

        const post = await prisma.post.update({
          where: { id: existing.id },
          data: { ...data, slug, readTime },
        });
        return post as Post;
      } catch {
        return fileDriver.update(id, data);
      }
    },

    async remove(id: string): Promise<boolean> {
      try {
        const existing = await prisma.post.findFirst({
          where: { OR: [{ id }, { slug: id }] },
          select: { id: true },
        });
        if (!existing) return fileDriver.remove(id);
        await prisma.post.delete({ where: { id: existing.id } });
        return true;
      } catch {
        return fileDriver.remove(id);
      }
    },
  };
}

let _driver: BlogDriver | null = null;

export async function getDriver(): Promise<BlogDriver> {
  if (isValidDatabaseUrl(process.env.DATABASE_URL)) {
    try {
      if (!_driver || _driver.dataSource !== "prisma") {
        _driver = await getPrismaDriver();
      }
      return _driver;
    } catch {
      return fileDriver;
    }
  }
  return fileDriver;
}

export async function listPosts(options: ListOptions): Promise<ListResult> {
  const driver = await getDriver();
  return driver.list(options);
}

export async function getPostByIdOrSlug(idOrSlug: string): Promise<Post | null> {
  const driver = await getDriver();
  return driver.getByIdOrSlug(idOrSlug);
}

export async function createPost(input: PostInput): Promise<Post> {
  const driver = await getDriver();
  return driver.create(input);
}

export async function updatePost(id: string, data: PostUpdate): Promise<Post | null> {
  const driver = await getDriver();
  return driver.update(id, data);
}

export async function removePost(id: string): Promise<boolean> {
  const driver = await getDriver();
  return driver.remove(id);
}
