"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, List, AlertTriangle } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Task } from "@/lib/models/data";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";

import { taskColumns } from "./columns.task";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
});

interface TaskTableProps {
  data: z.infer<typeof TaskSchema>[];
  courseId?: string; // Optional, as it may be used for filtering
  onRefresh: () => void; // Add onRefresh prop
}

export function TaskTable({ data: initialData, courseId, onRefresh }: TaskTableProps) {
  const [data, setData] = React.useState(() => initialData);
  const columns = withDndColumn(taskColumns(onRefresh)); // Pass onRefresh to taskColumns
  const table = useDataTableInstance({ data, columns, getRowId: (row) => row.id.toString() });
  const router = useRouter();

  if (!data.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-12">
        <AlertTriangle className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Belum ada tugas</h3>
        <p className="mt-2 text-sm text-gray-600">Tambahkan tugas pertama Anda untuk mata kuliah ini.</p>
        <Button asChild className="mt-4">
          <Link href={`/dashboard/task/new${courseId ? `?courseId=${courseId}` : ""}`}>Tambah Tugas</Link>
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <List className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Daftar Tugas</h2>
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/new-task${courseId ? `?courseId=${courseId}` : ""}`}>
              <Plus />
              <span className="hidden lg:inline">Tambah Tugas</span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
