import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin";

export async function GET() {
  const user = await requireAdminUser();
  return NextResponse.json({ admin: !!user });
}
