"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input, Textarea, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateCompanyContent } from "./actions";
import type { CompanyContent } from "@prisma/client";

export function CompanyForm({ content }: { content: CompanyContent }) {
  const [form, setForm] = useState({
    companyName: content.companyName,
    tagline: content.tagline,
    heroHeadline: content.heroHeadline,
    heroSubtext: content.heroSubtext,
    about: content.about,
    mission: content.mission,
    vision: content.vision,
    values: content.values,
    yearsExperience: content.yearsExperience,
    projectsCompleted: content.projectsCompleted,
    address: content.address,
    phone: content.phone,
    email: content.email,
    instagramHandle: content.instagramHandle,
    businessHours: content.businessHours,
    mapEmbedUrl: content.mapEmbedUrl ?? "",
  });
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateCompanyContent(form);
        toast.success("Company information updated");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-10">
      <Section title="Basics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FieldWrap label="Company Name" htmlFor="companyName">
            <Input id="companyName" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Tagline" htmlFor="tagline">
            <Input id="tagline" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </FieldWrap>
        </div>
      </Section>

      <Section title="Homepage hero">
        <FieldWrap label="Hero Headline" htmlFor="heroHeadline" hint="Use a new line for each line break in the display headline" className="mb-5">
          <Textarea id="heroHeadline" rows={2} value={form.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Hero Subtext" htmlFor="heroSubtext">
          <Textarea id="heroSubtext" rows={2} value={form.heroSubtext} onChange={(e) => set("heroSubtext", e.target.value)} />
        </FieldWrap>
      </Section>

      <Section title="About page">
        <FieldWrap label="About" htmlFor="about" className="mb-5">
          <Textarea id="about" rows={4} value={form.about} onChange={(e) => set("about", e.target.value)} />
        </FieldWrap>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FieldWrap label="Mission" htmlFor="mission">
            <Textarea id="mission" rows={3} value={form.mission} onChange={(e) => set("mission", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Vision" htmlFor="vision">
            <Textarea id="vision" rows={3} value={form.vision} onChange={(e) => set("vision", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Values" htmlFor="values">
            <Textarea id="values" rows={3} value={form.values} onChange={(e) => set("values", e.target.value)} />
          </FieldWrap>
        </div>
      </Section>

      <Section title="Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FieldWrap label="Years Experience" htmlFor="yearsExperience">
            <Input id="yearsExperience" type="number" value={form.yearsExperience} onChange={(e) => set("yearsExperience", Number(e.target.value))} />
          </FieldWrap>
          <FieldWrap label="Projects Completed" htmlFor="projectsCompleted">
            <Input id="projectsCompleted" type="number" value={form.projectsCompleted} onChange={(e) => set("projectsCompleted", Number(e.target.value))} />
          </FieldWrap>
        </div>
      </Section>

      <Section title="Contact information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <FieldWrap label="Phone" htmlFor="phone">
            <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Email" htmlFor="email">
            <Input id="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Instagram Handle" htmlFor="instagramHandle" hint="Without the @">
            <Input id="instagramHandle" value={form.instagramHandle} onChange={(e) => set("instagramHandle", e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Business Hours" htmlFor="businessHours">
            <Input id="businessHours" value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} />
          </FieldWrap>
        </div>
        <FieldWrap label="Address" htmlFor="address" className="mb-5">
          <Textarea id="address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
        </FieldWrap>
        <FieldWrap label="Google Maps Embed URL" htmlFor="mapEmbedUrl" hint="Optional — paste the src URL from Google Maps' Embed a map option">
          <Input id="mapEmbedUrl" value={form.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} />
        </FieldWrap>
      </Section>

      <div className="pt-4 border-t border-line">
        <Button variant="dark" onClick={handleSave} loading={isPending}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line p-7">
      <h2 className="text-[15px] font-medium text-stone-900 mb-5">{title}</h2>
      {children}
    </div>
  );
}
