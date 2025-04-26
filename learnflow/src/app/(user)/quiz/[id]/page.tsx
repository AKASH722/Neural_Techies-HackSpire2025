import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Link from "next/link";

interface QuizResultsPageProps {
  params: { id: string };
}

export default async function QuizResultsPage({
  params,
}: QuizResultsPageProps) {
  const supabase = await createClient();

  const { data: quizWithResults, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      quiz_results (
        result_id,
        correct_count,
        total_count,
        percentage,
        created_at,
        resources,
        youtube_resources
      )
    `
    )
    .eq("quiz_id", parseInt(params.id, 10))
    .single();

  if (error) {
    return <div>Error loading quiz and results.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {quizWithResults.name} - Results
      </h1>
      <div className="flex flex-col gap-4">
        {quizWithResults.quiz_results.map((result) => (
          <Link
            key={quizWithResults.quiz_id}
            href={`/quiz/${quizWithResults.quiz_id}/result/${result.result_id}`}
          >
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">
                  {quizWithResults.name}
                </CardTitle>
                <Trophy className="h-8 w-8 text-amber-500" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(result.created_at!).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-bold">
                    {result.correct_count}/{result.total_count} correct
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="font-medium text-blue-600">View &rarr;</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
