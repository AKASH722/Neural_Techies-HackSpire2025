// quiz-component.tsx
"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  options: QuizOption[];
}

interface QuizProps {
  moduleId: string;
  moduleName: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function QuizComponent({
  moduleId,
  moduleName,
  questions,
  onComplete,
}: QuizProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const totalQuestions = questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;

    const currentQuizQuestion = questions[currentQuestion];
    const selectedQuizOption = currentQuizQuestion.options.find(
      (option) => option.id === selectedOption
    );

    if (selectedQuizOption?.isCorrect) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score, totalQuestions);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const calculatePerformance = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (quizCompleted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="pb-2 text-center">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Quiz Completed!
            </CardTitle>
            <CardDescription>Module: {moduleName}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {score} / {totalQuestions}
              </p>
              <p className="mt-2 text-xl">
                {calculatePerformance()} Performance
              </p>
            </div>

            <Progress value={(score / totalQuestions) * 100} className="h-3" />

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
              <h3 className="mb-2 font-medium">Performance Summary</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You answered {score} out of {totalQuestions} questions
                correctly.
                {score === totalQuestions
                  ? " Perfect score! You've mastered this module!"
                  : score >= totalQuestions / 2
                    ? " Good job! You've gained a solid understanding of this module."
                    : " Keep studying! You'll get better with more practice."}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/adaptive-learning/module/${moduleId}`)
              }
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module
            </Button>
            <Button onClick={() => router.push("/adaptive-learning/roadmap")}>
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="pb-2">
          <div className="mb-2 flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Module Quiz: {moduleName}
            </CardTitle>
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-medium">
            {questions[currentQuestion].question}
          </h3>

          <RadioGroup
            value={selectedOption || ""}
            onValueChange={handleOptionSelect}
            className="space-y-3"
            disabled={showExplanation}
          >
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-2 rounded-lg border p-3 transition-all duration-200 ${showExplanation && option.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""} ${showExplanation && selectedOption === option.id && !option.isCorrect ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""} ${!showExplanation ? "border-gray-200 hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-slate-800" : ""} `}
              >
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className={` ${showExplanation && option.isCorrect ? "border-green-500 text-green-500" : ""} ${showExplanation && selectedOption === option.id && !option.isCorrect ? "border-red-500 text-red-500" : ""} `}
                />
                <Label
                  htmlFor={option.id}
                  className="flex-1 cursor-pointer text-base font-medium"
                >
                  {option.text}
                </Label>
                {showExplanation && (
                  <>
                    {option.isCorrect && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {selectedOption === option.id && !option.isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </>
                )}
              </div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <div
              className={`mt-6 rounded-lg p-4 ${isCorrect ? "border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"}`}
            >
              <div className="mb-2 flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h4 className="font-medium text-green-700 dark:text-green-400">
                      Correct!
                    </h4>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <h4 className="font-medium text-red-700 dark:text-red-400">
                      Not quite right
                    </h4>
                  </>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {questions[currentQuestion].explanation}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {!showExplanation ? (
            <Button onClick={handleCheckAnswer} disabled={!selectedOption}>
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < totalQuestions - 1
                ? "Next Question"
                : "Complete Quiz"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
