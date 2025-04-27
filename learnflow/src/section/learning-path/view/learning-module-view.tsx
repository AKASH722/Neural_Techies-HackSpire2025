// app/modules/[id]/learning-module-view.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileCheck,
  Play,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Define types for our data structure
interface Section {
  title: string;
  content: string;
  codeExample?: string;
  explanation?: string;
}

interface VideoContent {
  title: string;
  url: string;
  duration: string;
  thumbnail?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  moduleIndex: number;
  sections: Section[];
  video?: VideoContent;
  quiz: QuizQuestion[];
}

interface CourseModule {
  id: number;
  subtopic: string;
  time: string;
  shortDescription: string;
  isActive?: boolean;
}

interface LearningModuleViewProps {
  module: Module;
  allModules: CourseModule[];
}

// Custom color style for #6e56cf
const customStyle = {
  primaryBg: "bg-[#6e56cf]",
  primaryText: "text-[#6e56cf]",
  primaryBorder: "border-[#6e56cf]",
  primaryHover: "hover:bg-[#6e56cf]",
  primaryLightBg: "bg-[#eeebf9]",
};

const LearningModuleView: React.FC<LearningModuleViewProps> = ({
  module,
  allModules,
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [moduleProgress, setModuleProgress] = useState(0);

  // Find current module index
  const currentModuleIndex = allModules.findIndex((m) => m.id === module.id);

  // Simulating progress updates
  useEffect(() => {
    if (activeTab === "content") {
      // Simulate tracking content consumption
      const timer = setTimeout(() => {
        setModuleProgress((prev) => Math.min(prev + 10, 70));
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (quizSubmitted) {
      setModuleProgress(100);
    }
  }, [activeTab, quizSubmitted]);

  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  // Submit quiz
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  // Calculate quiz score
  const calculateScore = () => {
    if (!quizSubmitted || module.quiz.length === 0) return 0;

    let correctCount = 0;
    selectedAnswers.forEach((answer, index) => {
      if (
        index < module.quiz.length &&
        answer === module.quiz[index].correctAnswer
      ) {
        correctCount++;
      }
    });

    return (correctCount / module.quiz.length) * 100;
  };

  // Navigate to next module
  const goToNextModule = () => {
    if (currentModuleIndex < allModules.length - 1) {
      const nextModule = allModules[currentModuleIndex + 1];
      window.location.href = `/modules/${nextModule.id}`;
    }
  };

  // Navigate to previous module
  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      const prevModule = allModules[currentModuleIndex - 1];
      window.location.href = `/modules/${prevModule.id}`;
    }
  };

  return (
    <div className="flex flex-col overflow-hidden md:flex-row">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-4 md:mr-72 md:pt-0">
        <div className="mx-auto max-w-4xl md:p-4">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Module Progress
              </span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {moduleProgress}%
              </span>
            </div>
            <Progress value={moduleProgress} className="h-2" />
          </div>

          {/* Content/Quiz Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Learn</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Quiz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-2 space-y-8">
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                <h1 className="mb-3 text-2xl font-bold md:text-3xl">
                  {module.title}
                </h1>
                <p className="mb-8 text-gray-700 dark:text-gray-300">
                  {module.description}
                </p>

                {/* Video Section */}
                {module.video && (
                  <div className="mb-8">
                    <div className="group relative mb-4 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                      <img
                        src={module.video.thumbnail}
                        alt={module.video.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-90 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-16 w-16 rounded-full border-0 bg-white/20 backdrop-blur-sm"
                          onClick={() => {
                            if (module.video?.url && module.video.url !== "#") {
                              window.open(module.video.url, "_blank");
                            }
                          }}
                        >
                          <Play className="h-8 w-8 text-white" fill="white" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 right-3 rounded bg-black bg-opacity-70 px-2 py-1 text-sm text-white">
                        {module.video.duration}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">
                      {module.video.title}
                    </h3>
                  </div>
                )}

                {/* Content Sections */}
                {module.sections.map((section, index) => (
                  <div key={index} className="mb-10">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      {section.title}
                    </h2>
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                      {section.content}
                    </p>

                    {/* Code Example */}
                    {section.codeExample && (
                      <div className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-white">
                        <pre>{section.codeExample}</pre>
                      </div>
                    )}

                    {section.explanation && (
                      <p className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 text-gray-700 dark:bg-blue-900/30 dark:text-gray-300">
                        {section.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="mt-2">
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-bold">Module Quiz</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your knowledge of {module.title} with this short quiz
                  </p>
                </div>

                {module.quiz.length > 0 ? (
                  module.quiz.map((q, qIndex) => (
                    <div key={qIndex} className="mb-8">
                      <h3 className="mb-3 text-lg font-medium">
                        {qIndex + 1}. {q.question}
                      </h3>
                      <div className="space-y-2">
                        {q.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`cursor-pointer rounded-lg border p-3 transition-all ${
                              selectedAnswers[qIndex] === oIndex
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                                : "border-gray-200 hover:border-purple-200 dark:border-gray-700 dark:hover:border-purple-800"
                            } ${
                              quizSubmitted && oIndex === q.correctAnswer
                                ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                                : ""
                            } ${
                              quizSubmitted &&
                              selectedAnswers[qIndex] === oIndex &&
                              oIndex !== q.correctAnswer
                                ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                                : ""
                            } `}
                            onClick={() => handleAnswerSelect(qIndex, oIndex)}
                          >
                            <div className="flex items-center">
                              <div
                                className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full ${
                                  selectedAnswers[qIndex] === oIndex
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700"
                                } ${
                                  quizSubmitted && oIndex === q.correctAnswer
                                    ? "bg-green-500 text-white"
                                    : ""
                                } ${
                                  quizSubmitted &&
                                  selectedAnswers[qIndex] === oIndex &&
                                  oIndex !== q.correctAnswer
                                    ? "bg-red-500 text-white"
                                    : ""
                                } `}
                              >
                                <span className="text-xs">
                                  {String.fromCharCode(65 + oIndex)}
                                </span>
                              </div>
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {quizSubmitted &&
                        selectedAnswers[qIndex] !== q.correctAnswer && (
                          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                            The correct answer is{" "}
                            {String.fromCharCode(65 + q.correctAnswer)}:{" "}
                            {q.options[q.correctAnswer]}
                            {q.explanation && (
                              <div className="mt-1">{q.explanation}</div>
                            )}
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No quiz questions are available for this module yet.
                  </div>
                )}

                {module.quiz.length > 0 && !quizSubmitted ? (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswers.length < module.quiz.length}
                    className="mt-4 w-full"
                  >
                    Submit Quiz
                  </Button>
                ) : module.quiz.length > 0 && quizSubmitted ? (
                  <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-bold">Quiz Results</h3>
                    <div className="flex items-center justify-between">
                      <p>Your score:</p>
                      <p
                        className={`font-bold ${
                          calculateScore() >= 70
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {calculateScore().toFixed(0)}%
                      </p>
                    </div>
                    {calculateScore() >= 70 ? (
                      <p className="mt-2 text-green-600 dark:text-green-400">
                        Congratulations! You&#39;ve passed this module&#39;s
                        quiz.
                      </p>
                    ) : (
                      <p className="mt-2 text-red-600 dark:text-red-400">
                        You&#39;ll need to score at least 70% to pass. Try
                        reviewing the content and attempt the quiz again.
                      </p>
                    )}

                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveTab("content");
                          setQuizSubmitted(false);
                          setSelectedAnswers([]);
                        }}
                      >
                        Review Content
                      </Button>
                      {calculateScore() >= 70 &&
                        currentModuleIndex < allModules.length - 1 && (
                          <Button onClick={goToNextModule}>Next Module</Button>
                        )}
                    </div>
                  </div>
                ) : null}
              </div>
            </TabsContent>
          </Tabs>

          {/* Mobile Navigation Controls */}
          <div className="mb-4 mt-8 flex justify-between md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousModule}
              disabled={currentModuleIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextModule}
              disabled={
                currentModuleIndex === allModules.length - 1 ||
                moduleProgress < 100
              }
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Desktop Sidebar - Fixed position */}
      <div className="fixed bottom-4 right-4 top-[4rem] hidden w-72 overflow-hidden rounded-2xl bg-white shadow-lg md:flex md:flex-col">
        {/* Scrollable navigation content */}
        {/* Fixed header */}
        <div className={`${customStyle.primaryBg} p-4 text-white`}>
          <h1 className="text-xl font-bold">{module.courseName}</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul>
            {allModules.map((moduleItem, index) => (
              <li
                key={index}
                className={cn(
                  "border-l-4",
                  moduleItem.isActive
                    ? `${customStyle.primaryBorder} ${customStyle.primaryLightBg}`
                    : "border-transparent hover:bg-gray-100"
                )}
              >
                <Link
                  href={`/modules/${moduleItem.id}`}
                  className="flex w-full items-start px-4 py-3 text-left"
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-3 flex h-8 w-8 items-center justify-center rounded-full text-white",
                        customStyle.primaryBg
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">
                        {moduleItem.subtopic.split(":")[0]}
                      </div>
                      <div className="text-sm text-gray-500">
                        {moduleItem.time}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LearningModuleView;
