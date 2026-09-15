"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Enter a valid email"),
  // An untouched optional input arrives as "", which should be absent, not blank.
  phone: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    }),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message should be at least 10 characters").max(2000),
});

export interface ContactFormState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch (error) {
    console.error("Failed to save contact form submission:", error);
    return {
      success: false,
      error: "Something went wrong sending your message. Please call or email us directly.",
    };
  }

  return { success: true };
}
