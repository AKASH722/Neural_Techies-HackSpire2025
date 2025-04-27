// Proposed CourseCard implementation to match the data structure
import React from "react";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CourseCardProps {
  title: string;
  type: string;
  difficulty: string;
  chapters: number;
  slug: string;
  imageUrl: string | null;
  description: string | null;
}

export default function CourseCard({
  title,
  type,
  difficulty,
  chapters,
  slug,
  imageUrl,
  description,
}: CourseCardProps) {
  const router = useRouter();

  // Determine difficulty badge color
  const difficultyColor =
    {
      Beginner: "bg-green-100 text-green-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Advanced: "bg-red-100 text-red-800",
    }[difficulty] || "bg-blue-100 text-blue-800";

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      onClick={() => router.push(`/learning-path/${slug}`)}
    >
      <div className="relative h-40 w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {type}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColor}`}
          >
            {difficulty}
          </span>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        {description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <BookOpen className="mr-1 h-4 w-4" />
          {chapters} {chapters === 1 ? "Module" : "Modules"}
        </div>
      </div>
    </div>
  );
}
