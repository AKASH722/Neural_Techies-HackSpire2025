import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/server";
import ReactMarkdown from "react-markdown";

// Helper function to extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default async function SummaryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: summary, error } = await supabase
    .from("summaries")
    .select("*, users!inner()")
    .eq("id", parseInt(params.id, 10))
    .single();

  if (error) {
    console.error("Error fetching summaries:", error);
  }

  if (!summary) {
    notFound();
  }

  const typeLabels = {
    youtube: "YouTube Video",
    document: "Document",
    text: "Text",
  };

  // Extract YouTube video ID if it's a YouTube summary
  const videoId =
    summary.type === "youtube" && summary.source_url
      ? extractYouTubeVideoId(summary.source_url)
      : null;

  return (
    <main className="container mx-auto py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{summary.title}</h1>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              {typeLabels[summary.type as "text" | "youtube" | "document"]}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {new Date(summary.created_at!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* YouTube Video Embed */}
        {summary.type === "youtube" && videoId && (
          <div className="mb-8 overflow-hidden rounded-lg shadow">
            <div className="aspect-w-16 aspect-h-9 relative pb-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute left-0 top-0 h-full w-full"
                allowFullScreen
                title={summary.title!}
              ></iframe>
            </div>
            {summary.source_url && (
              <div className="bg-gray-50 p-3 text-sm">
                <a
                  href={summary.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Summary Card with Tabs for Text Input */}
        <Card className="mb-8 shadow-md">
          {summary.type === "text" ? (
            <Tabs defaultValue="summary">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Content</CardTitle>
                  <TabsList className="grid w-64 grid-cols-2">
                    <TabsTrigger value="summary">Explanation</TabsTrigger>
                    <TabsTrigger value="original">Original Text</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <TabsContent value="summary" className="mt-0">
                  <div className="prose max-h-[calc(100dvh-26rem)] max-w-full overflow-y-auto rounded border p-6 md:max-h-[calc(100dvh-20rem)]">
                    <ReactMarkdown>{summary.summary}</ReactMarkdown>
                  </div>
                </TabsContent>
                <TabsContent value="original" className="mt-0">
                  <div className="prose max-h-[calc(100dvh-26rem)] max-w-full overflow-y-auto rounded border p-6 md:max-h-[calc(100dvh-20rem)]">
                    {/* Assuming original text is stored in summary.originalText */}
                    {summary.original_text ? (
                      <ReactMarkdown>{summary.original_text}</ReactMarkdown>
                    ) : (
                      <p className="italic text-gray-500">
                        Original text not available
                      </p>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          ) : (
            <>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">
                  Simplified Explanation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose max-h-[calc(100dvh-26rem)] max-w-full overflow-y-auto rounded border p-6 md:max-h-[calc(100dvh-20rem)]">
                  <ReactMarkdown>{summary.summary}</ReactMarkdown>
                </div>
              </CardContent>
            </>
          )}
          <CardFooter className="border-t p-6">
            <div className="flex w-full items-center justify-between">
              <div className="text-sm text-gray-500">
                {summary.source_info && <p>Source: {summary.source_info}</p>}
              </div>
              <Link href={`/simplifier/${summary.id}/quiz`}>
                <Button className="px-6 py-2">
                  Test Your Knowledge
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
