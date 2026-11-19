"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProfileImagePanel({
  initialVersion,
}: {
  initialVersion: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState(initialVersion);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/profile-image", { method: "POST", body });
    if (res.ok) {
      const { updatedAt } = await res.json();
      setVersion(updatedAt);
    } else {
      const { error: msg } = await res.json().catch(() => ({}));
      setError(msg ?? "Upload failed");
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function reset() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/profile-image", { method: "DELETE" });
    if (res.ok) setVersion(0);
    else setError("Reset failed");
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4 max-w-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/profile-image?v=${version}`}
        alt="Current profile"
        className="w-full h-auto border border-foreground/40"
        style={{ imageRendering: "pixelated" }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      <div className="flex gap-2">
        <Button disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? "Working..." : "Upload new picture"}
        </Button>
        <Button variant="outline" disabled={busy} onClick={reset}>
          Reset to default
        </Button>
      </div>
      {error && <p className="text-base text-accent-yellow">ERROR: {error}</p>}
      <p className="text-sm text-dim">JPEG, PNG, WebP or GIF. Max 5 MB.</p>
    </div>
  );
}
