import api from "./api";

export interface QuizQuestion {
  id: number;
  questionText: string;
  englishWord: string;
  uzbekWord: string | null;
  options: string[];
}

export interface Quiz {
  id: number;
  quizType: 'UNIT' | 'CATEGORY' | 'RANDOM';
  sourceId: number;
  createdAt: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
}

export interface QuizResult {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    coins: number;
  };
  quizId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  completedAt: string;
  timeTaken: number | null;
  averageTimePerQuestion: number | null;
  questionTimes: number[];
  isAudioQuiz: boolean;
}

export const quizService = {
  generateQuiz: async (quizType: 'UNIT' | 'CATEGORY' | 'RANDOM', sourceId: number, direction: 'uz-en' | 'en-uz' = 'uz-en'): Promise<Quiz> => {
    const response = await api.get(`/quizzes/generate?quizType=${quizType}&sourceId=${sourceId}&direction=${direction}`);
    return response.data;
  },

  submitQuiz: async (quizId: number, answers: QuizAnswer[]): Promise<void> => {
    await api.post(`/quizzes/submit?quizId=${quizId}`, answers);
  },

  getQuizResults: async (): Promise<QuizResult[]> => {
    const response = await api.get('/quizzes/results');
    return response.data;
  },

  getQuizResultById: async (id: number): Promise<QuizResult> => {
    const response = await api.get(`/quizzes/result/${id}`);
    return response.data;
  }
};