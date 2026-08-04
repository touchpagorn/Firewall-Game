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

export function getRandomQuestionsFromStore(count: number = 5): QuizQuestion[] {
  const allQuestions = getStoredQuestions();
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
