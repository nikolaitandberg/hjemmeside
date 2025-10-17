"use client";
import { signOut } from "next-auth/react";
import Button from "@/app/components/Button";

export default function LogoutButton() {
  return (
    <Button variant="danger" onClick={() => signOut({ callbackUrl: "/" })}>
      Logout
    </Button>
  );
}
