import { ExerciseAdminForm } from "@/components/admin/ExerciseAdminForm";

export default function AdminNewExercisePage() {
  return (
    <div>
      <h1 className="mb-4 font-serif text-2xl text-ink">Nouvel exercice</h1>
      <ExerciseAdminForm isNew />
    </div>
  );
}
