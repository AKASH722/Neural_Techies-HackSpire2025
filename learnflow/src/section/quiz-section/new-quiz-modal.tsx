"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateQuiz } from "./actions";
import { QuizSettings } from "@/section/quiz-section/types";
import { useRouter } from "next/navigation";

interface FormData {
  topicName: string;
  difficultyLevel: string;
  learningGoal: string;
  currentExperience: string;
}

type FocusableField = "topicName" | "difficulty" | "goal" | "experience" | null;

export default function NewQuizModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    topicName: "",
    difficultyLevel: "",
    learningGoal: "",
    currentExperience: "",
  });

  const [focusedField, setFocusedField] = useState<FocusableField>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const totalFields = 4;

  // Calculate progress when form data changes
  React.useEffect(() => {
    let completedFields = 0;
    if (formData.topicName) completedFields++;
    if (formData.difficultyLevel) completedFields++;
    if (formData.learningGoal) completedFields++;
    if (formData.currentExperience) completedFields++;

    const newProgress = Math.floor((completedFields / totalFields) * 100);
    setProgressPercentage(newProgress);
  }, [formData]);

  const handleChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocus = (field: FocusableField): void => {
    setFocusedField(field);
  };

  const handleBlur = (): void => {
    setFocusedField(null);
  };

  // Handle form submission (calling the server action)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create quiz settings
      const quizSettings: QuizSettings = {
        userId: 0,
        name: formData.topicName,
        topic: formData.topicName,
        difficulty: formData.difficultyLevel,
        experience: formData.currentExperience,
        learningGoal: formData.learningGoal,
        questionCount: 10,
      };

      // Call the server action to generate the quiz
      const quizData = await generateQuiz(quizSettings);

      console.log("Generated Quiz:", quizData);
      router.push(`/quiz/${quizData.id}/start`);
      // Handle post-submission (e.g., show results or navigate)
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[425px] md:max-w-[600px]">
        <div className="w-full">
          {/* Progress Bar at the Top */}
          <div className="h-2 w-full rounded-t-full bg-gray-200 dark:bg-slate-700">
            <div
              className="h-full rounded-t-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>

          <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" />
              <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                Customize Your Learning
              </h2>
            </div>

            <div className="mb-4 flex justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete your profile
              </p>
              <p className="text-sm font-medium text-primary">
                {progressPercentage}% complete
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Topic Name */}
                <div
                  className={`group relative rounded-xl border transition-all duration-300 ${
                    focusedField === "topicName"
                      ? "border-primary bg-primary/5 shadow-md"
                      : formData.topicName
                        ? "border-primary/70"
                        : "border-gray-200 dark:border-slate-700"
                  } p-4`}
                >
                  <div className="mb-2 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    <label className="font-medium text-gray-700 dark:text-gray-200">
                      Topic Name
                    </label>
                  </div>
                  <Input
                    value={formData.topicName}
                    onChange={(e) => handleChange("topicName", e.target.value)}
                    onFocus={() => handleFocus("topicName")}
                    onBlur={handleBlur}
                    className="h-11 border-0 bg-transparent text-base focus:ring-0"
                    placeholder="What would you like to learn?"
                    required
                  />
                  {formData.topicName && (
                    <div className="absolute right-4 top-4 text-primary">
                      <Check size={16} />
                    </div>
                  )}
                </div>

                {/* Difficulty */}
                <div
                  className={`group relative rounded-xl border transition-all duration-300 ${
                    focusedField === "difficulty"
                      ? "border-primary bg-primary/5 shadow-md"
                      : formData.difficultyLevel
                        ? "border-primary/70"
                        : "border-gray-200 dark:border-slate-700"
                  } p-4`}
                >
                  <div className="mb-2 flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-primary" />
                    <label className="font-medium text-gray-700 dark:text-gray-200">
                      Preferred Difficulty Level
                    </label>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      handleChange("difficultyLevel", value)
                    }
                    value={formData.difficultyLevel}
                    onOpenChange={(open: boolean) => {
                      if (open) handleFocus("difficulty");
                      else handleBlur();
                    }}
                  >
                    <SelectTrigger className="h-11 border-0 bg-transparent text-base focus:ring-0">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800">
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.difficultyLevel && (
                    <div className="absolute right-4 top-4 text-primary">
                      <Check size={16} />
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div
                  className={`group relative rounded-xl border transition-all duration-300 ${
                    focusedField === "experience"
                      ? "border-primary bg-primary/5 shadow-md"
                      : formData.currentExperience
                        ? "border-primary/70"
                        : "border-gray-200 dark:border-slate-700"
                  } p-4`}
                >
                  <div className="mb-2 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <label className="font-medium text-gray-700 dark:text-gray-200">
                      Current Experience
                    </label>
                  </div>
                  <Select
                    onValueChange={(value) =>
                      handleChange("currentExperience", value)
                    }
                    value={formData.currentExperience}
                    onOpenChange={(open: boolean) => {
                      if (open) handleFocus("experience");
                      else handleBlur();
                    }}
                  >
                    <SelectTrigger className="h-11 border-0 bg-transparent text-base focus:ring-0">
                      <SelectValue placeholder="Your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800">
                      <SelectItem value="less_than_1_month">
                        Less than 1 month
                      </SelectItem>
                      <SelectItem value="1_3_months">1-3 months</SelectItem>
                      <SelectItem value="3_6_months">3-6 months</SelectItem>
                      <SelectItem value="6_12_months">6-12 months</SelectItem>
                      <SelectItem value="more_than_1_year">
                        More than 1 year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.currentExperience && (
                    <div className="absolute right-4 top-4 text-primary">
                      <Check size={16} />
                    </div>
                  )}
                </div>

                {/* Goal */}
                <div
                  className={`group relative rounded-xl border transition-all duration-300 ${
                    focusedField === "goal"
                      ? "border-primary bg-primary/5 shadow-md"
                      : formData.learningGoal
                        ? "border-primary/70"
                        : "border-gray-200 dark:border-slate-700"
                  } p-4`}
                >
                  <div className="mb-2 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-primary" />
                    <label className="font-medium text-gray-700 dark:text-gray-200">
                      Learning Goal
                    </label>
                  </div>
                  <Textarea
                    value={formData.learningGoal}
                    onChange={(e) =>
                      handleChange("learningGoal", e.target.value)
                    }
                    onFocus={() => handleFocus("goal")}
                    onBlur={handleBlur}
                    className="h-20 resize-none border-0 bg-transparent text-base focus:ring-0"
                    placeholder="What do you hope to achieve?"
                    required
                  />
                  {formData.learningGoal && (
                    <div className="absolute right-4 top-4 text-primary">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                {isSubmitting ? (
                  <Button
                    disabled
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">Personalizing</span>
                      <span className="flex">
                        <span className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                        <span className="animation-delay-200 mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                        <span className="animation-delay-400 mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                      </span>
                    </div>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition-all hover:translate-y-[-2px] hover:bg-primary/90 hover:shadow-lg"
                  >
                    <span>
                      {progressPercentage === 100
                        ? "Start Your Learning Journey"
                        : "Continue to Your Learning Path"}
                    </span>
                    <ArrowRight size={18} className="animate-pulse-slow" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
