import { NextResponse } from "next/server";
import { getDriver } from "@/lib/blog-store";

export async function GET() {
  const start = Date.now();
  try {
    const driver = await getDriver();
    const latency = Date.now() - start;
    return NextResponse.json(
      { status: "ok", dataSource: driver.dataSource, latency },
      {
        headers: {
          "X-Data-Source": driver.dataSource,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { status: "error", latency: Date.now() - start },
      { status: 500 }
    );
  }
}

