export interface QuizSettings {
  userId: number;
  name: string;
  topic: string;
  difficulty: string;
  experience: string;
  learningGoal: string;
  questionCount: number;
}

export interface QuizOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface QuizQuestion {
  question_id?: number;
  question: string;
  options: QuizOption;
  correct_answer: string;
  explanation: {
    correct: string;
    wrong: {
      A?: string;
      B?: string;
      C?: string;
      D?: string;
    };
  };
}

export interface QuizData {
  id?: number;
  name: string;
  topic: string;
  difficulty: string;
  learningGoal: string;
  quiz: QuizQuestion[];
}

export interface UserAnswer {
  [key: number]: string;
}

export interface QuizResult {
  questionNumber: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  durationMinutes: string;
  url: string;
  embeddable: boolean;
  searchTerm: string;
}

export interface YouTubeResource {
  topic: string;
  videos: YouTubeVideo[];
}

export interface ResourceSuggestion {
  title: string;
  type: string;
  description: string;
}

export interface TopicResource {
  topic: string;
  suggestions: ResourceSuggestion[];
}

export interface ResourceData {
  topics_to_review: string[];
  resources: TopicResource[];
  general_tip: string;
  error?: string;
  message?: string;
}

export interface EvaluationResult {
  name: string;
  results: QuizResult[];
  resources: ResourceData;
  youtubeResources: YouTubeResource[];
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
}
