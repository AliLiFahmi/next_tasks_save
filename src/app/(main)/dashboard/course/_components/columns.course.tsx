import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Calendar, Clock, Users, Edit, List, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
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

import { CourseEditDrawer } from "./edit-data.course";
import { CourseDetailDrawer } from "./detail-data.course";
import { DeleteConfirmationDialog } from "@/components/addition/DeleteConfirmationDialog";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { deleteCourse } from "@/lib/db";
import { Course } from "@/lib/models/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  lecturer: z.string().optional(),
  semester: z.number().optional(),
  sks: z.number().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string(),
});

export const courseColumns = (onRefresh: () => void): ColumnDef<z.infer<typeof CourseSchema>>[] => [
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
    enableHiding: false, // Not hideable
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mata Kuliah" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-3">
          <span className="font-medium">{row.original.name}</span>
        </div>
      );
    },
    enableSorting: true,
    meta: { displayName: "Mata Kuliah" }, // Custom display name for dropdown
  },
  {
    accessorKey: "lecturer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dosen" />,
    cell: ({ row }) => {
      const lecturer = row.original.lecturer || "-";
      return <div className="text-sm font-medium">{lecturer}</div>;
    },
    enableSorting: true,
    meta: { displayName: "Dosen" }, // Custom display name for dropdown
  },
  {
    accessorKey: "semester",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Semester" />,
    cell: ({ row }) => {
      const semester = row.original.semester ? `Semester ${row.original.semester}` : "-";
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3 text-blue-500" />
          {semester}
        </Badge>
      );
    },
    enableSorting: true,
    meta: { displayName: "Semester" }, // Custom display name for dropdown
  },
  {
    accessorKey: "sks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SKS" />,
    cell: ({ row }) => {
      const sks = row.original.sks ? `${row.original.sks} SKS` : "-";
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          <Clock className="mr-1 h-3 w-3 text-yellow-500" />
          {sks}
        </Badge>
      );
    },
    enableSorting: true,
    meta: { displayName: "SKS" }, // Custom display name for dropdown
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
    cell: ({ row }) => {
      const category = row.original.category || "-";
      const variantMap = {
        Wajib: "default" as const,
        Pilihan: "secondary" as const,
        Praktikum: "outline" as const,
        "Tugas Akhir": "destructive" as const,
        KKN: "accent" as const,
        Magang: "secondary" as const,
      };
      return (
        <Badge variant={variantMap[category as keyof typeof variantMap] || "default"}>
          <Users className="mr-1 h-3 w-3" />
          {category}
        </Badge>
      );
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: { displayName: "Kategori" }, // Custom display name for dropdown
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
    cell: ({ row }) => {
      const description = row.original.description || "-";
      return <div className="max-w-[200px] truncate text-sm">{description}</div>;
    },
    enableSorting: false,
    meta: { displayName: "Deskripsi" }, // Custom display name for dropdown
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
    meta: { displayName: "Ditambahkan" }, // Custom display name for dropdown
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const course = row.original as Course;
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
      const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteCourse(course.id);
          toast.success("Mata kuliah berhasil dihapus");
          router.refresh();
          onRefresh();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Gagal menghapus mata kuliah");
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
              <DropdownMenuItem asChild>
                <Link href={`/tasks?courseId=${course.id}`} className="flex items-center">
                  <List className="mr-2 h-4 w-4" />
                  Lihat Tugas
                </Link>
              </DropdownMenuItem>
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
            entityName={course.name}
            entityType="mata kuliah"
            onDelete={handleDelete}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
          <CourseEditDrawer
            course={course}
            open={isEditDrawerOpen}
            onOpenChange={setIsEditDrawerOpen}
            onRefresh={onRefresh}
          />
          <CourseDetailDrawer course={course} open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen} />
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
