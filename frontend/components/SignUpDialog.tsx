"use client";

import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";
import FormDialog from "./FormDialog";
import { Button } from "./ui/button";
import { apiClient } from "@/lib/apiClient";
import { Input } from "./ui/input";
import { redirect } from "next/navigation";

type AuthUser = { id: string; email: string };

export default function SignUpDialog() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <FormDialog
      title="Sign up"
      description="Create your account and start using the app"
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
            try {
              const { data } = await apiClient.post<AuthUser>("/auth/signup", {
                email,
                password,
              });
              setUser({ id: data.id, email: data.email });
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive text-center">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit">Sign up</Button>
        </form>
      )}
    </FormDialog>
  );
}
