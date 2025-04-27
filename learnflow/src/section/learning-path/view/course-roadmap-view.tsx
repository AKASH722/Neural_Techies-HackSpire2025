"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { Json } from "@/utils/supabase/database";

interface Module {
  id: number;
  subtopic: string;
  time: string;
  shortDescription: string;
  order: number;
  content: Json;
}

interface RoadmapData {
  id: number;
  topicName: string;
  description: string;
  difficulty: string;
  category: string;
  imageUrl?: string;
  modules: Module[];
}

interface CourseRoadmapViewProps {
  roadmapData: RoadmapData;
}

// Simple utility function for class name merging
const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// ModuleNode Component props
interface ModuleNodeProps {
  module: Module;
  index: number;
  isMobile: boolean;
  courseId: string;
}

const ModuleNode: React.FC<ModuleNodeProps> = ({
  module,
  isMobile,
  courseId,
}) => {
  const router = useRouter();

  const handleModuleClick = () => {
    router.push(`/learning-path/${courseId}/module/${module.id}`);
  };

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg p-4 transition-all duration-300",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50",
        "border-2 border-primary shadow-md hover:shadow-xl",
        "bg-white text-gray-900",
        isMobile ? "w-full max-w-xs" : "w-80" // Adjust width based on viewport
      )}
      onClick={handleModuleClick}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-primary">{module.subtopic}</h3>
        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
          {module.time}
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-600">{module.shortDescription}</p>
      {/*{module.quizzes.length > 0 && (*/}
      {/*  <div className="mt-3 text-xs text-primary/80">*/}
      {/*    <span className="flex items-center">*/}
      {/*      <BookOpen className="mr-1 h-3 w-3" />*/}
      {/*      {module.quizzes.length}{" "}*/}
      {/*      {module.quizzes.length === 1 ? "Quiz" : "Quizzes"}*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

// Main Roadmap Component
const CourseRoadmapView: React.FC<CourseRoadmapViewProps> = ({
  roadmapData,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check viewport size on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    // Set initial value
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Simulate API call to get roadmap data based on topic
    setIsLoading(false);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-medium text-gray-700">
            Loading your learning roadmap...
          </h2>
          <p className="mt-2 text-gray-500">
            This may take a moment as we prepare your learning journey.
          </p>
        </div>
      </div>
    );
  }

  if (!roadmapData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">
            Something went wrong
          </h2>
          <p className="mb-4 mt-2 text-gray-500">
            We couldn&#39;t load your learning roadmap. Please try again.
          </p>
          <Button onClick={() => router.push("/learning-paths")}>
            Return to Learning Paths
          </Button>
        </div>
      </div>
    );
  }

  // Extract course ID from the URL or pass as prop
  const courseId = roadmapData.id;
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-12 rounded-lg border-2 border-primary/30 bg-white p-6 text-center shadow-md">
        <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {roadmapData.category || "Course"} •{" "}
          {roadmapData.difficulty || "All Levels"}
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {roadmapData.topicName}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600">
          {roadmapData.description}
        </p>
      </div>
      <div className="relative w-full px-4 py-8">
        <div className="relative flex flex-col items-center">
          {/* Background Curved Path - Only visible on non-mobile */}
          {!isMobile && (
            <div className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 transform">
              <svg
                className="h-full w-16"
                viewBox="0 0 100 800"
                preserveAspectRatio="none"
              >
                {/* Background Path */}
                <path
                  d="M50,0 C60,200 40,400 50,600 C60,800 40,1000 50,1200"
                  className="stroke-gray-200"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Highlight Path */}
                <path
                  d="M50,0 C60,200 40,400 50,600 C60,800 40,1000 50,1200"
                  className="stroke-primary"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          )}

          {/* Straight Line for Mobile */}
          {isMobile && (
            <div className="absolute bottom-0 left-1/2 top-0 w-1 -translate-x-1/2 transform">
              <div className="h-full w-2 rounded-full bg-primary"></div>
            </div>
          )}

          {/* Module Nodes - Centered for mobile, alternating for desktop */}
          <div
            className={cn(
              "relative flex flex-col py-8",
              isMobile ? "items-center gap-16" : "gap-20"
            )}
          >
            {roadmapData.modules.map((module, index) => (
              <div
                key={module.id}
                className={cn(
                  "relative",
                  // On mobile: centered nodes with connector circles
                  isMobile
                    ? "flex flex-col items-center"
                    : // On desktop: alternating left/right nodes
                      `transform ${index % 2 === 0 ? "-translate-x-24" : "translate-x-24"}`
                )}
              >
                {/* Connector circle for mobile view */}
                {isMobile && (
                  <div className="absolute -top-8 h-6 w-6 rounded-full border-4 border-primary/30 bg-primary"></div>
                )}

                {/* Node number for both views */}
                <div
                  className={cn(
                    "absolute z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white",
                    isMobile
                      ? "-top-14"
                      : index % 2 === 0
                        ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                        : "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  )}
                >
                  {index + 1}
                </div>

                <ModuleNode
                  module={module}
                  index={index}
                  isMobile={isMobile}
                  courseId={`${courseId}`}
                />
              </div>
            ))}
          </div>

          {/* Start Learning Button */}
          {roadmapData.modules.length > 0 && (
            <div className="z-30 mt-12">
              <Button
                className="rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                asChild
              >
                <Link
                  href={`/learning-path/${courseId}/module/${roadmapData.modules[0].id}`}
                >
                  Start Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRoadmapView;
