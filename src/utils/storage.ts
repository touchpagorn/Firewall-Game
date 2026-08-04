import { QuizQuestion, QuizSettings } from '../types';
import { FIREWALL_QUESTIONS } from '../data/firewallQuestions';

const SETTINGS_KEY = 'firewall_quiz_settings';
const QUESTIONS_KEY = 'firewall_custom_questions';

const DEFAULT_SETTINGS: QuizSettings = {
  timePerQuestion: 10,
};

export function getStoredSettings(): QuizSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        timePerQuestion: typeof parsed.timePerQuestion === 'number' ? parsed.timePerQuestion : 10,
      };
    }
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: QuizSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export function getStoredQuestions(): QuizQuestion[] {
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load questions from localStorage:', err);
  }
  return FIREWALL_QUESTIONS;
}

export function saveStoredQuestions(questions: QuizQuestion[]): void {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions to localStorage:', err);
  }
}

export function resetStoredQuestions(): QuizQuestion[] {
  try {
    localStorage.removeItem(QUESTIONS_KEY);
  } catch (err) {
    console.error('Failed to clear stored questions:', err);
  }
  return FIREWALL_QUESTIONS;
}

/**
 * Shuffles the choices (options) of a question while preserving the correct answer index mapping.
 */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  if (!question.options || question.options.length <= 1) return question;

  const correctAnswerText = question.options[question.correctIndex] ?? question.options[0];
  const shuffledOptions = [...question.options];

  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }

  const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

  return {
    ...question,
    options: shuffledOptions,
    correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

export function getRandomQuestionsFromStore(count: number = 5): QuizQuestion[] {
  const allQuestions = getStoredQuestions();
  const shuffledQuestions = [...allQuestions];
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
  }
  const selected = shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));

  // Randomize choices order (A-F) for each selected question
  return selected.map((q) => shuffleQuestionOptions(q));
}
