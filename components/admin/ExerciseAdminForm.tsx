"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminField,
  AdminImageUpload,
  inputClass,
} from "@/components/admin/AdminImageUpload";
import { EXERCISE_CATEGORIES, EXERCISE_CATEGORY_LABELS } from "@/lib/exercise-categories";
import type { Exercise, ExerciseCategory, ExerciseIntensity } from "@/types";

type Step = { step: number; text: string };

const emptyStep = (n: number): Step => ({ step: n, text: "" });

export function ExerciseAdminForm({
  exercise,
  isNew,
}: {
  exercise?: Exercise & { image_url?: string };
  isNew?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(exercise?.title ?? "");
  const [description, setDescription] = useState(exercise?.description ?? "");
  const [category, setCategory] = useState<ExerciseCategory>(
    exercise?.category ?? "cardio"
  );
  const [intensity, setIntensity] = useState<ExerciseIntensity>(
    exercise?.intensity ?? "douce"
  );
  const [durationMin, setDurationMin] = useState(
    exercise?.duration_min != null ? String(exercise.duration_min) : "15"
  );
  const [emoji, setEmoji] = useState(exercise?.emoji ?? "🏃");
  const [tags, setTags] = useState((exercise?.tags ?? []).join(", "));
  const [steps, setSteps] = useState<Step[]>(
    exercise?.steps?.length ? exercise.steps : [emptyStep(1)]
  );
  const [published, setPublished] = useState(exercise?.published ?? true);
  const [imageUrl, setImageUrl] = useState(exercise?.image_url ?? "");
  const [exerciseId, setExerciseId] = useState(exercise?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      intensity,
      duration_min: parseInt(durationMin, 10) || 15,
      emoji: emoji.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      steps: steps
        .filter((s) => s.text.trim())
        .map((s, i) => ({ step: i + 1, text: s.text.trim() })),
      published,
    };

    const url = isNew
      ? "/api/admin/exercises"
      : `/api/admin/exercises/${exerciseId}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? "Enregistrement impossible");
      return;
    }

    const data = (await res.json()) as { exercise: { id: string } };
    if (isNew) {
      setExerciseId(data.exercise.id);
      router.replace(`/admin/exercises/${data.exercise.id}`);
    }
    setMessage("Exercice enregistré.");
  }

  const uploadUrl =
    exerciseId || exercise?.id
      ? `/api/admin/exercises/${exerciseId || exercise?.id}/image`
      : null;

  return (
    <div className="space-y-4">
      {uploadUrl && (
        <AdminImageUpload
          imageUrl={imageUrl}
          uploadUrl={uploadUrl}
          label="Image de l'exercice"
          onUploaded={setImageUrl}
        />
      )}
      {!uploadUrl && isNew && (
        <p className="text-xs text-ink-soft">
          Enregistrez l&apos;exercice une première fois pour ajouter une image.
        </p>
      )}

      <AdminField label="Titre">
        <input
          className={inputClass()}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </AdminField>

      <AdminField label="Description">
        <textarea
          className={inputClass()}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </AdminField>

      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Catégorie">
          <select
            className={inputClass()}
            value={category}
            onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
          >
            {EXERCISE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EXERCISE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Intensité">
          <select
            className={inputClass()}
            value={intensity}
            onChange={(e) =>
              setIntensity(e.target.value as ExerciseIntensity)
            }
          >
            <option value="douce">Douce</option>
            <option value="moderee">Modérée</option>
          </select>
        </AdminField>
        <AdminField label="Durée (min)">
          <input
            type="number"
            className={inputClass()}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
          />
        </AdminField>
        <AdminField label="Emoji (si pas d'image)">
          <input
            className={inputClass()}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
        </AdminField>
      </div>

      <AdminField label="Tags (séparés par des virgules)">
        <input
          className={inputClass()}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </AdminField>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publié (visible dans l&apos;app)
      </label>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Déroulement
          </h3>
          <button
            type="button"
            className="text-xs text-sage-deep"
            onClick={() =>
              setSteps((list) => [...list, emptyStep(list.length + 1)])
            }
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <textarea
              key={idx}
              rows={2}
              placeholder={`Étape ${idx + 1}`}
              className={inputClass()}
              value={step.text}
              onChange={(e) => {
                const next = [...steps];
                next[idx] = { step: idx + 1, text: e.target.value };
                setSteps(next);
              }}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => void save()}
        disabled={saving || !title.trim() || !description.trim()}
        className="btn-sage w-full py-3 font-mono text-[11px] uppercase tracking-wider"
      >
        {saving ? "Enregistrement…" : "Enregistrer l'exercice"}
      </button>
      {message && (
        <p className="text-center text-xs text-ink-mid">{message}</p>
      )}
    </div>
  );
}
