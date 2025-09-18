"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Course } from "@/lib/models/data";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { withDndColumn } from "@/components/data-table/table-utils";

import { courseColumns } from "./columns.course";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const CourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  lecturer: z.string().optional(),
  semester: z.number().optional(),
  sks: z.number().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export function CourseTable({ data: initialData, onRefresh }: { data: z.infer<typeof CourseSchema>[] }) {
  const [data, setData] = React.useState(() => initialData);
  const columns = withDndColumn(courseColumns(onRefresh)); // Pass onRefresh to courseColumns
  const table = useDataTableInstance({ data, columns, getRowId: (row) => row.id.toString() });
  const router = useRouter();

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold">Daftar Mata Kuliah</h2>
        </div>
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/new-course">
              <Plus />
              <span className="hidden lg:inline">Tambah Mata Kuliah</span>
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
    </Tabs>
  );
}
