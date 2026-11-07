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
    "mem_" +
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

const memoryDriver: BlogDriver = {
  dataSource: "memory",

  async list({ q, category, published, page = 1, limit = 10 }: ListOptions): Promise<ListResult> {
    let posts = [...getMemoryPosts()];

    if (published !== undefined) {
      posts = posts.filter((p) => p.published === published);
    }
    if (category) {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (q) {
      posts = posts.filter((p) => matchesSearch(p, q));
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
    const posts = getMemoryPosts();
    return (
      posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
    );
  },

  async create(input: PostInput): Promise<Post> {
    const posts = getMemoryPosts();
    const existingSlugs = posts.map((p) => p.slug);
    const baseSlug = generateSlug(input.title);
    const slug = input.slug || dedupeSlug(baseSlug, existingSlugs);
    const readTime = input.readTime || computeReadTime(input.content);

    const now = new Date();
    const post: Post = {
      id: generateId(),
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage ?? null,
      category: input.category,
      tags: input.tags,
      author: input.author || "Tactyqal",
      readTime,
      published: input.published ?? true,
      createdAt: now,
      updatedAt: now,
    };

    setMemoryPosts([...posts, post]);
    return post;
  },

  async update(id: string, data: PostUpdate): Promise<Post | null> {
    const posts = getMemoryPosts();
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
    setMemoryPosts(newPosts);
    return updated;
  },

  async remove(id: string): Promise<boolean> {
    const posts = getMemoryPosts();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    setMemoryPosts(posts.filter((_, i) => i !== idx));
    return true;
  },
};

async function getPrismaDriver(): Promise<BlogDriver> {
  const { default: prisma } = await import("./prisma");

  async function dedupeSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const existing = await prisma.post.findMany({
      where: excludeId ? { NOT: { id: excludeId } } : {},
      select: { slug: true },
    });
    const slugs = existing.map((p: { slug: string }) => p.slug);
    if (!slugs.includes(baseSlug)) return baseSlug;
    let n = 2;
    while (slugs.includes(`${baseSlug}-${n}`)) n++;
    return `${baseSlug}-${n}`;
  }

  return {
    dataSource: "prisma",

    async list({ q, category, published, page = 1, limit = 10 }: ListOptions): Promise<ListResult> {
      const where: Record<string, unknown> = {};
      if (published !== undefined) where["published"] = published;
      if (category) where["category"] = { equals: category, mode: "insensitive" };
      if (q) {
        where["OR"] = [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
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
    },

    async getByIdOrSlug(idOrSlug: string): Promise<Post | null> {
      const post = await prisma.post.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      });
      return post as Post | null;
    },

    async create(input: PostInput): Promise<Post> {
      const baseSlug = generateSlug(input.title);
      const slug = await dedupeSlug(input.slug || baseSlug);
      const readTime = computeReadTime(input.content);
      const post = await prisma.post.create({
        data: { ...input, slug, readTime },
      });
      return post as Post;
    },

    async update(id: string, data: PostUpdate): Promise<Post | null> {
      const existing = await prisma.post.findUnique({ where: { id } });
      if (!existing) return null;

      let slug = existing.slug;
      if (data.title && data.title !== existing.title && !data.slug) {
        const baseSlug = generateSlug(data.title);
        slug = await dedupeSlug(baseSlug, id);
      } else if (data.slug) {
        slug = data.slug;
      }

      const readTime = data.content
        ? computeReadTime(data.content)
        : existing.readTime;

      const post = await prisma.post.update({
        where: { id },
        data: { ...data, slug, readTime },
      });
      return post as Post;
    },

    async remove(id: string): Promise<boolean> {
      try {
        await prisma.post.delete({ where: { id } });
        return true;
      } catch {
        return false;
      }
    },
  };
}

let _driver: BlogDriver | null = null;

export async function getDriver(): Promise<BlogDriver> {
  if (process.env.DATABASE_URL) {
    if (!_driver || _driver.dataSource !== "prisma") {
      _driver = await getPrismaDriver();
    }
    return _driver;
  }
  return memoryDriver;
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

