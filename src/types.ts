export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctIndex: number; // 0 to 3
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
