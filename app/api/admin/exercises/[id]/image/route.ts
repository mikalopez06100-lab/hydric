import { NextResponse } from "next/server";
import { adminForbidden, requireAdminUser } from "@/lib/admin";
import { uploadContentImage } from "@/lib/content-images";
import { createAdminClient } from "@/lib/supabase/admin";

type RouteParams = { params: { id: string } };

export async function POST(req: Request, { params }: RouteParams) {
  const user = await requireAdminUser();
  if (!user) return adminForbidden();

  const { id } = params;
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const upload = await uploadContentImage("exercises", id, file);
  if ("error" in upload) {
    return NextResponse.json({ error: upload.error }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("exercises")
    .update({ image_url: upload.image_url, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exercise: data, image_url: upload.image_url });
}
