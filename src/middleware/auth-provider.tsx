// components/auth-provider.tsx
"use client";

import { Loading } from "@/components/ui/loading";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  useEffect(() => {
    const publicPaths = ["/auth/v1/login", "/auth/v1/register"];

    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push("/auth/v1/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}
