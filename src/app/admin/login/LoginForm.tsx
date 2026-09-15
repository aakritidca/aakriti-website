"use client";

import { useActionState } from "react";
import { loginAction, LoginState } from "./actions";
import { Input, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <FieldWrap label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" placeholder="you@aakriti.com" required autoFocus />
      </FieldWrap>
      <FieldWrap label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
      </FieldWrap>
      {state.error && (
        <p className="text-sm text-error bg-error-bg px-3.5 py-2.5">{state.error}</p>
      )}
      <Button type="submit" loading={isPending} className="w-full" variant="dark">
        Sign in
      </Button>
    </form>
  );
}
