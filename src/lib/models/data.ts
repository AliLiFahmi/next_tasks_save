import { z } from "zod";

export interface Course {
  id: string;
  user_id: string;
  name: string;
  lecturer?: string;
  semester?: number;
  sks?: number;
  description?: string;
  category?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description?: string;
  deadline: string;
  status?: "pending" | "in-progress" | "done";
  created_at: string;
  updated_at?: string;
  course_name?: string;
}

export const CourseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  lecturer: z.string().optional(),
  semester: z.number().optional(),
  sks: z.number().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string(),
});

export const TaskSchema = z.object({
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
