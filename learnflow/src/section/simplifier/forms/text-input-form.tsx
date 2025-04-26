"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processText } from "@/section/simplifier/actions";

interface TextInputProps {
  onSuccess: () => void;
}

export default function TextInput({ onSuccess }: TextInputProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await processText(title, text);
      onSuccess();
      router.push(`/simplifier/${result.summary.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title (Optional)</Label>
        <Input
          id="title"
          placeholder="Enter a descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Text to Summarize</Label>
        <Textarea
          id="text"
          placeholder="Paste or type your text here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="min-h-[200px]"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !text.trim()}
      >
        {loading ? "Processing..." : "Generate Explanation"}
      </Button>
    </form>
  );
}
