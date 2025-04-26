import {
  QuizQuestion,
  QuizResult,
  QuizSettings,
  ResourceData,
  UserAnswer,
  YouTubeResource,
} from "./types";
import { createClient } from "@/utils/supabase/server";

export async function saveQuizToDB(
  settings: QuizSettings,
  questions: QuizQuestion[]
): Promise<number> {
  const supabase = await createClient();

  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      user_id: settings.userId,
      name: settings.name,
      topic: settings.topic,
      difficulty: settings.difficulty,
      learning_goal: settings.learningGoal,
      experience_level: settings.experience,
    })
    .select("quiz_id")
    .single();

  if (quizError || !quizData) {
    console.error("Error saving quiz:", quizError);
    throw new Error("Failed to save quiz");
  }

  const quizId = quizData.quiz_id;

  // Prepare questions for batch insert
  const questionsToInsert = questions.map((question, index) => ({
    quiz_id: quizId,
    question_text: question.question,
    option_a: question.options.A,
    option_b: question.options.B,
    option_c: question.options.C,
    option_d: question.options.D,
    correct_answer: question.correct_answer,
    correct_explanation: question.explanation.correct,
    wrong_explanation_a: question.explanation.wrong.A,
    wrong_explanation_b: question.explanation.wrong.B,
    wrong_explanation_c: question.explanation.wrong.C,
    wrong_explanation_d: question.explanation.wrong.D,
    position: index + 1,
  }));

  // Insert all questions
  const { error: questionsError } = await supabase
    .from("questions")
    .insert(questionsToInsert);

  if (questionsError) {
    console.error("Error saving questions:", questionsError);
    throw new Error("Failed to save quiz questions");
  }

  return quizId;
}

// Evaluate user's quiz answers
export function evaluateQuiz(
  quiz: QuizQuestion[],
  userAnswers: UserAnswer
): QuizResult[] {
  return quiz.map((question, index) => {
    const userAnswer = userAnswers[question.question_id!];
    const isCorrect = userAnswer === question.correct_answer;

    return {
      questionNumber: index + 1,
      question: question.question,
      userAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: isCorrect
        ? question.explanation.correct
        : question.explanation.wrong[
            userAnswer as keyof typeof question.explanation.wrong
          ] || "No explanation available.",
    };
  });
}

export async function saveQuizResults(
  userId: number,
  quizId: number,
  results: QuizResult[],
  resources: ResourceData,
  youtubeResources: YouTubeResource[]
): Promise<void> {
  const supabase = await createClient();

  // Calculate score
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const percentage = (correctCount / totalCount) * 100;

  const { error: resultError } = await supabase.from("quiz_results").insert({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    user_id: userId,
    quiz_id: quizId,
    correct_count: correctCount,
    total_count: totalCount,
    percentage: percentage,
    resources: resources, // assuming it's a plain object
    youtube_resources: youtubeResources, // direct array, no wrapping
  });

  if (resultError) {
    console.error("Error saving quiz results:", resultError);
    throw new Error("Failed to save quiz results");
  }
}

export async function getQuizFromDB(quizId: number) {
  const supabase = await createClient();

  // Get quiz metadata
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("quiz_id", quizId)
    .single();

  if (quizError || !quizData) {
    console.error("Error fetching quiz:", quizError);
    throw new Error("Failed to fetch quiz");
  }

  // Get quiz questions
  const { data: questionData, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });

  if (questionError || !questionData) {
    console.error("Error fetching questions:", questionError);
    throw new Error("Failed to fetch quiz questions");
  }

  // Convert DB format to app format
  const formattedQuestions = questionData.map((q) => ({
    question_id: q.question_id,
    question: q.question_text,
    options: {
      A: q.option_a,
      B: q.option_b,
      C: q.option_c,
      D: q.option_d,
    },
    correct_answer: q.correct_answer,
    explanation: {
      correct: q.correct_explanation,
      wrong: {
        A: q.wrong_explanation_a,
        B: q.wrong_explanation_b,
        C: q.wrong_explanation_c,
        D: q.wrong_explanation_d,
      },
    },
  }));

  return {
    id: quizData.quiz_id,
    name: quizData.name,
    topic: quizData.topic,
    difficulty: quizData.difficulty,
    learningGoal: quizData.learning_goal,
    quiz: formattedQuestions,
  };
}
