import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  id: number;
  name: string;
  topic: string;
  difficulty: string;
  createdAt: Date;
  previousResult?: {
    correctCount: number;
    totalCount: number;
    percentage: number;
  };
}

export default function QuizCard({
  id,
  name,
  topic,
  difficulty,
  createdAt,
  previousResult,
}: QuizCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{name || topic}</CardTitle>
          <Badge
            variant="outline"
            className={
              difficultyColors[difficulty as "easy" | "medium" | "hard"]
            }
          >
            {difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {previousResult && (
          <p className="text-sm text-gray-700">
            Previous: {previousResult.correctCount}/{previousResult.totalCount}{" "}
            ({previousResult.percentage.toFixed(1)}%)
          </p>
        )}
      </CardContent>

      <CardFooter className="mt-4 flex flex-col space-y-4">
        <div className="flex w-full gap-2">
          <Button asChild className="flex-1">
            <Link href={`/quiz/${id}/start`}>
              {previousResult ? "Retake Quiz" : "Start Quiz"}
            </Link>
          </Button>
          {previousResult && (
            <Button asChild variant="secondary" className="flex-1">
              <Link href={`/quiz/${id}`}>View Analysis</Link>
            </Button>
          )}
        </div>

        <div className="text-left text-xs text-gray-500">Created {timeAgo}</div>
      </CardFooter>
    </Card>
  );
}
