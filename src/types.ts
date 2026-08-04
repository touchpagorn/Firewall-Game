export interface QuizQuestion {
  id: number;
  question: string;
  options: string[]; // array of choices (6 options A-F)
  correctIndex: number; // 0 to 5
  category: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย';
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  selectedIndex: number; // -1 if timeout
  isCorrect: boolean;
  isTimeout?: boolean;
}

export type QuizStatus = 'intro' | 'playing' | 'result';

export interface QuizSettings {
  timePerQuestion: number; // in seconds (e.g., 5, 10, 15, 20, 30, 60)
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  durationSeconds: number;
  score: number;
  totalQuestions: number;
  timestamp: number;
}
