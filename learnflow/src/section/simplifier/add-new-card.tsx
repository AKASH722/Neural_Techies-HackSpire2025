import { Card, CardContent } from "@/components/ui/card";
import NewSimplifierModal from "@/section/simplifier/new-simplifier-modal";
import { Plus } from "lucide-react";

export default function AddNewCard() {
  return (
    <NewSimplifierModal>
      <Card className="flex h-full cursor-pointer items-center justify-center border-dashed transition-colors hover:bg-gray-50">
        <CardContent className="flex h-full flex-col items-center justify-center p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-center font-medium">Create New Explanation</p>
          <p className="mt-1 text-center text-sm text-gray-500">
            Upload video, document, or text
          </p>
        </CardContent>
      </Card>
    </NewSimplifierModal>
  );
}
