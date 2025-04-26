import { createClient } from "@/utils/supabase/server";
import QuizHandler from "@/section/quiz-section/quiz-handler";
import { QuizQuestion } from "@/section/quiz-section/types";

interface QuizPageProps {
  params: { id: string };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const supabase = await createClient();

  const { data: rawQuestions, error } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", parseInt(params.id, 10))
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching questions:", error);
  }

  if (!rawQuestions || rawQuestions.length === 0) {
    return <div>No questions found for this quiz.</div>;
  }

  const questions: QuizQuestion[] = rawQuestions.map((supabaseQuestion) => ({
    question_id: supabaseQuestion.question_id,
    question: supabaseQuestion.question_text,
    options: {
      A: supabaseQuestion.option_a!,
      B: supabaseQuestion.option_b!,
      C: supabaseQuestion.option_c!,
      D: supabaseQuestion.option_d!,
    },
    correct_answer: supabaseQuestion.correct_answer,
    explanation: {
      correct: supabaseQuestion.correct_explanation!,
      wrong: {
        A: supabaseQuestion.wrong_explanation_a || undefined,
        B: supabaseQuestion.wrong_explanation_b || undefined,
        C: supabaseQuestion.wrong_explanation_c || undefined,
        D: supabaseQuestion.wrong_explanation_d || undefined,
      },
    },
  }));

  return (
    <div className="container mx-auto py-10">
      {/* Pass questions to client component */}
      <QuizHandler quizId={parseInt(params.id)} questions={questions} />
    </div>
  );
}
