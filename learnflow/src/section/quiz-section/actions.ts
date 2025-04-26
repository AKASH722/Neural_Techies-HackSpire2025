"use server";

import {
  generateQuizQuestions,
  generateResourceSuggestions,
  getYouTubeRecommendations,
} from "./ai";
import {
  evaluateQuiz,
  getQuizFromDB,
  saveQuizResults,
  saveQuizToDB,
} from "./helper";
import {
  EvaluationResult,
  QuizData,
  QuizQuestion,
  QuizSettings,
  UserAnswer,
  YouTubeResource,
} from "./types";
import { getUser } from "@/utils/supabase/helper";

export async function generateQuiz(settings: QuizSettings): Promise<QuizData> {
  try {
    const { topic, difficulty, experience, learningGoal, questionCount } =
      settings;

    // Generate quiz questions using AI
    const quizQuestions = await generateQuizQuestions(
      topic,
      difficulty,
      experience,
      learningGoal,
      questionCount
    );

    settings.userId = (await getUser()).user_id;

    const quizId = await saveQuizToDB(settings, quizQuestions);

    return {
      id: quizId,
      name: settings.name,
      topic,
      difficulty,
      learningGoal,
      quiz: quizQuestions,
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
}

// Server action to evaluate a quiz
export async function evaluateQuizAction(
  quizId: number,
  userAnswers: UserAnswer
): Promise<EvaluationResult> {
  try {
    // Get quiz data
    const quizData = await getQuizFromDB(quizId);

    // Evaluate quiz
    const results = evaluateQuiz(quizData.quiz as QuizQuestion[], userAnswers);

    // Generate resource suggestions
    const resources = await generateResourceSuggestions(
      quizData.quiz as QuizQuestion[],
      results,
      quizData.learningGoal!,
      quizData.topic
    );

    // Get YouTube recommendations if there are incorrect answers
    const incorrectQuestions = results.filter((r) => !r.isCorrect);
    let youtubeResources: YouTubeResource[] = [];

    if (incorrectQuestions.length > 0) {
      // Extract topics from incorrect questions
      const strugglingTopics = incorrectQuestions.map((q) => {
        const questionObj = quizData.quiz[q.questionNumber - 1];
        return questionObj.question.split(" ").slice(0, 5).join(" ");
      });

      youtubeResources = await getYouTubeRecommendations(
        strugglingTopics,
        quizData.topic,
        quizData.learningGoal!
      );
    }

    const user_id = (await getUser()).user_id;

    // Save results to database
    await saveQuizResults(
      user_id,
      quizId,
      results,
      resources,
      youtubeResources
    );

    // Return evaluation results
    return {
      name: quizData.name!,
      results,
      resources,
      youtubeResources,
      score: {
        correct: results.filter((r) => r.isCorrect).length,
        total: results.length,
        percentage:
          (results.filter((r) => r.isCorrect).length / results.length) * 100,
      },
    };
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    throw new Error("Failed to evaluate quiz");
  }
}
