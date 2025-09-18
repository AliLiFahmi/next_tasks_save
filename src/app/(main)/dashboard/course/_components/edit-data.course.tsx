// edit-data.course.tsx
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";

import { Course, CourseSchema } from "@/lib/models/data";
import { updateCourse } from "@/lib/db";

interface CourseEditDrawerProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void; // Add onRefresh prop
}

export function CourseEditDrawer({ course, open, onOpenChange, onRefresh }: CourseEditDrawerProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: course.name,
    lecturer: course.lecturer || "",
    semester: course.semester?.toString() || "",
    sks: course.sks?.toString() || "",
    description: course.description || "",
    category: course.category || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        throw new Error("Nama mata kuliah tidak boleh kosong");
      }
      if (formData.semester && (parseInt(formData.semester) < 1 || parseInt(formData.semester) > 14)) {
        throw new Error("Semester harus antara 1 dan 14");
      }
      if (formData.sks && (parseInt(formData.sks) < 1 || parseInt(formData.sks) > 6)) {
        throw new Error("SKS harus antara 1 dan 6");
      }
      const validCategories = ["Wajib", "Pilihan", "Praktikum", "Tugas Akhir", "KKN", "Magang"];
      if (formData.category && !validCategories.includes(formData.category)) {
        throw new Error("Kategori tidak valid");
      }

      const updates: Partial<Omit<Course, "id" | "user_id" | "created_at">> = {
        name: formData.name,
        lecturer: formData.lecturer || undefined,
        semester: formData.semester ? parseInt(formData.semester) : undefined,
        sks: formData.sks ? parseInt(formData.sks) : undefined,
        description: formData.description || undefined,
        category: formData.category || undefined,
      };

      await updateCourse(course.id, updates);
      toast.success("Mata kuliah berhasil diperbarui");
      onRefresh(); // Call onRefresh after successful update
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui mata kuliah");
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit Mata Kuliah</DrawerTitle>
          <DrawerDescription>Perbarui detail mata kuliah di bawah ini.</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Nama Mata Kuliah</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="lecturer">Dosen</Label>
            <Input id="lecturer" name="lecturer" value={formData.lecturer} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleInputChange}
                min={1}
                max={14}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="sks">SKS</Label>
              <Input
                id="sks"
                name="sks"
                type="number"
                value={formData.sks}
                onChange={handleInputChange}
                min={1}
                max={6}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wajib">Wajib</SelectItem>
                <SelectItem value="Pilihan">Pilihan</SelectItem>
                <SelectItem value="Praktikum">Praktikum</SelectItem>
                <SelectItem value="Tugas Akhir">Tugas Akhir</SelectItem>
                <SelectItem value="KKN">KKN</SelectItem>
                <SelectItem value="Magang">Magang</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
        </form>
        <DrawerFooter>
          <Button type="submit" onClick={handleSubmit}>
            Simpan
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
