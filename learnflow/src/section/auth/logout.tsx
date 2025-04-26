"use client";

import { LogOut } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "@/section/auth/actions";
import { toast } from "sonner";

export default function Logout(props: ButtonProps) {
  const router = useRouter();
  return (
    <Button
      {...props}
      onClick={async () => {
        const { error } = await logout();
        if (error) {
          toast.error(error);
        } else {
          router.push("/auth/login");
        }
      }}
    >
      Logout
      <LogOut/>
    </Button>
  );
}
