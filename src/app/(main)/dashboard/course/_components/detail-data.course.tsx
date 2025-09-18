import { Eye } from "lucide-react";
import { Course } from "@/lib/models/data";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CourseDetailDrawerProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailDrawer({ course, open, onOpenChange }: CourseDetailDrawerProps) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detail Mata Kuliah</DrawerTitle>
          <DrawerDescription>Lihat detail mata kuliah di bawah ini.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Nama Mata Kuliah</Label>
            <div>{course.name}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Dosen</Label>
            <div>{course.lecturer || "-"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label className="font-semibold">Semester</Label>
              <div>{course.semester ? `Semester ${course.semester}` : "-"}</div>
            </div>
            <div className="flex flex-col gap-3">
              <Label className="font-semibold">SKS</Label>
              <div>{course.sks ? `${course.sks} SKS` : "-"}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Kategori</Label>
            <div>{course.category || "-"}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Deskripsi</Label>
            <div>{course.description || "-"}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Ditambahkan</Label>
            <div>
              {new Date(course.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
