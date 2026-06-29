"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function AdminImageUpload({
  imageUrl,
  uploadUrl,
  label,
  onUploaded,
}: {
  imageUrl?: string | null;
  uploadUrl: string;
  label: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(uploadUrl, { method: "POST", body: form });
    setUploading(false);
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Upload impossible");
      return;
    }
    const data = (await res.json()) as { image_url: string };
    setPreview(data.image_url);
    onUploaded(data.image_url);
  }

  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        {label}
      </p>
      <div
        className="relative flex h-40 items-center justify-center overflow-hidden border border-rule bg-bone-deep"
        style={{ borderRadius: 2 }}
      >
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="font-mono text-[10px] text-ink-soft">Aucune image</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-2 w-full border border-rule py-2 font-mono text-[10px] uppercase tracking-wider text-ink-mid"
        style={{ borderRadius: 2 }}
      >
        {uploading ? "Envoi…" : "Choisir une image"}
      </button>
      {error && <p className="mt-1 text-xs text-clay-deep">{error}</p>}
    </div>
  );
}

function inputClass() {
  return "mt-1 w-full border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sage-deep";
}

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

export { inputClass };
