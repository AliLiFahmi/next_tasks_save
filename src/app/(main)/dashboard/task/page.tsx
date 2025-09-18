"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTasks } from "@/lib/db";
import { Task } from "@/lib/models/data";
import { TaskTable } from "./_components/data-table.task";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Define fetchUserAndTasks using useCallback to memoize it
  const fetchUserAndTasks = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Anda harus login untuk melihat tugas");
        router.push("/auth/v1/login");
        return;
      }

      const data = await getTasks(user.id);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat tugas");
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, router]);

  useEffect(() => {
    // Initial fetch
    fetchUserAndTasks();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setError("Anda telah logout. Silakan login kembali.");
        setTasks([]);
        router.push("/auth/v1/login");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndTasks, supabase.auth, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/v1/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {tasks.length === 0 ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Belum ada tugas</h3>
            <p className="mt-2 text-sm text-gray-600">Tambahkan tugas pertama Anda untuk memulai.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/new-task">Tambah Tugas</Link>
            </Button>
          </div>
        ) : (
          <TaskTable data={tasks} onRefresh={fetchUserAndTasks} />
        )}
      </div>
    </div>
  );
}
