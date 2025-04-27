"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import OnboardingDialog from "@/section/learning-path/onboarding-dialog";
import CourseCard from "@/section/learning-path/course-card";

// Define TypeScript interface for the course data
interface CourseData {
  id: number;
  title: string;
  type: string;
  difficulty: string;
  chapters: number;
  imageUrl: string | null;
  description: string | null;
}

interface AllLearningPathViewProps {
  userCourses: CourseData[];
}

export default function AllLearningPathView({
  userCourses,
}: AllLearningPathViewProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="h-full">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-sans text-2xl font-bold text-primary">
            My Learning Paths
          </h2>
          <button
            onClick={() => setShowOnboarding(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white transition-colors duration-300 hover:bg-primary/80"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create Learning Path</span>
          </button>
        </div>

        {userCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                type={course.type}
                difficulty={course.difficulty}
                chapters={course.chapters}
                slug={`${course.id}`}
                imageUrl={course.imageUrl}
                description={course.description}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow dark:bg-gray-800">
            <div className="mb-4 text-gray-400">
              <PlusCircle className="h-16 w-16" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-gray-700 dark:text-gray-300">
              No learning paths yet
            </h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Create your first adaptive learning path to get started
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="rounded-md bg-primary px-6 py-2 text-white transition-colors duration-300 hover:bg-primary/80"
            >
              Create Learning Path
            </button>
          </div>
        )}
      </div>

      {/* Onboarding Dialog */}
      {showOnboarding && (
        <OnboardingDialog
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
