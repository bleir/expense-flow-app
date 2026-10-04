"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/apiClient";
import WelcomeIllustration from "@/components/WelcomeIllustration";
import { useAuth } from "@/lib/auth";
import FormDialog from "./FormDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AuthResponse = {
  accessToken: string;
  user: { id: string; email: string };
};

export default function SignUpDialog() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <FormDialog
      title="Create your account"
      description="Start tracking income, spending, and balance."
      align="center"
      leading={<WelcomeIllustration className="size-28" />}
      trigger={
        <Button variant="secondary" className="mx-1">
          Sign up
        </Button>
      }
    >
      {({ onSuccess }) => (
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (password.length < 8) {
              setPasswordTooShort(true);
              return;
            }
            setPasswordTooShort(false);
            try {
              const { data } = await apiClient.post<AuthResponse>("/auth/signup", {
                email,
                password,
              });
              setUser({
                id: data.user.id,
                email: data.user.email,
                accessToken: data.accessToken,
              });
              toast.success("Account created");
              onSuccess();
              redirect("/dashboard");
            } catch (error) {
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : "Account creation false. Try again later",
              );
            }
          }}
        >
          <Input
            type="email"
            aria-label="Email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            aria-label="Password"
            placeholder="Password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={passwordTooShort || undefined}
            required
          />
          {passwordTooShort ? (
            <p role="alert" className="mx-2 text-xs text-destructive">
              Password must container with at least 8 characters.
            </p>
          ) : null}

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive text-center">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" variant="primary">
            Create account
          </Button>
        </form>
      )}
    </FormDialog>
  );
}
