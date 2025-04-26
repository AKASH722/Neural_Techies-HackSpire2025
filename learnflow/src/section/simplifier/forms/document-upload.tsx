"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processDocument } from "@/section/simplifier/actions";

interface DocumentUploadProps {
  onSuccess: () => void;
}

export default function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await processDocument(formData);
      onSuccess();
      router.push(`/simplifier/${result.summary.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process document"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document">Upload Document</Label>
        <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6">
          <Upload className="mb-2 h-10 w-10 text-gray-400" />
          <p className="mb-2 text-center text-sm">
            {file ? file.name : "Click to select document"}
          </p>
          <p className="mb-4 text-xs text-gray-500">
            Supports PDF, DOCX, TXT (Max 10MB)
          </p>
          <input
            id="document"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("document")?.click()}
            disabled={loading}
          >
            Select File
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading || !file}>
        {loading ? "Processing..." : "Generate Explanation"}
      </Button>
    </form>
  );
}
