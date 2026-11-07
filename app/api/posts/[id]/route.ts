import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getPostByIdOrSlug,
  updatePost,
  removePost,
  getDriver,
} from "@/lib/blog-store";
import { revalidatePath } from "next/cache";

const PostUpdateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  readTime: z.number().int().positive().optional(),
  published: z.boolean().optional(),
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

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const driver = await getDriver();
    const post = await getPostByIdOrSlug(id);

    if (!post) {
      return NextResponse.json(
        { data: null, error: `Post not found: ${id}`, meta: {} },
        { status: 404, headers: { "X-Data-Source": driver.dataSource } }
      );
    }

    return NextResponse.json(
      { data: post, error: null, meta: {} },
      { headers: { "X-Data-Source": driver.dataSource } }
    );
  } catch (err) {
    console.error("GET /api/posts/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const authError = checkAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = PostUpdateSchema.safeParse(body);

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
    const post = await updatePost(id, parsed.data);

    if (!post) {
      return NextResponse.json(
        { data: null, error: `Post not found: ${id}`, meta: {} },
        { status: 404, headers: { "X-Data-Source": driver.dataSource } }
      );
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(
      { data: post, error: null, meta: {} },
      { headers: { "X-Data-Source": driver.dataSource } }
    );
  } catch (err) {
    console.error("PUT /api/posts/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAuth(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const driver = await getDriver();
    const success = await removePost(id);

    if (!success) {
      return NextResponse.json(
        { data: null, error: `Post not found: ${id}`, meta: {} },
        { status: 404, headers: { "X-Data-Source": driver.dataSource } }
      );
    }

    revalidatePath("/");
    revalidatePath("/blog");

    return NextResponse.json(
      { data: { id, deleted: true }, error: null, meta: {} },
      { headers: { "X-Data-Source": driver.dataSource } }
    );
  } catch (err) {
    console.error("DELETE /api/posts/[id] error:", err);
    return NextResponse.json(
      { data: null, error: "Internal server error", meta: {} },
      { status: 500 }
    );
  }
}

