"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();

  const handleSignout = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh(); // re-run the server session check so the page shows the guest state
          toast.success("Successfully signed out");
        },
        onError: () => {
          toast.error("Error signing out. Please try again.");
        },
      },
    });
  };

  return handleSignout;
}
