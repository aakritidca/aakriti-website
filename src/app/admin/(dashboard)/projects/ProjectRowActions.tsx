"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreVertical, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { togglePublish, deleteProject } from "./actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function ProjectRowActions({
  projectId,
  published,
}: {
  projectId: string;
  published: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish() {
    setOpen(false);
    startTransition(async () => {
      try {
        await togglePublish(projectId);
        toast.success(published ? "Project unpublished" : "Project published");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteProject(projectId);
        toast.success("Project deleted");
      } catch {
        toast.error("Failed to delete project.");
      }
    });
    setConfirmOpen(false);
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className="p-1.5 hover:bg-stone-100 text-stone-600"
        aria-label="Project actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-white border border-line shadow-lg z-20 text-left">
            <Link
              href={`/admin/projects/${projectId}/edit`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-stone-700 hover:bg-stone-50"
            >
              <Pencil size={14} /> Edit
            </Link>
            <button
              onClick={handleTogglePublish}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-stone-700 hover:bg-stone-50 w-full text-left"
            >
              {published ? <EyeOff size={14} /> : <Eye size={14} />}
              {published ? "Unpublish" : "Publish"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-error hover:bg-error-bg w-full text-left"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this project?"
        description="This will permanently remove the project and all its gallery images. This cannot be undone."
        confirmLabel="Delete project"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
