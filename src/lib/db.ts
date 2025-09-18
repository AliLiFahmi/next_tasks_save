import { supabase } from "./supabaseClient";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Course, Task } from "@/lib/models/data";

/* ===========================
   AUTHENTICATION
   =========================== */

// Login user
export async function login(email: string, password: string) {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Register user
export async function register(email: string, password: string, fullName?: string) {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/default`,
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

/* ===========================
   COURSES (MATA KULIAH)
   =========================== */

// Get all courses for a user
export async function getCourses(userId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Course[];
}

// Get course by ID
export async function getCourseById(courseId: string): Promise<Course | null> {
  const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).single();
  if (error) {
    if (error.code === "PGRST116") return null; // No rows found
    throw error;
  }
  return data as Course;
}

// Add a course
export async function addCourse(
  userId: string,
  name: string,
  lecturer?: string,
  semester?: number,
  sks?: number,
  description?: string,
  category?: string,
): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .insert([{ user_id: userId, name, lecturer, semester, sks, description, category }])
    .select()
    .single();
  if (error) throw error;
  return data as Course;
}

// Update a course
export async function updateCourse(
  courseId: string,
  updates: Partial<Omit<Course, "id" | "user_id" | "created_at">>,
): Promise<Course> {
  const { data, error } = await supabase.from("courses").update(updates).eq("id", courseId).select().single();
  if (error) throw error;
  return data as Course;
}

// Delete a course
export async function deleteCourse(courseId: string): Promise<boolean> {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw error;
  return true;
}

/* ===========================
   TASKS (TUGAS)
   =========================== */

// Get all tasks for a user with course name
export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, courses(name)")
    .eq("user_id", userId)
    .order("deadline", { ascending: true });
  if (error) throw error;
  return data.map((task) => ({
    ...task,
    course_name: task.courses?.name || null,
  })) as Task[];
}

// Add a task
export async function addTask(
  userId: string,
  courseId: string,
  title: string,
  description: string,
  deadline: string,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ user_id: userId, course_id: courseId, title, description, deadline }])
    .select("*, courses(name)")
    .single();
  if (error) throw error;
  return { ...data, course_name: data.courses?.name || null } as Task;
}

// Update a task
export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, "id" | "user_id" | "course_id" | "created_at" | "updated_at">>,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId)
    .select("*, courses(name)")
    .single();
  if (error) throw error;
  return { ...data, course_name: data.courses?.name || null } as Task;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
  return true;
}
