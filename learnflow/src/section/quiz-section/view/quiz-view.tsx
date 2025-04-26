import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { getUserUUID } from "@/utils/supabase/helper";
import AddNewCard from "../add-new-card";
import QuizCard from "../quiz-card";

export async function QuizView() {
  const supabase = await createClient();

  const userUuid = await getUserUUID();

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(
      `
        *,
        users!inner(),
        quiz_results (
          correct_count,
          total_count,
          percentage,
          created_at
        )
      `
    )
    .eq("users.user_uuid", userUuid)
    .order("quiz_id", { ascending: false })
    .order("created_at", { referencedTable: "quiz_results", ascending: false });

  if (error) {
    console.error("Error fetching quizzes:", error);
  }

  return (
    <Suspense fallback={<div>Loading quizzes...</div>}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Button to add new quiz */}
        <AddNewCard />

        {/* Render quizzes */}
        {quizzes?.map((quiz) => {
          const latestResult = quiz.quiz_results?.[0]; // because we ordered by created_at DESC

          return (
            <QuizCard
              key={quiz.quiz_id}
              id={quiz.quiz_id}
              name={quiz.name!}
              topic={quiz.topic!}
              difficulty={quiz.difficulty!}
              createdAt={new Date(quiz.created_at!)}
              previousResult={
                latestResult
                  ? {
                      correctCount: latestResult.correct_count,
                      totalCount: latestResult.total_count,
                      percentage: latestResult.percentage,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
    </Suspense>
  );
}
