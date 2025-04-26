"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processYouTubeVideo } from "@/section/simplifier/actions";

interface YouTubeInputProps {
  onSuccess: () => void;
}

export default function YouTubeInput({ onSuccess }: YouTubeInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await processYouTubeVideo(url);
      onSuccess();
      router.push(`/simplifier/${result.summary.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process YouTube video"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube Video URL</Label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Generate Explanation"}
      </Button>
    </form>
  );
}
