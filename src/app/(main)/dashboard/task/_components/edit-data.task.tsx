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

import { Task, TaskSchema } from "@/lib/models/data";
import { updateTask } from "@/lib/db";

interface TaskEditDrawerProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void; // Add onRefresh prop
}

export function TaskEditDrawer({ task, open, onOpenChange, onRefresh }: TaskEditDrawerProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    deadline: new Date(task.deadline).toISOString().slice(0, 16),
    status: task.status || "pending",
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
      if (!formData.title.trim()) {
        throw new Error("Judul tugas tidak boleh kosong");
      }
      if (!formData.deadline) {
        throw new Error("Deadline tidak boleh kosong");
      }
      const validStatuses = ["pending", "in-progress", "done"];
      if (!validStatuses.includes(formData.status)) {
        throw new Error("Status tidak valid");
      }

      const updates: Partial<Omit<Task, "id" | "user_id" | "course_id" | "created_at" | "updated_at">> = {
        title: formData.title,
        description: formData.description || undefined,
        deadline: formData.deadline,
        status: formData.status as "pending" | "in-progress" | "done",
      };

      await updateTask(task.id, updates);
      toast.success("Tugas berhasil diperbarui");
      onRefresh(); // Call onRefresh after successful update
      router.refresh();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui tugas");
    }
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Edit Tugas</DrawerTitle>
          <DrawerDescription>Perbarui detail tugas di bawah ini.</DrawerDescription>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label htmlFor="title">Judul Tugas</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
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
