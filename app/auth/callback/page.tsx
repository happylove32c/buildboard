"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) console.error(error);
      if (session) {
        router.push("/"); // Redirect to projects page after successful login
      } else {
        router.push("/");
      }
    };
    handleAuth();
  }, [router]);

  return <p>Loading...</p>;
}