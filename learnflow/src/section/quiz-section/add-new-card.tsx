import { Card, CardContent } from "@/components/ui/card";
import NewQuizModal from "./new-quiz-modal";
import { Plus } from "lucide-react";

export default function AddNewQuizCard() {
  return (
    <NewQuizModal>
      <Card className="flex h-full cursor-pointer items-center justify-center border-dashed transition-colors hover:bg-gray-50">
        <CardContent className="flex h-full flex-col items-center justify-center p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-center font-medium">Create New Quiz</p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Generate questions with AI and test your knowledge
          </p>
        </CardContent>
      </Card>
    </NewQuizModal>
  );
}
