import { NextResponse } from "next/server";
import { deleteConnection } from "@/lib/scales/connections";
import { isScaleProvider } from "@/lib/scales/registry";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider;
  if (!isScaleProvider(provider)) {
    return NextResponse.json({ error: "Provider inconnu" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteConnection(user.id, provider);
  return NextResponse.json({ ok: true });
}
