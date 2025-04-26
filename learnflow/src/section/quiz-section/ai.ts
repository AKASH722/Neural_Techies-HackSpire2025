import { genAI } from "@/lib/gen-ai";
import {
  QuizQuestion,
  QuizResult,
  ResourceData,
  YouTubeResource,
} from "./types";
import axios from "axios";

export async function generateQuizQuestions(
  topic: string,
  difficulty: string,
  experience: string,
  learningGoal: string,
  questionCount: number
): Promise<QuizQuestion[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
  Generate a quiz with ${questionCount} multiple-choice questions about ${topic}.
  
  Consider these factors:
  - Difficulty level: ${difficulty} (Easy/Medium/Hard)
  - User experience level: ${experience}
  - Learning goal: ${learningGoal}
  
  For each question, provide:
  1. The question text
  2. Four options (A, B, C, D)
  3. The correct answer
  4. A detailed explanation of why the correct answer is right
  5. Brief explanations of why each wrong answer is incorrect
  
  Format your response strictly as a JSON array following this structure:
  {
    "quiz": [
      {
        "question": "Question text here...",
        "options": {
          "A": "Option A text",
          "B": "Option B text",
          "C": "Option C text",
          "D": "Option D text"
        },
        "correct_answer": "B",
        "explanation": {
          "correct": "Long explanation why Option B is correct.",
          "wrong": {
            "A": "Why Option A is wrong.",
            "C": "Why Option C is wrong.",
            "D": "Why Option D is wrong."
          }
        }
      }
    ]
  }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Extract the JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      return parsedData.quiz;
    } catch (error) {
      console.error("Error parsing JSON from Gemini response:", error);
      throw new Error("Failed to parse quiz data");
    }
  } else {
    throw new Error("Failed to extract quiz data from Gemini response");
  }
}

export async function generateResourceSuggestions(
  quiz: QuizQuestion[],
  results: QuizResult[],
  learningGoal: string,
  topic: string
): Promise<ResourceData> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Identify topics the user struggled with
  const incorrectQuestions = results.filter((r) => !r.isCorrect);
  if (incorrectQuestions.length === 0) {
    return {
      topics_to_review: [],
      resources: [],
      general_tip: "Great job! You got all questions correct.",
      message: "Great job! You got all questions correct.",
    };
  }

  const struggledTopics = incorrectQuestions.map((q) => {
    const questionObj = quiz[q.questionNumber - 1];
    return {
      question: questionObj.question,
      correctAnswer: questionObj.correct_answer,
      correctExplanation: questionObj.explanation.correct,
    };
  });

  const prompt = `
  Based on quiz results, the user struggled with the following questions:
  ${JSON.stringify(struggledTopics, null, 2)}
  
  The user's learning goal is: ${learningGoal}
  The main topic of the quiz was: ${topic}
  
  Please provide:
  1. A summary of the topics they need to work on
  2. Three specific resource suggestions (articles or practice exercises) for each topic
  3. One general tip to help them master this subject area
  
  Format your response as JSON like this:
  {
    "topics_to_review": ["Topic 1", "Topic 2"],
    "resources": [
      {
        "topic": "Topic 1",
        "suggestions": [
          {
            "title": "Resource title",
            "type": "article/exercise",
            "description": "Brief description"
          }
        ]
      }
    ],
    "general_tip": "A helpful learning tip"
  }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Extract the JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Error parsing JSON from Gemini response:", error);
      return {
        topics_to_review: [],
        resources: [],
        error: "Failed to generate resource suggestions",
        general_tip: "Review the explanations for each question you missed.",
      };
    }
  } else {
    return {
      topics_to_review: [],
      resources: [],
      error: "Failed to generate resource suggestions",
      general_tip: "Review the explanations for each question you missed.",
    };
  }
}

export async function getYouTubeRecommendations(
  strugglingTopics: string[],
  mainTopic: string,
  learningGoal: string
): Promise<YouTubeResource[]> {
  try {
    // Generate search terms using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const searchTermsPrompt = `
    Based on a quiz about "${mainTopic}" with learning goal "${learningGoal}",
    the user struggled with understanding these topics:
    ${JSON.stringify(strugglingTopics)}
    
    Please provide 3-5 specific YouTube search terms that would help this person learn these topics.
    Each search term should be focused, educational, and likely to return high-quality tutorial videos.
    Return only a JSON array of strings like this: ["search term 1", "search term 2", "search term 3"]
    `;

    const searchTermsResult = await model.generateContent(searchTermsPrompt);
    const searchTermsText = searchTermsResult.response.text();

    // Extract JSON array of search terms
    const searchTermsMatch = searchTermsText.match(/\[[\s\S]*\]/);
    if (!searchTermsMatch) {
      throw new Error("Failed to generate search terms");
    }

    const searchTerms = JSON.parse(searchTermsMatch[0]);
    const videoRecommendations: YouTubeResource[] = [];

    // Limit to 3 search terms max to avoid API quota issues
    const termsToSearch = searchTerms.slice(0, 3);

    // Search YouTube for each term
    for (const term of termsToSearch) {
      const searchQuery = `${term} ${mainTopic} tutorial`;
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY!,
            part: "snippet",
            q: searchQuery,
            type: "video",
            maxResults: 3,
            relevanceLanguage: "en",
            videoEmbeddable: true,
            videoDuration: "medium", // Videos between 4-20 minutes
            order: "relevance",
          },
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        // Get additional video details
        const videoIds = response.data.items
          .map((item: { id: { videoId: string } }) => item.id.videoId)
          .join(",");
        const videoDetailsResponse = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              key: process.env.YOUTUBE_API_KEY!,
              part: "snippet,statistics,contentDetails",
              id: videoIds,
            },
          }
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const videos = videoDetailsResponse.data.items.map((video) => {
          const duration = video.contentDetails.duration;
          // Convert duration to minutes
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          const hours = parseInt(match[1] || 0);
          const minutes = parseInt(match[2] || 0);
          const seconds = parseInt(match[3] || 0);
          const totalMinutes = hours * 60 + minutes + seconds / 60;

          return {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description.substring(0, 120) + "...",
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: parseInt(video.statistics.likeCount || 0),
            durationMinutes: totalMinutes.toFixed(1),
            url: `https://www.youtube.com/watch?v=${video.id}`,
            embeddable: video.status ? video.status.embeddable : true,
            searchTerm: term,
          };
        });

        // Filter for educational videos between 3-30 minutes
        const filteredVideos = videos.filter(
          (video: { durationMinutes: number }) => {
            return video.durationMinutes >= 3 && video.durationMinutes <= 30;
          }
        );

        if (filteredVideos.length > 0) {
          videoRecommendations.push({
            topic: term,
            videos: filteredVideos,
          });
        }
      }
    }

    return videoRecommendations;
  } catch (error) {
    console.error("Error fetching YouTube recommendations:", error);
    return [];
  }
}
