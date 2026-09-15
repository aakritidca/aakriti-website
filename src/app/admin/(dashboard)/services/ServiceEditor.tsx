"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, Textarea, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { saveService } from "./actions";

export interface ServiceEditData {
  id?: string;
  title: string;
  description: string;
  image: string;
}

export function ServiceEditor({
  initial,
  onDone,
  onCancel,
}: {
  initial: ServiceEditData;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [image, setImage] = useState(initial.image);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await saveService(initial.id ?? null, { title, description, image });
      if (result.success) {
        toast.success(initial.id ? "Service updated" : "Service added");
        onDone();
      } else {
        setErrors(result.fieldErrors ?? {});
        toast.error("Please fix the errors below.");
      }
    });
  }

  return (
    <div className="bg-stone-50 border border-line p-6 space-y-4">
      <FieldWrap label="Title" htmlFor="s-title" required error={errors.title}>
        <Input id="s-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Description" htmlFor="s-desc" required error={errors.description}>
        <Textarea id="s-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </FieldWrap>
      <FieldWrap label="Image URL" htmlFor="s-image" hint="Optional — paste an uploaded image URL">
        <Input id="s-image" value={image} onChange={(e) => setImage(e.target.value)} />
      </FieldWrap>
      <div className="flex gap-3 pt-2">
        <Button size="sm" variant="dark" onClick={handleSave} loading={isPending}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
