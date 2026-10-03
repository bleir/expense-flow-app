"use client";

import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import FormDialog from "./FormDialog";
import { Button } from "./ui/button";
import { apiClient } from "@/lib/apiClient";
import { Input } from "./ui/input";

type AuthUser = { id: string; email: string };

export default function SignInDialog() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <FormDialog
      title="Sign in"
      description="Use your email and password."
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
              const { data } = await apiClient.post<AuthUser>("/auth/signin", {
                email,
                password,
              });
              setUser({ id: data.id, email: data.email });
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
