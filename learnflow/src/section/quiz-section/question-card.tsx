"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: {
    correct: string;
    wrong: {
      A?: string;
      B?: string;
      C?: string;
      D?: string;
    };
  };
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isLastQuestion: boolean;
  onSelectAnswer: (answer: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
}

export default function QuestionCard({
  questionText,
  options,
  correctAnswer,
  explanation,
  selectedAnswer,
  isSubmitted,
  isLastQuestion,
  onSelectAnswer,
  onSubmitAnswer,
  onNextQuestion,
}: QuestionCardProps) {
  const isAnswerSelected = selectedAnswer !== null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{questionText}</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selectedAnswer || undefined}
          onValueChange={(val) => onSelectAnswer(val)}
          className="space-y-3"
        >
          {options.map((option, index) => {
            const optionLabel = ["A", "B", "C", "D"][index]; // A, B, C, D
            let optionClassName = "border p-3 rounded-md";
            if (isSubmitted) {
              if (optionLabel === correctAnswer) {
                optionClassName += " bg-green-50 border-green-500";
              } else if (optionLabel === selectedAnswer) {
                optionClassName += " bg-red-50 border-red-500";
              }
            } else {
              optionClassName += " hover:bg-gray-50";
            }

            return (
              <div key={index} className={optionClassName}>
                <RadioGroupItem
                  value={optionLabel}
                  id={`option-${optionLabel}`}
                  disabled={isSubmitted}
                  className="sr-only"
                />
                <Label
                  htmlFor={`option-${optionLabel}`}
                  className="flex cursor-pointer items-center"
                >
                  <div className="mr-4 mt-0.5 flex-shrink-0">
                    {isSubmitted && optionLabel === correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isSubmitted && optionLabel === selectedAnswer ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                        {selectedAnswer === optionLabel && !isSubmitted && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">{option}</div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        {/* Explanation of the answer */}
        {isSubmitted && selectedAnswer !== correctAnswer && (
          <>
            <Alert className="mt-4 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {
                  explanation.wrong[
                    selectedAnswer as keyof typeof explanation.wrong
                  ]
                }
              </AlertDescription>
            </Alert>

            <Alert className="mt-2 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {explanation.correct} {/* Explanation for the correct answer */}
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>

      <CardFooter>
        {!isSubmitted ? (
          <Button
            onClick={onSubmitAnswer}
            className="w-full"
            disabled={!isAnswerSelected}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={onNextQuestion} className="w-full">
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
