import { createClient } from "@/utils/supabase/server";
import QuizClient from "../quiz-client";
import { notFound } from "next/navigation";

export default async function QuizView({ id }: { id: number }) {
  const supabase = await createClient();

  const { data: questions, error } = await supabase
    .from("summary_questions")
    .select("*")
    .eq("summary_id", id);

  if (error || !questions || questions.length === 0) {
    console.error("Error fetching questions:", error);
    notFound();
  }

  const formattedQuestions = questions.map((q) => ({
    id: q.id,
    question: q.question_text,
    options: [q.option_a, q.option_b, q.option_c, q.option_d],
    correctAnswer: ["A", "B", "C", "D"].indexOf(q.correct_answer),
    explanation: q.explanation || "",
  }));

  return <QuizClient questions={formattedQuestions} summaryId={id} />;
}
