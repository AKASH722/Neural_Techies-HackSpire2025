"use client";

import { useState } from "react";
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
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizClientProps {
  questions: Question[];
  summaryId: number;
}

export default function QuizClient({ questions, summaryId }: QuizClientProps) {
  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    answers: new Array(questions.length).fill(null),
    isSubmitted: false,
    score: 0,
    completed: false,
  });

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const selectedAnswer = quizState.answers[quizState.currentQuestionIndex];
  const isAnswerSelected = selectedAnswer !== null;

  const handleSelectAnswer = (value: string) => {
    if (quizState.isSubmitted) return;
    const answerIndex = parseInt(value);
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = answerIndex;
    setQuizState((prev) => ({ ...prev, answers: newAnswers }));
  };

  const handleSubmitAnswer = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNextQuestion = () => {
    const isLastQuestion =
      quizState.currentQuestionIndex === questions.length - 1;
    if (isLastQuestion) {
      setQuizState((prev) => ({ ...prev, completed: true }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        isSubmitted: false,
      }));
    }
  };

  const handleRestartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: new Array(questions.length).fill(null),
      isSubmitted: false,
      score: 0,
      completed: false,
    });
  };

  if (quizState.completed) {
    return (
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-4 text-6xl font-bold">
                {quizState.score}/{questions.length}
              </div>
              <p className="mb-4 text-center">
                You scored {quizState.score} out of {questions.length} questions
                correctly.
              </p>
              <div className="mt-4 w-full space-y-4">
                <Button onClick={handleRestartQuiz} className="w-full">
                  Try Again
                </Button>
                <Link
                  href={`/simplifier/${summaryId}`}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    Review Summary
                  </Button>
                </Link>
                <Link href="/simplifier" className="block w-full">
                  <Button variant="outline" className="w-full">
                    Back to Simplifier
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Test Your Knowledge</h1>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Question {quizState.currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-medium">Score: {quizState.score}</div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion?.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={
                selectedAnswer !== null ? String(selectedAnswer) : undefined
              }
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {currentQuestion?.options.map((option, index) => {
                let optionClassName = "border p-3 rounded-md";
                if (quizState.isSubmitted) {
                  if (index === currentQuestion.correctAnswer) {
                    optionClassName += " bg-green-50 border-green-500";
                  } else if (index === selectedAnswer) {
                    optionClassName += " bg-red-50 border-red-500";
                  }
                } else {
                  optionClassName += " hover:bg-gray-50";
                }

                return (
                  <div key={index} className={optionClassName}>
                    <RadioGroupItem
                      value={String(index)}
                      id={`option-${index}`}
                      disabled={quizState.isSubmitted}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex cursor-pointer items-start"
                    >
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        {quizState.isSubmitted &&
                        index === currentQuestion.correctAnswer ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : quizState.isSubmitted &&
                          index === selectedAnswer ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                            {selectedAnswer === index &&
                              !quizState.isSubmitted && (
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

            {quizState.isSubmitted &&
              selectedAnswer !== currentQuestion.correctAnswer && (
                <Alert className="mt-4 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    {currentQuestion.explanation}
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
          <CardFooter>
            {!quizState.isSubmitted ? (
              <Button
                onClick={handleSubmitAnswer}
                className="w-full"
                disabled={!isAnswerSelected}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="w-full">
                {quizState.currentQuestionIndex === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
