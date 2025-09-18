import { Eye } from "lucide-react";
import { Task } from "@/lib/models/data";
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
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Loader } from "lucide-react";

interface TaskDetailDrawerProps {
  task: Task;
  courseName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDrawer({ task, courseName, open, onOpenChange }: TaskDetailDrawerProps) {
  const isMobile = useIsMobile();

  const status = task.status || "pending";
  const variantMap = {
    pending: "outline" as const,
    "in-progress": "secondary" as const,
    done: "default" as const,
  };
  const iconMap = {
    pending: <Loader className="mr-1 h-3 w-3 animate-spin" />,
    "in-progress": <Loader className="mr-1 h-3 w-3" />,
    done: <CircleCheck className="stroke-border mr-1 h-3 w-3 fill-green-500 dark:fill-green-400" />,
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detail Tugas</DrawerTitle>
          <DrawerDescription>Lihat detail tugas di bawah ini.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Judul Tugas</Label>
            <div>{task.title}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Mata Kuliah</Label>
            <div>{courseName || "-"}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Deskripsi</Label>
            <div>{task.description || "-"}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Deadline</Label>
            <div>
              {new Date(task.deadline).toLocaleString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Status</Label>
            <Badge
              variant={variantMap[status as keyof typeof variantMap] || "outline"}
              className="text-muted-foreground w-fit"
            >
              {iconMap[status as keyof typeof iconMap]}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Ditambahkan</Label>
            <div>
              {new Date(task.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label className="font-semibold">Diperbarui</Label>
            <div>
              {task.updated_at
                ? new Date(task.updated_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "-"}
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
