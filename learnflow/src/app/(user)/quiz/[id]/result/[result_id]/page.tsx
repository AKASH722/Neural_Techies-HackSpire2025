import { createClient } from "@/utils/supabase/server";
import QuizResults from "@/section/quiz-section/results";
import {
  EvaluationResult,
  QuizResult,
  ResourceData,
  YouTubeResource,
} from "@/section/quiz-section/types";

interface QuizResultPageProps {
  params: { id: string; result_id: string };
}

export default async function QuizResultPage({ params }: QuizResultPageProps) {
  const supabase = await createClient();

  // Step 1: Fetch quiz, questions, and result in one go
  const { data, error } = await supabase
    .from("quiz_results")
    .select(
      `
      *,
      quizzes!inner(
        name,
        topic,
        difficulty,
        learning_goal,
        experience_level,
        questions (
          question_id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          correct_explanation,
          wrong_explanation_a,
          wrong_explanation_b,
          wrong_explanation_c,
          wrong_explanation_d,
          position
        )
      )
    `
    )
    .eq("result_id", parseInt(params.result_id, 10))
    .single();

  if (error || !data) {
    return <div>Result not found.</div>;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const resources: ResourceData = data.resources as ResourceData;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const youtubeResources: YouTubeResource[] = data.youtube_resources;

  // Step 3: Convert Questions into QuizResults format
  const questions = data.quizzes.questions || [];

  const results: QuizResult[] = questions.map((q, index: number) => ({
    questionNumber: index + 1,
    question: q.question_text,
    userAnswer: "-",
    correctAnswer: q.correct_answer,
    isCorrect: false,
    explanation: q.correct_explanation ?? "",
  }));

  // Step 4: Construct the EvaluationResult object
  const evaluationResult: EvaluationResult = {
    name: data.quizzes.name!,
    results: results,
    resources: resources,
    youtubeResources: youtubeResources,
    score: {
      correct: data.correct_count,
      total: data.total_count,
      percentage: data.percentage,
    },
  };

  return (
    <QuizResults evaluationResult={evaluationResult} handleRestart={null} />
  );
}
