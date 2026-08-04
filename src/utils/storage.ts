import { QuizQuestion, QuizSettings, LeaderboardEntry } from '../types';
import { FIREWALL_QUESTIONS } from '../data/firewallQuestions';

const SETTINGS_KEY = 'firewall_quiz_settings';
const QUESTIONS_KEY = 'firewall_custom_questions';
const LEADERBOARD_KEY = 'firewall_quiz_leaderboard';

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

/**
 * Leaderboard & Speedrun Storage Helpers
 */
export function getStoredLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load leaderboard:', err);
  }
  return [];
}

export function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>
): LeaderboardEntry {
  const current = getStoredLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: 'lb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: Date.now(),
  };

  const updated = [...current, newEntry];

  // Sort primarily by durationSeconds ascending (fastest time first), then by timestamp ascending
  updated.sort((a, b) => {
    if (a.durationSeconds !== b.durationSeconds) {
      return a.durationSeconds - b.durationSeconds;
    }
    return a.timestamp - b.timestamp;
  });

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save leaderboard entry:', err);
  }

  return newEntry;
}

export function resetLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch (err) {
    console.error('Failed to reset leaderboard:', err);
  }
}

export function exportLeaderboardToCSV(entries: LeaderboardEntry[]): void {
  // Sort entries by duration (fastest time first)
  const sorted = [...entries].sort((a, b) => {
    if (a.durationSeconds !== b.durationSeconds) {
      return a.durationSeconds - b.durationSeconds;
    }
    return a.timestamp - b.timestamp;
  });

  const headers = [
    'ลำดับ (Rank)',
    'ชื่อผู้ทำแบบทดสอบ (Name)',
    'อีเมล (Email)',
    'เวลาที่ใช้ (วินาที)',
    'คะแนนที่ได้',
    'จำนวนข้อทั้งหมด',
    'วันที่บันทึกสถิติ',
  ];

  const rows = sorted.map((entry, idx) => {
    const dateStr = new Date(entry.timestamp).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const safeName = `"${(entry.name || '').replace(/"/g, '""')}"`;
    const safeEmail = `"${(entry.email || '').replace(/"/g, '""')}"`;

    return [
      idx + 1,
      safeName,
      safeEmail,
      entry.durationSeconds,
      entry.score,
      entry.totalQuestions,
      `"${dateStr}"`,
    ].join(',');
  });

  // Include UTF-8 BOM (\uFEFF) so Excel displays Thai characters properly without corrupting encoding
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `firewall_quiz_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
