"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TerminalWindow from "@/app/components/crt/TerminalWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.error) {
      setError("LOGIN.SYS: Invalid email or password");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <TerminalWindow
          title="LOGIN.EXE"
          buttons={["close"]}
          footer={<span>F1=Help &nbsp; ENTER=Submit &nbsp; ESC=Cancel</span>}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="text-base mb-1">
              ▓▒░ Authentication Required ░▒▓
            </div>
            <div className="flex flex-col gap-1">
              <Label className="uppercase text-base text-black">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="uppercase text-base text-black">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-base text-accent-red bg-black px-2 py-0.5 border border-accent-red">
                &gt; {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              [ENTER] Login
            </Button>
          </form>
        </TerminalWindow>
      </div>
    </div>
  );
}
