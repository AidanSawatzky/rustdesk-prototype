import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  return NextResponse.json({
    message: `Connected to device ${body.deviceId}`,
    token: crypto.randomUUID(),
  });
}