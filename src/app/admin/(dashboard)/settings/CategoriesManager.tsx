"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createCategory, deleteCategory } from "./actions";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleAdd() {
    if (!newName.trim()) return;
    startTransition(async () => {
      try {
        await createCategory(newName);
        toast.success("Category added");
        setNewName("");
        window.location.reload();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add category");
      }
    });
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    try {
      await deleteCategory(confirmDeleteId);
      setCategories((c) => c.filter((cat) => cat.id !== confirmDeleteId));
      toast.success("Category removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove category");
    }
    setConfirmDeleteId(null);
  }

  return (
    <div className="bg-white border border-line p-7">
      <h2 className="text-[15px] font-medium text-stone-900 mb-1">Project Categories</h2>
      <p className="text-[13px] text-stone-500 mb-5">
        These appear as filter options on the public projects page.
      </p>

      <div className="flex gap-2 mb-6">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Landscaping"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button variant="dark" onClick={handleAdd} loading={isPending}>
          <Plus size={15} /> Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 border border-line px-3.5 py-2 text-[13.5px] text-stone-700"
          >
            {cat.name}
            <button
              onClick={() => setConfirmDeleteId(cat.id)}
              className="text-stone-400 hover:text-error"
              aria-label={`Remove ${cat.name}`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this category?"
        description="Categories in use by existing projects can't be deleted until those projects are reassigned."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
