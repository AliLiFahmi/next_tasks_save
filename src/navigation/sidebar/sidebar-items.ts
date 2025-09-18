import {
  Mail,
  MessageSquare,
  Fingerprint,
  LayoutDashboard,
  ChartBar,
  Banknote,
  type LucideIcon,
  BookOpen,
  CheckSquare,
  SquarePen,
  PlusCircle,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 0,
    label: "Quick Actions",
    items: [
      {
        title: "New Course",
        url: "/dashboard/new-course",
        icon: PlusCircle,
        isNew: true,
      },
      {
        title: "New Task",
        url: "/dashboard/new-task",
        icon: SquarePen,
        isNew: true,
      },
    ],
  },
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        title: "Course",
        url: "/dashboard/course",
        icon: BookOpen,
      },
      {
        title: "Task",
        url: "/dashboard/task",
        icon: CheckSquare,
      },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
];
