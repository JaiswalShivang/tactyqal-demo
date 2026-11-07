import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listPosts, createPost, getDriver } from "@/lib/blog-store";
import { revalidatePath } from "next/cache";

const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  author: z.string().default("Tactyqal"),
  readTime: z.number().int().positive().optional(),
  published: z.boolean().default(true),
});

function checkAuth(req: NextRequest): NextResponse | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return null;
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${token}`) {
    return NextResponse.json(
      { data: null, error: "Unauthorized", meta: {} },
      { status: 401 }
    );
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const publishedParam = searchParams.get("published");
    const published =
      publishedParam === "true"
        ? true
        : publishedParam === "false"
        ? false
        : true;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
    );

    const driver = await getDriver();
    const result = await listPosts({ q, category, published, page, limit });

    return NextResponse.json(
      {
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
      { data: null, error: "Internal server error", meta: {} },
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
          data: null,
          error: "Validation failed",
          meta: { fields: parsed.error.flatten().fieldErrors },
        },
        { status: 400 }
      );
    }

    const driver = await getDriver();
    const post = await createPost(parsed.data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(
      { data: post, error: null, meta: {} },
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
      { data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}

