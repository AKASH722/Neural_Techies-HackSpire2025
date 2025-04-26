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
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{summary.title}</h1>
            <Badge variant="outline">
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
        <Card className="mb-8">
          {summary.type === "text" ? (
            <Tabs defaultValue="summary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Content</CardTitle>
                  <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="original">Original Text</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="summary" className="mt-0">
                  <div className="prose max-w-none">
                    {summary.summary.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="original" className="mt-0">
                  <div className="prose max-h-96 max-w-none overflow-y-auto rounded border p-4">
                    {/* Assuming original text is stored in summary.originalText */}
                    {summary.original_text ? (
                      summary.original_text
                        .split("\n")
                        .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
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
              <CardHeader>
                <CardTitle>Simplified Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {summary.summary.split("\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </>
          )}
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <div className="text-sm text-gray-500">
                {summary.source_info && <p>Source: {summary.source_info}</p>}
              </div>
              <Link href={`/simplifier/${summary.id}/quiz`}>
                <Button>
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
