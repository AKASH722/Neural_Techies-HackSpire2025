"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  Clock,
  Trophy,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define the structure of our questions and form data
interface Question {
  question: string;
  type: "text" | "choice";
  field: string;
  options?: string[];
}

interface FormData {
  [key: string]: string;
}

interface OnboardingFormProps {
  onComplete?: (formData: FormData) => void;
  isLoading?: boolean;
  isComplete?: boolean;
}

export default function OnboardingForm({
  onComplete,
  isLoading = false,
  isComplete = false,
}: OnboardingFormProps) {
  // Define our questions based on the JSON data
  const questions: Question[] = [
    {
      question:
        "What topic do you want to learn? (e.g., Python, Web Dev, Machine Learning)",
      type: "text",
      field: "topic",
    },
    {
      question: "What is your current skill level?",
      type: "choice",
      field: "skill_level",
      options: ["Absolute Beginner", "Beginner", "Intermediate", "Advanced"],
    },
    {
      question: "How do you prefer to learn concepts?",
      type: "choice",
      field: "learning_style",
      options: [
        "Through fun analogies and humor",
        "Through real-world practical examples",
        "Through bite-sized clear definitions",
        "By highlighting and learning from common mistakes",
        "Through interactive storytelling",
        "Through comparing and contrasting related ideas",
      ],
    },
    {
      question: "What type of module size do you prefer?",
      type: "choice",
      field: "module_preference",
      options: [
        "Very short (5-10 minutes per topic)",
        "Short (15-30 minutes per topic)",
        "Medium (30-60 minutes per topic)",
        "Long detailed sessions (1-2 hours)",
        "Flexible — depending on the difficulty of the topic",
      ],
    },
  ];

  // Initialize form data with empty values
  const initialFormData: FormData = {};
  questions.forEach((q) => {
    initialFormData[q.field] = "";
  });

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = questions.length;

  // Handle input changes
  const handleChange = (field: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Navigate to the next question
  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit the form if we're at the last step
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  // Navigate to the previous question
  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Calculate the progress percentage - FIXED to start at 0%
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Check if the current question is answered
  const isCurrentQuestionAnswered = (): boolean => {
    const currentField = questions[currentStep].field;
    return !!formData[currentField];
  };

  // Determine the icon for the current question
  const getQuestionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <BookOpen className="h-6 w-6 text-primary" />;
      case 1:
        return <Trophy className="h-6 w-6 text-primary" />;
      case 2:
        return <Target className="h-6 w-6 text-primary" />;
      case 3:
        return <Clock className="h-6 w-6 text-primary" />;
      default:
        return <Sparkles className="h-6 w-6 text-primary" />;
    }
  };

  // Render the current question
  const renderQuestion = () => {
    const currentQuestion = questions[currentStep];

    if (currentQuestion.type === "text") {
      return (
        <div className="space-y-4">
          <Input
            value={formData[currentQuestion.field]}
            onChange={(e) =>
              handleChange(currentQuestion.field, e.target.value)
            }
            placeholder="Type your answer here..."
            className="h-12 border-gray-300 text-base transition-all duration-300 focus:border-primary dark:border-slate-700"
            autoFocus
          />
        </div>
      );
    } else if (currentQuestion.type === "choice" && currentQuestion.options) {
      return (
        <RadioGroup
          value={formData[currentQuestion.field]}
          onValueChange={(value) => handleChange(currentQuestion.field, value)}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <RadioGroupItem
                value={option}
                id={`${currentQuestion.field}-${index}`}
                className="text-primary"
              />
              <Label
                htmlFor={`${currentQuestion.field}-${index}`}
                className="flex-1 cursor-pointer text-base font-medium"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    return null;
  };

  // Simple animation to fade in the question
  useEffect(() => {
    const element = document.getElementById("question-container");
    if (element) {
      element.classList.add("opacity-0");
      setTimeout(() => {
        element.classList.remove("opacity-0");
      }, 50);
    }
  }, [currentStep]);

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-2xl overflow-hidden bg-white shadow-xl transition-all duration-300 dark:bg-slate-800">
        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-200 dark:bg-slate-700">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${isComplete ? 100 : progressPercentage}%` }}
          ></div>
        </div>

        <CardHeader className="px-6 pb-0 pt-6">
          <div className="mb-2 flex items-center gap-3">
            {getQuestionIcon(currentStep)}
            <CardTitle className="text-2xl font-bold">
              Personalize Your Learning Path
            </CardTitle>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="font-medium text-primary">
              {Math.round(isComplete ? 100 : progressPercentage)}% complete
            </span>
          </CardDescription>
        </CardHeader>

        {isComplete ? (
          <CardContent className="px-6 py-6">
            <div className="space-y-4 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">
                Perfect! You&#39;re all set.
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We&#39;ve personalized your learning experience based on your
                preferences.
              </p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="px-6 py-6">
              <div
                id="question-container"
                className="min-h-[300px] transition-opacity duration-300"
              >
                <h3 className="mb-6 text-xl font-bold">
                  {questions[currentStep].question}
                </h3>
                {renderQuestion()}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-gray-100 px-6 py-4 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="h-12 border-gray-300 px-5 dark:border-slate-600"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>

              {isLoading ? (
                <Button
                  disabled
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <div className="flex items-center">
                    <span className="mr-2">Processing</span>
                    <span className="flex">
                      <span className="mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                      <span className="animation-delay-200 mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                      <span className="animation-delay-400 mx-0.5 h-2 w-2 animate-bounce rounded-full bg-white"></span>
                    </span>
                  </div>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-all hover:translate-y-[-2px] hover:bg-primary/90 hover:shadow-lg disabled:pointer-events-none disabled:opacity-50"
                >
                  {currentStep === totalSteps - 1
                    ? "Generate Learning Path"
                    : "Continue"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
