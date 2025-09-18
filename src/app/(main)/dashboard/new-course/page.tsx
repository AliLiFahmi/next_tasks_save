"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addCourse } from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

// Import komponen UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookOpen, User, Calendar, Sparkles, CheckCircle2, Clock, Users, Target } from "lucide-react";
import SuccessMessage from "@/components/addition/SuccessMessage";

export default function NewCoursePage() {
  const [formData, setFormData] = useState({
    name: "",
    lecturer: "",
    semester: "",
    description: "",
    credits: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  const categories = ["Wajib", "Pilihan", "Praktikum", "Tugas Akhir", "KKN", "Magang"];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Anda harus login untuk menambahkan course");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Nama mata kuliah wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const courseData = {
        name: formData.name.trim(),
        lecturer: formData.lecturer.trim() || undefined,
        semester: formData.semester ? Number(formData.semester) : undefined,
        sks: formData.credits ? Number(formData.credits) : undefined,
        description: formData.description.trim() || undefined,
        category: formData.category || undefined,
      };

      await addCourse(
        user.id,
        courseData.name,
        courseData.lecturer,
        courseData.semester,
        courseData.sks,
        courseData.description,
        courseData.category,
      );

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/course");
        router.refresh();
      }, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan course");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <SuccessMessage title="Success!" message="Mata kuliah berhasil ditambahkan" />;
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
                  Tambah Mata Kuliah Baru
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Isi semua informasi yang diperlukan. Field bertanda * wajib diisi.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Nama Mata Kuliah */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="flex items-center text-base font-semibold">
                      <Target className="mr-2 h-4 w-4 text-blue-500" />
                      Nama Mata Kuliah <span className="ml-1 text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="contoh: Pemrograman Web Lanjut"
                      autoComplete="off"
                      className="h-12 border-2 border-gray-200 text-base transition-colors duration-200 focus:border-blue-500"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Nama Dosen */}
                  <div className="space-y-3">
                    <Label htmlFor="lecturer" className="flex items-center text-base font-semibold">
                      <User className="mr-2 h-4 w-4 text-green-500" />
                      Nama Dosen
                    </Label>
                    <Input
                      id="lecturer"
                      value={formData.lecturer}
                      onChange={(e) => handleChange("lecturer", e.target.value)}
                      placeholder="contoh: Dr. Ahmad Fauzi, M.Kom"
                      autoComplete="off"
                      className="h-12 border-2 border-gray-200 text-base transition-colors duration-200 focus:border-green-500"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Semester */}
                    <div className="space-y-3">
                      <Label htmlFor="semester" className="flex items-center text-base font-semibold">
                        <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                        Semester
                      </Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) => handleChange("semester", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 text-base focus:border-purple-500">
                          <SelectValue placeholder="Pilih semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()} className="text-base">
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SKS */}
                    <div className="space-y-3">
                      <Label htmlFor="credits" className="flex items-center text-base font-semibold">
                        <Clock className="mr-2 h-4 w-4 text-orange-500" />
                        SKS
                      </Label>
                      <Select
                        value={formData.credits}
                        onValueChange={(value) => handleChange("credits", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 text-base focus:border-orange-500">
                          <SelectValue placeholder="Pilih SKS" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 6].map((credit) => (
                            <SelectItem key={credit} value={credit.toString()} className="text-base">
                              {credit} SKS
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Kategori */}
                  <div className="space-y-3">
                    <Label htmlFor="category" className="flex items-center text-base font-semibold">
                      <Users className="mr-2 h-4 w-4 text-indigo-500" />
                      Kategori Mata Kuliah
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                      disabled={loading}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 text-base focus:border-indigo-500">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-base">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Deskripsi Mata Kuliah
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Deskripsi singkat tentang mata kuliah ini..."
                      className="min-h-24 resize-none border-2 border-gray-200 text-base transition-colors duration-200 focus:border-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading || !formData.name.trim()}
                      className="h-12 flex-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Tambah Mata Kuliah
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
                  <p className="text-sm">Gunakan nama mata kuliah yang jelas dan deskriptif</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">Sertakan gelar lengkap dosen pengampu</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-purple-500"></div>
                  <p className="text-sm">Pilih semester sesuai kurikulum</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500"></div>
                  <p className="text-sm">Tambahkan deskripsi untuk referensi di masa depan</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-blue-500" />
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Pengingat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Data yang Anda masukkan akan tersimpan dan dapat diedit kapan saja melalui halaman daftar mata
                    kuliah.
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
