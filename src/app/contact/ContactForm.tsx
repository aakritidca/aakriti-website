"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { submitContactForm, ContactFormState } from "./actions";
import { Input, Textarea, Select, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const initialState: ContactFormState = { success: false };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success("Message sent — we'll get back to you shortly.");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrap label="Name" htmlFor="name" required error={state.fieldErrors?.name}>
          <Input id="name" name="name" placeholder="Your name" required />
        </FieldWrap>
        <FieldWrap label="Email" htmlFor="email" required error={state.fieldErrors?.email}>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </FieldWrap>
      </div>
      <FieldWrap label="Phone" htmlFor="phone" hint="Optional">
        <Input id="phone" name="phone" type="tel" placeholder="+91 90000 00000" />
      </FieldWrap>
      <FieldWrap label="Subject" htmlFor="subject" required error={state.fieldErrors?.subject}>
        <Select id="subject" name="subject" defaultValue="" required>
          <option value="" disabled>
            Select a subject
          </option>
          <option value="New project inquiry">New project inquiry</option>
          <option value="Renovation">Renovation</option>
          <option value="Interior design">Interior design</option>
          <option value="General question">General question</option>
          <option value="Other">Other</option>
        </Select>
      </FieldWrap>
      <FieldWrap label="Message" htmlFor="message" required error={state.fieldErrors?.message}>
        <Textarea id="message" name="message" rows={5} placeholder="Tell us about your project..." required />
      </FieldWrap>
      <Button type="submit" loading={isPending} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
