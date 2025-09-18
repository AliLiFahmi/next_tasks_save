import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheck,
  Loader,
  EllipsisVertical,
  List,
  Edit,
  Clock,
  Trash2,
  Eye,
  Users,
  BookOpen,
  Hourglass,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Task } from "@/lib/models/data";
import { deleteTask } from "@/lib/db";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteConfirmationDialog } from "@/components/addition/DeleteConfirmationDialog";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TaskEditDrawer } from "./edit-data.task";
import { TaskDetailDrawer } from "./detail-data.task";

const TaskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  course_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  deadline: z.string(),
  status: z.enum(["pending", "in-progress", "done"]).nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  course_name: z.string().nullable(),
});

export const taskColumns = (onRefresh: () => void): ColumnDef<z.infer<typeof TaskSchema>>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Judul Tugas" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <span className="font-medium">{row.original.title}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "course_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mata Kuliah" />,
    cell: ({ row }) => {
      const courseName = row.original.course_name || "-";
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <BookOpen className="mr-1 h-3 w-3 text-blue-500" />
          {courseName}
        </Badge>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const nameA = rowA.original.course_name || "";
      const nameB = rowB.original.course_name || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
    cell: ({ row }) => {
      const description = row.original.description || "-";
      return <div className="max-w-[200px] truncate text-sm">{description}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deadline" />,
    cell: ({ row }) => {
      const deadline = new Date(row.original.deadline).toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="mr-1 h-3 w-3 text-yellow-500" />
          {deadline}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      const variantMap = {
        pending: "outline" as const,
        "in-progress": "secondary" as const,
        done: "default" as const,
      };
      const iconMap = {
        pending: <Hourglass className="mr-1 h-3 w-3 text-yellow-500" />,
        "in-progress": <Loader className="mr-1 h-3 w-3 animate-spin text-blue-500" />,
        done: <CircleCheck className="stroke-border mr-1 h-3 w-3 fill-green-500 dark:fill-green-400" />,
      };
      return (
        <Badge variant={variantMap[status as keyof typeof variantMap] || "outline"} className="text-muted-foreground">
          {iconMap[status as keyof typeof iconMap]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) || "pending");
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ditambahkan" />,
    cell: ({ row }) => {
      const date = new Date(row.original.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="text-muted-foreground text-sm">{date}</div>;
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const task = row.original as Task;
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
      const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteTask(task.id);
          toast.success("Tugas berhasil dihapus");
          router.refresh();
          onRefresh(); // Call onRefresh after deletion
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal menghapus tugas");
        }
      };

      return (
        <>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="data-[state=open]:bg-muted h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setIsDetailDrawerOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsEditDrawerOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="text-destructive focus:text-destructive flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteConfirmationDialog
            entityName={task.title}
            entityType="tugas"
            onDelete={handleDelete}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
          <TaskEditDrawer
            task={task}
            open={isEditDrawerOpen}
            onOpenChange={setIsEditDrawerOpen}
            onRefresh={onRefresh} // Pass onRefresh to TaskEditDrawer
          />
          <TaskDetailDrawer
            task={task}
            courseName={task.course_name}
            open={isDetailDrawerOpen}
            onOpenChange={setIsDetailDrawerOpen}
          />
        </>
      );
    },
    enableSorting: false,
  },
];
