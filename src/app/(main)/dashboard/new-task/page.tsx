"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addTask } from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Import komponen UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, BookOpen, CheckCircle2, Target, Calendar, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SuccessMessage from "@/components/addition/SuccessMessage";

export default function NewTaskPage() {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    deadline: "",
  });
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Fetch courses for the user
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from("courses").select("id, name").eq("user_id", user.id);
        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        toast.error("Gagal memuat daftar mata kuliah");
      }
    };
    fetchCourses();
  }, [user]);

  // Pre-fill courseId from query parameter if available
  useEffect(() => {
    const courseId = searchParams.get("courseId");
    if (courseId) {
      setFormData((prev) => ({ ...prev, courseId }));
    }
  }, [searchParams]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Anda harus login untuk menambahkan tugas");
      return;
    }

    if (!formData.courseId) {
      toast.error("Mata kuliah wajib dipilih");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Judul tugas wajib diisi");
      return;
    }

    if (!formData.deadline) {
      toast.error("Tanggal deadline wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await addTask(
        user.id,
        formData.courseId,
        formData.title.trim(),
        formData.description.trim() || undefined,
        formData.deadline,
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/task");
        router.refresh();
      }, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan tugas");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessMessage title="Success!" message="Tugas berhasil ditambahkan" />;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center text-2xl">
                  <BookOpen className="mr-3 h-6 w-6 text-blue-500" />
                  Tambah Tugas Baru
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Isi semua informasi yang diperlukan. Field bertanda * wajib diisi.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Mata Kuliah */}
                  <div className="space-y-3">
                    <Label htmlFor="courseId" className="flex items-center text-base font-semibold">
                      <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                      Mata Kuliah <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) => handleChange("courseId", value)}
                      disabled={loading || courses.length === 0}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 text-base focus:border-blue-500">
                        <SelectValue
                          placeholder={courses.length === 0 ? "Tidak ada mata kuliah" : "Pilih mata kuliah"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id} className="text-base">
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Judul Tugas */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="flex items-center text-base font-semibold">
                      <Target className="mr-2 h-4 w-4 text-green-500" />
                      Judul Tugas <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="contoh: Tugas 1 - Analisis Algoritma"
                      autoComplete="off"
                      className="h-12 border-2 border-gray-200 text-base transition-colors duration-200 focus:border-green-500"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Deskripsi Tugas
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Deskripsi singkat tentang tugas ini..."
                      className="min-h-24 resize-none border-2 border-gray-200 text-base transition-colors duration-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Deadline */}
                  <div className="space-y-3">
                    <Label htmlFor="deadline" className="flex items-center text-base font-semibold">
                      <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                      Deadline <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => handleChange("deadline", e.target.value)}
                      className="h-12 border-2 border-gray-200 text-base transition-colors duration-200 focus:border-purple-500"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      className="h-12 flex-1"
                      disabled={loading || !formData.title.trim() || !formData.courseId || !formData.deadline}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Tambah Tugas
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Tips Pengisian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm">Pilih mata kuliah yang relevan dengan tugas</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">Gunakan judul tugas yang jelas dan deskriptif</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-purple-500"></div>
                  <p className="text-sm">Pastikan deadline diisi dengan format tanggal dan waktu yang benar</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500"></div>
                  <p className="text-sm">Tambahkan deskripsi untuk detail tugas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-300">Pengingat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Data tugas yang Anda masukkan akan tersimpan dan dapat diedit kapan saja melalui halaman daftar
                    tugas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
