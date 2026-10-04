"use client";

import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/lib/auth";
import FormDialog from "./FormDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type AuthResponse = {
  accessToken: string;
  user: { id: string; email: string };
};

export default function SignInDialog() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <FormDialog
      title="Welcome back"
      description="Sign in with the email and password for your account."
      leading={
        <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <LogIn className="size-5" />
        </span>
      }
      trigger={
        <Button variant="primary" className="mx-1">
          Sign in
        </Button>
      }
    >
      {({ onSuccess }) => (
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const { data } = await apiClient.post<AuthResponse>("/auth/signin", {
                email,
                password,
              });
              setUser({
                id: data.user.id,
                email: data.user.email,
                accessToken: data.accessToken,
              });
              toast.success("Signed in");
              onSuccess();
            } catch (error) {
              setErrorMessage(
                error instanceof Error ? error.message : "Sign in failed",
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit">Sign in</Button>
        </form>
      )}
    </FormDialog>
  );
}
