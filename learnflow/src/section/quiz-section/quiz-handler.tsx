"use client";

import { useState } from "react";
import { evaluateQuizAction } from "./actions";
import { EvaluationResult, QuizQuestion } from "./types";
import QuestionCard from "@/section/quiz-section/question-card";
import QuizResults from "@/section/quiz-section/results";

interface QuizHandlerProps {
  quizId: number;
  questions: QuizQuestion[];
}

export default function QuizHandler({ quizId, questions }: QuizHandlerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
  };

  const handleNextQuestion = async () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      // Evaluate the quiz
      setLoading(true);
      try {
        const userAnswers = selectedAnswers.reduce(
          (acc, ans, idx) => {
            if (ans !== null) {
              acc[questions[idx].question_id!] = ans;
            }
            return acc;
          },
          {} as { [questionId: number]: string }
        );

        const result = await evaluateQuizAction(quizId, userAnswers);
        setEvaluationResult(result);
        setQuizCompleted(true);
      } catch (error) {
        console.error("Failed to evaluate quiz:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsSubmitted(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setIsSubmitted(false);
    setQuizCompleted(false);
    setEvaluationResult(null);
  };

  if (quizCompleted && evaluationResult) {
    return (
      <QuizResults
        evaluationResult={evaluationResult}
        handleRestart={handleRestart}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg font-medium">Evaluating your quiz...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <QuestionCard
          questionText={currentQuestion.question}
          options={[
            currentQuestion.options.A,
            currentQuestion.options.B,
            currentQuestion.options.C,
            currentQuestion.options.D,
          ]}
          correctAnswer={currentQuestion.correct_answer}
          explanation={currentQuestion.explanation}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          isSubmitted={isSubmitted}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          onSelectAnswer={handleSelectAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
        />
      </div>
    </div>
  );
}
