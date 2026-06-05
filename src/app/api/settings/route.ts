import { NextRequest, NextResponse } from "next/server";
import { getSetting, upsertSetting } from "@/actions/settings";

export async function GET() {
  const result = await getSetting();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await upsertSetting(body);
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Failed to parse settings POST body:", error);
    return NextResponse.json(
      { success: false, error: "Payload tidak valid" },
      { status: 400 }
    );
  }
}
