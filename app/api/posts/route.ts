import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listPosts, createPost, getDriver } from "@/lib/blog-store";
import { revalidatePath } from "next/cache";

const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().nullable().optional(),
  author: z.string().default("Partha Chakraborty"),
  authorRole: z.string().default("Founder, Tactyqal Labs"),
  readTime: z.number().int().positive().optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
});

function checkAuth(req: NextRequest): NextResponse | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return null;
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${token}`) {
    return NextResponse.json(
      { success: false, data: null, error: "Unauthorized", meta: {} },
      { status: 401 }
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q") || undefined;
    const category = searchParams.get("category") ?? undefined;
    const statusParam = searchParams.get("status");
    const publishedParam = searchParams.get("published");

    let status: "all" | "published" | "draft" | undefined = undefined;
    let published: boolean | undefined = undefined;

    if (statusParam === "all") {
      status = "all";
    } else if (statusParam === "published") {
      status = "published";
    } else if (statusParam === "draft") {
      status = "draft";
    } else if (publishedParam === "true") {
      published = true;
    } else if (publishedParam === "false") {
      published = false;
    }

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10))
    );

    const driver = await getDriver();
    const result = await listPosts({
      search,
      q: search,
      category,
      published,
      status,
      page,
      limit,
    });

    return NextResponse.json(
      {
        success: true,
        count: result.posts.length,
        data: result.posts,
        error: null,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          pages: result.pages,
        },
      },
      {
        headers: {
          "X-Data-Source": driver.dataSource,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { success: false, data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = checkAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = PostCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: "Validation failed",
          meta: { fields: parsed.error.flatten().fieldErrors },
        },
        { status: 400 }
      );
    }

    const driver = await getDriver();
    const post = await createPost({
      ...parsed.data,
      excerpt: parsed.data.excerpt || parsed.data.content.slice(0, 150) + "...",
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(
      { success: true, data: post, error: null, meta: {} },
      {
        status: 201,
        headers: {
          "X-Data-Source": driver.dataSource,
        },
      }
    );
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json(
      { success: false, data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}
