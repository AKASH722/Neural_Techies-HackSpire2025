"use client";

import { signInWithGoogle } from "@/section/auth/actions";
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function GoogleAuth({ login = false }) {
  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={async () => {
        const response = await signInWithGoogle();
        if (response?.error) {
          toast.error(response?.message || "Something went wrong");
        }
      }}
    >
      <Icons.google />
      {login ? "Login" : "Signup"} with Google
    </Button>
  );
}
