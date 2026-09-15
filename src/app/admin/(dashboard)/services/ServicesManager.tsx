"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ServiceEditor, ServiceEditData } from "./ServiceEditor";
import { deleteService, toggleServicePublish } from "./actions";
import { Wrench } from "lucide-react";

export interface ServiceListItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  published: boolean;
}

export function ServicesManager({ initialServices }: { initialServices: ServiceListItem[] }) {
  const [services, setServices] = useState(initialServices);
  const [editing, setEditing] = useState<ServiceEditData | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function refresh() {
    // Server component would normally refetch; since this is client-managed,
    // we rely on the parent server page re-render via router.refresh() pattern.
    window.location.reload();
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    try {
      await deleteService(confirmDeleteId);
      setServices((s) => s.filter((svc) => svc.id !== confirmDeleteId));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
    setConfirmDeleteId(null);
  }

  async function handleTogglePublish(id: string) {
    try {
      await toggleServicePublish(id);
      setServices((s) =>
        s.map((svc) => (svc.id === id ? { ...svc, published: !svc.published } : svc))
      );
      toast.success("Service updated");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Services</h1>
        {!adding && (
          <Button variant="dark" onClick={() => setAdding(true)}>
            <Plus size={15} /> Add Service
          </Button>
        )}
      </div>

      {adding && (
        <div className="mb-6">
          <ServiceEditor
            initial={{ title: "", description: "", image: "" }}
            onDone={refresh}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {services.length === 0 && !adding ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Add your first service so it appears on the public website."
          action={<Button variant="dark" onClick={() => setAdding(true)}><Plus size={15}/> Add Service</Button>}
        />
      ) : (
        <div className="space-y-3">
          {services.map((service) =>
            editing?.id === service.id ? (
              <ServiceEditor
                key={service.id}
                initial={{
                  id: service.id,
                  title: service.title,
                  description: service.description,
                  image: service.image ?? "",
                }}
                onDone={refresh}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <div key={service.id} className="bg-white border border-line p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-[15px] font-medium text-stone-900">{service.title}</h3>
                    <Badge variant={service.published ? "success" : "warning"}>
                      {service.published ? "Published" : "Hidden"}
                    </Badge>
                  </div>
                  <p className="text-[13.5px] text-stone-600 line-clamp-2">{service.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTogglePublish(service.id)}
                    className="p-2 text-stone-500 hover:text-stone-900"
                    aria-label={service.published ? "Hide service" : "Show service"}
                  >
                    {service.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() =>
                      setEditing({
                        id: service.id,
                        title: service.title,
                        description: service.description,
                        image: service.image ?? "",
                      })
                    }
                    className="p-2 text-stone-500 hover:text-stone-900"
                    aria-label="Edit service"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(service.id)}
                    className="p-2 text-stone-500 hover:text-error"
                    aria-label="Delete service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete this service?"
        description="This will remove the service from the public website. This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
