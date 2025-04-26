import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, ChevronRight, RotateCcw, Trophy, Youtube } from "lucide-react";
import { EvaluationResult } from "./types";

export default function QuizResults({
  evaluationResult,
  handleRestart,
}: {
  evaluationResult: EvaluationResult;
  handleRestart: null | (() => void);
}) {
  // Helper function to determine score color
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!evaluationResult) return null;

  const { score, resources, youtubeResources } = evaluationResult;
  const scoreColor = getScoreColor(score.percentage);

  return (
    <div className="container mx-auto md:px-4 md:py-8">
      <Card className="mx-auto max-w-3xl shadow-lg">
        <CardHeader className="border-b text-center">
          <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg">
            Your performance summary and personalized recommendations
          </CardDescription>
        </CardHeader>

        <div className="flex items-center justify-center bg-slate-50 py-6 dark:bg-slate-900">
          <div className="text-center">
            <Trophy className="mx-auto mb-2 h-12 w-12 text-amber-500" />
            <p className="mb-1 text-lg">Your Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>
              {score.correct}/{score.total} ({score.percentage.toFixed(1)}%)
            </p>
          </div>
        </div>

        <Tabs defaultValue="summary" className="w-full">
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6 space-y-4">
              <div className="rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
                <h3 className="mb-3 font-semibold">Performance Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="font-medium">{score.correct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-medium">{score.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Score Percentage:</span>
                    <span className={`font-medium ${scoreColor}`}>
                      {score.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="mb-4">
                  {score.percentage >= 80
                    ? "Great job! You've demonstrated strong knowledge in this area."
                    : score.percentage >= 60
                      ? "Good effort! Check out the recommended resources to strengthen your knowledge."
                      : "You have room for improvement. We've suggested resources to help you master these topics."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              {resources.resources.length > 0 ? (
                <div className="space-y-6">
                  {resources.resources.map((topicResource, idx) => (
                    <div key={idx} className="rounded-lg border p-4">
                      <h3 className="mb-3 flex items-center text-lg font-semibold">
                        <Book className="mr-2 h-5 w-5 text-blue-600" />
                        {topicResource.topic}
                      </h3>
                      <ul className="space-y-3">
                        {topicResource.suggestions.map((suggestion, sidx) => (
                          <li
                            key={sidx}
                            className="border-l-2 border-blue-200 pl-5"
                          >
                            <p className="font-medium">{suggestion.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {suggestion.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No reading resources available for this quiz.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              {youtubeResources && youtubeResources.length > 0 ? (
                <div className="space-y-6">
                  {youtubeResources.map((ytResource, idx) => (
                    <div key={idx} className="rounded-lg border p-4">
                      <h3 className="mb-3 flex items-center text-lg font-semibold">
                        <Youtube className="mr-2 h-5 w-5 text-red-600" />
                        {ytResource.topic}
                      </h3>
                      <ul className="space-y-2">
                        {ytResource.videos.map((video, vidx) => (
                          <li key={vidx} className="flex items-start">
                            <ChevronRight className="mr-1 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {video.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No video recommendations available for this quiz.</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>

        <CardFooter className="flex flex-col justify-center gap-3 border-t pt-6 sm:flex-row">
          {handleRestart && (
            <Button
              onClick={handleRestart}
              className="flex w-full items-center sm:w-auto"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/quiz">Back to all Quizzes</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
