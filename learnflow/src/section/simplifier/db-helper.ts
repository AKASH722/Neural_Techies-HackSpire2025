import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/helper";

type SummaryData = {
  summary: string;
  quiz: {
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    correct_answer: string;
    explanation?: {
      correct: string;
    };
  }[];
};

export async function saveSummaryAndQuestions(
  summaryData: SummaryData,
  title: string,
  sourceInfo: string,
  type: "text" | "document" | "youtube",
  sourceUrl?: string,
  text?: string
) {
  const supabase = await createClient();
  const { summary, quiz } = summaryData;

  const user = await getUser();

  const { data: summaryRecord, error: summaryError } = await supabase
    .from("summaries")
    .insert([
      {
        title: title || "Untitled Summary",
        summary,
        type,
        source_info: sourceInfo,
        source_url: sourceUrl,
        user_id: user.user_id,
        original_text: text,
      },
    ])
    .select()
    .single();

  if (summaryError) {
    console.error("Error saving summary:", summaryError);
    throw new Error("Failed to save summary");
  }

  // Save questions if there are any
  if (quiz && quiz.length > 0) {
    const questionsToInsert = quiz.map((q) => ({
      summary_id: summaryRecord.id,
      question_text: q.question,
      option_a: q.options.A,
      option_b: q.options.B,
      option_c: q.options.C,
      option_d: q.options.D,
      correct_answer: q.correct_answer,
      explanation: q.explanation?.correct || "",
    }));

    const { error: questionsError } = await supabase
      .from("summary_questions")
      .insert(questionsToInsert);

    if (questionsError) {
      console.error("Error saving questions:", questionsError);
      throw new Error("Failed to save questions");
    }
  }

  return { summary: summaryRecord, questionsCount: quiz?.length || 0 };
}
