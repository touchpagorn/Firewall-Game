import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswer, QuizStatus } from './types';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { QuizCard } from './components/QuizCard';
import { ResultScreen } from './components/ResultScreen';
import { QuestionBankModal } from './components/QuestionBankModal';
import { SetupModal } from './components/SetupModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import {
  getStoredSettings,
  getStoredQuestions,
  getRandomQuestionsFromStore,
} from './utils/storage';

export default function App() {
  const [status, setStatus] = useState<QuizStatus>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState<boolean>(false);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // Time & Speedrun Tracking State
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(0);

  // Settings & Storage State
  const [timePerQuestion, setTimePerQuestion] = useState<number>(10);
  const [totalQuestionsInBank, setTotalQuestionsInBank] = useState<number>(15);

  const loadCurrentStorageData = () => {
    const settings = getStoredSettings();
    const storedQs = getStoredQuestions();
    setTimePerQuestion(settings.timePerQuestion);
    setTotalQuestionsInBank(storedQs.length);
  };

  useEffect(() => {
    loadCurrentStorageData();
  }, []);

  const startNewGame = () => {
    const randomFive = getRandomQuestionsFromStore(5);
    setQuestions(randomFive);
    setCurrentIndex(0);
    setAnswers([]);
    setQuizStartTime(Date.now());
    setTotalDurationSeconds(0);
    setStatus('playing');
  };

  const handleAnswerSelected = (answer: UserAnswer) => {
    setAnswers((prev) => {
      const existingIdx = prev.findIndex((a) => a.questionId === answer.questionId);
      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = answer;
        return copy;
      }
      return [...prev, answer];
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const elapsed = Math.max(1, Math.round((Date.now() - quizStartTime) / 1000));
      setTotalDurationSeconds(elapsed);
      setStatus('result');
    }
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers.find((a) => a.questionId === currentQuestion.id)
    : undefined;

  const score = answers.filter((a) => a.isCorrect).length;
  const progressPercent =
    questions.length > 0
      ? Math.round(((currentIndex + (currentAnswer ? 1 : 0)) / questions.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-[#FFD100] selection:text-[#000000]">
      {/* Mesh Background Blobs (#FFD100 golden accent on #000000 black theme) */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#FFD100]/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-[#FFD100]/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFD100]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Navigation / Stats Header */}
      <Header
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onResetGame={startNewGame}
        isPlaying={status === 'playing' || status === 'result'}
        score={score}
        currentQuestionIndex={currentIndex + 1}
        totalQuestions={questions.length || 5}
        totalQuestionsInBank={totalQuestionsInBank}
      />

      {/* Progress Bar (Visible during gameplay) */}
      {status === 'playing' && (
        <div className="relative z-10 px-4 sm:px-8 pt-4 w-full max-w-5xl mx-auto">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FFD100] to-[#FFE066] shadow-[0_0_10px_rgba(255,209,0,0.5)] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-tighter">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>Challenge Pool: {totalQuestionsInBank} Randomized</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col w-full">
        {status === 'intro' && (
          <IntroScreen
            onStartQuiz={startNewGame}
            onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
            onOpenSetup={() => setIsSetupOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            timePerQuestion={timePerQuestion}
            totalQuestionsInBank={totalQuestionsInBank}
          />
        )}

        {status === 'playing' && currentQuestion && (
          <QuizCard
            key={currentQuestion.id}
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            onAnswerSelected={handleAnswerSelected}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentIndex === questions.length - 1}
            userAnswer={currentAnswer}
            timePerQuestion={timePerQuestion}
          />
        )}

        {status === 'result' && (
          <ResultScreen
            questions={questions}
            answers={answers}
            durationSeconds={totalDurationSeconds}
            onPlayAgain={startNewGame}
            onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* Question Bank Modal */}
      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
      />

      {/* Setup & Management Modal */}
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onSettingsUpdated={loadCurrentStorageData}
      />

      {/* Leaderboard / Dashboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
}

