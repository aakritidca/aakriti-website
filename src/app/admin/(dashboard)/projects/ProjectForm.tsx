"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input, Textarea, Select, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ImageUploader, UploadedImage } from "@/components/admin/ImageUploader";
import { saveProject } from "./formActions";

interface CategoryOption {
  id: string;
  name: string;
}

export interface ProjectFormInitialData {
  id?: string;
  title: string;
  slug: string;
  location: string;
  categoryId: string;
  year: number;
  status: "COMPLETED" | "ONGOING" | "UPCOMING";
  description: string;
  additionalInfo: string;
  builtUpArea: string;
  floors: string;
  duration: string;
  published: boolean;
  images: UploadedImage[];
}

const emptyProject: ProjectFormInitialData = {
  title: "",
  slug: "",
  location: "",
  categoryId: "",
  year: new Date().getFullYear(),
  status: "ONGOING",
  description: "",
  additionalInfo: "",
  builtUpArea: "",
  floors: "",
  duration: "",
  published: false,
  images: [],
};

export function ProjectForm({
  categories,
  initialData,
}: {
  categories: CategoryOption[];
  initialData?: ProjectFormInitialData;
}) {
  const router = useRouter();
  const data = initialData ?? emptyProject;

  const [title, setTitle] = useState(data.title);
  const [slug, setSlug] = useState(data.slug);
  const [location, setLocation] = useState(data.location);
  const [categoryId, setCategoryId] = useState(data.categoryId || categories[0]?.id || "");
  const [year, setYear] = useState(String(data.year));
  const [status, setStatus] = useState(data.status);
  const [description, setDescription] = useState(data.description);
  const [additionalInfo, setAdditionalInfo] = useState(data.additionalInfo);
  const [builtUpArea, setBuiltUpArea] = useState(data.builtUpArea);
  const [floors, setFloors] = useState(data.floors);
  const [duration, setDuration] = useState(data.duration);
  const [images, setImages] = useState<UploadedImage[]>(data.images);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(Boolean(data.slug));

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  function handleSave(publish: boolean) {
    setErrors({});
    startTransition(async () => {
      const result = await saveProject(
        data.id ?? null,
        {
          title,
          slug,
          location,
          categoryId,
          year,
          status,
          description,
          additionalInfo,
          builtUpArea,
          floors,
          duration,
        },
        images.map((img) => ({ url: img.url, altText: img.altText, isCover: img.isCover })),
        publish
      );

      if (result.success) {
        toast.success(publish ? "Project published" : "Draft saved");
        router.push("/admin/projects");
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        toast.error("Please fix the errors below.");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <FieldWrap label="Project Name" htmlFor="title" required error={errors.title}>
          <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Patil Residence" />
        </FieldWrap>
        <FieldWrap label="Location" htmlFor="location" required error={errors.location}>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Sirsi, Karnataka" />
        </FieldWrap>
        <FieldWrap label="Category" htmlFor="category" required error={errors.categoryId}>
          <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </FieldWrap>
        <FieldWrap label="Year" htmlFor="year" required error={errors.year}>
          <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Status" htmlFor="status" required>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="COMPLETED">Completed</option>
            <option value="ONGOING">Ongoing</option>
            <option value="UPCOMING">Upcoming</option>
          </Select>
        </FieldWrap>
        <FieldWrap label="URL Slug" htmlFor="slug" hint="/projects/your-slug-here">
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </FieldWrap>
      </div>

      <FieldWrap label="Description" htmlFor="description" required error={errors.description} className="mb-5">
        <Textarea id="description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the project, brief, and scope of work..." />
      </FieldWrap>

      <FieldWrap label="Additional Information" htmlFor="additionalInfo" hint="Optional — material details, design notes, etc." >
        <Textarea id="additionalInfo" rows={3} value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
      </FieldWrap>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-5">
        <FieldWrap label="Built-up Area" htmlFor="builtUpArea" hint="e.g. 3,200 sq. ft.">
          <Input id="builtUpArea" value={builtUpArea} onChange={(e) => setBuiltUpArea(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Floors" htmlFor="floors" hint="e.g. G + 1">
          <Input id="floors" value={floors} onChange={(e) => setFloors(e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Duration" htmlFor="duration" hint="e.g. 8 months">
          <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </FieldWrap>
      </div>

      <div className="mt-8 mb-4">
        <h3 className="text-[14px] font-medium text-stone-900 mb-1">Gallery images</h3>
        <p className="text-[13px] text-stone-500 mb-4">
          The first image (or the one marked cover) is used as the project&apos;s main photo across the site.
        </p>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="flex items-center gap-3 mt-10 pt-6 border-t border-line">
        <Button variant="outline" onClick={() => handleSave(false)} loading={isPending}>
          Save Draft
        </Button>
        <Button variant="dark" onClick={() => handleSave(true)} loading={isPending}>
          Publish
        </Button>
      </div>
    </div>
  );
}
