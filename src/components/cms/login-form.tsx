
"use client";

import { useActionState } from "react";

import {
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { loginAction } from "@/app/admin/actions";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState(
    loginAction,
    { error: "" }
  );

  return (
    <div className="cms-shell flex min-h-svh items-center justify-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-secondary">
            <LockKeyhole size={21} />
          </div>

          <CardTitle className="text-2xl">
            CitraLand CMS
          </CardTitle>

          <CardDescription>
            Masuk untuk mengelola konten situs.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={action}
            className="space-y-5"
          >
            {/* USERNAME */}

            <div className="space-y-2">
              <Label htmlFor="username">
                Username
              </Label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username"
                  className="pl-10"
                  required
                  autoFocus
                  disabled={pending}
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className="pl-10"
                  required
                  disabled={pending}
                />
              </div>
            </div>

            {/* ERROR */}

            {state.error && (
              <p
                className="text-sm text-destructive"
                role="alert"
              >
                {state.error}
              </p>
            )}

            {/* SUBMIT */}

            <Button
              type="submit"
              className="w-full"
              disabled={pending}
            >
              {pending
                ? "Memeriksa..."
                : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
