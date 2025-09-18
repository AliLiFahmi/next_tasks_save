import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  title?: string;
  message?: string;
}

export default function SuccessMessage({
  title = "Berhasil!",
  message = "Mata kuliah berhasil ditambahkan",
}: SuccessMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white text-center shadow-xl dark:bg-gray-900">
        <CardContent className="pt-8 pb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{message}</p>
          <div className="flex animate-pulse justify-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <div className="h-2 w-2 rounded-full bg-pink-500"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
