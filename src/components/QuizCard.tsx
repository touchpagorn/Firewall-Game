import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswer } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Timer, AlertCircle } from 'lucide-react';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (answer: UserAnswer) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  userAnswer?: UserAnswer;
  timePerQuestion?: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onNextQuestion,
  isLastQuestion,
  userAnswer,
  timePerQuestion = 10,
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    userAnswer ? userAnswer.selectedIndex : null
  );
  const [timeLeft, setTimeLeft] = useState<number>(timePerQuestion);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOptionIndex(userAnswer ? userAnswer.selectedIndex : null);
    setTimeLeft(timePerQuestion);
  }, [question.id, userAnswer, timePerQuestion]);

  const hasAnswered = selectedOptionIndex !== null || userAnswer !== undefined;
  const currentSelectedIndex = userAnswer ? userAnswer.selectedIndex : selectedOptionIndex;
  const isTimeout = userAnswer?.isTimeout || currentSelectedIndex === -1;

  // 10-second countdown effect
  useEffect(() => {
    if (hasAnswered) return;

    if (timeLeft <= 0) {
      // Time is up! Trigger timeout automatically
      setSelectedOptionIndex(-1);
      onAnswerSelected({
        questionId: question.id,
        selectedIndex: -1,
        isCorrect: false,
        isTimeout: true,
      });
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, hasAnswered, question.id, onAnswerSelected]);

  const handleOptionClick = (index: number) => {
    if (hasAnswered) return; // Prevent changing answer
    setSelectedOptionIndex(index);
    const isCorrect = index === question.correctIndex;
    onAnswerSelected({
      questionId: question.id,
      selectedIndex: index,
      isCorrect,
      isTimeout: false,
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'ง่าย':
        return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300';
      case 'ปานกลาง':
        return 'bg-amber-500/20 border-amber-500/30 text-amber-300';
      case 'ท้าทาย':
        return 'bg-rose-500/20 border-rose-500/30 text-rose-300';
      default:
        return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300';
    }
  };

  const getOptionButtonClass = (index: number) => {
    const isCorrect = index === question.correctIndex;
    const isSelected = index === currentSelectedIndex;

    if (!hasAnswered) {
      return 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 text-white/90';
    }

    if (isCorrect) {
      return 'bg-white/10 border-2 border-emerald-500/60 text-white ring-4 ring-emerald-500/10 shadow-[0_0_25px_rgba(16,185,129,0.25)]';
    }

    if (isSelected && !isCorrect) {
      return 'bg-white/10 border-2 border-rose-500/60 text-white ring-4 ring-rose-500/10 shadow-[0_0_25px_rgba(244,63,94,0.25)]';
    }

    return 'bg-white/[0.02] border border-white/5 text-white/40 opacity-60';
  };

  const getLetterCircleClass = (index: number) => {
    const isCorrect = index === question.correctIndex;
    const isSelected = index === currentSelectedIndex;

    if (!hasAnswered) {
      return 'bg-white/10 text-white/60 group-hover:text-cyan-400 group-hover:bg-cyan-500/10';
    }

    if (isCorrect) {
      return 'bg-emerald-500/20 text-emerald-400 font-bold';
    }

    if (isSelected && !isCorrect) {
      return 'bg-rose-500/20 text-rose-400 font-bold';
    }

    return 'bg-white/5 text-white/30';
  };

  const getTimerBadgeStyle = () => {
    if (timeLeft > 5) {
      return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
    }
    if (timeLeft > 3) {
      return 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    }
    return 'bg-rose-500/25 border-rose-500/60 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.35)]';
  };

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-5xl mx-auto">
      <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[36px] sm:rounded-[40px] p-6 sm:p-12 shadow-2xl transition-all relative overflow-hidden">
        {/* Top 10s Timer countdown bar */}
        {!hasAnswered && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft > 5
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                  : timeLeft > 3
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                  : 'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${(timeLeft / timePerQuestion) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Category, Difficulty & 10-Second Timer Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest">
              {question.category}
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${getDifficultyBadge(
                question.difficulty
              )}`}
            >
              ระดับ: {question.difficulty}
            </span>
          </div>

          {/* 10 seconds timer badge or status */}
          <div className="flex items-center gap-3">
            {!hasAnswered ? (
              <div
                className={`flex items-center gap-2 px-3.5 py-1 rounded-full border font-mono text-sm font-bold transition-all ${getTimerBadgeStyle()}`}
              >
                <Timer className="w-4 h-4 animate-spin-slow" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
              </div>
            ) : (
              <span className="text-xs font-mono text-white/40">
                {isTimeout ? 'หมดเวลา' : 'ตอบแล้ว'}
              </span>
            )}
            <span className="text-xs font-mono text-white/40 hidden sm:inline">
              โจทย์ข้อที่ #{question.id}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-xl sm:text-3xl font-medium leading-relaxed sm:leading-tight mb-8 sm:mb-10 text-white/95">
          {question.question}
        </h2>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {question.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D, E, F
            const isCorrect = idx === question.correctIndex;
            const isSelected = idx === currentSelectedIndex;

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={hasAnswered}
                className={`group relative flex items-center p-4 sm:p-5 rounded-2xl transition-all text-left ${getOptionButtonClass(
                  idx
                )} ${!hasAnswered ? 'cursor-pointer active:scale-[0.99]' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-mono mr-3.5 shrink-0 transition-all ${getLetterCircleClass(
                    idx
                  )}`}
                >
                  {letter}
                </div>

                <span className="text-sm sm:text-base flex-1 leading-snug">
                  {option}
                </span>

                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2.5" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Box (Visible after answering or timing out) */}
        {hasAnswered && (
          <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/15 text-white/90 transition-all animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {isTimeout ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>⏰ หมดเวลา {timePerQuestion} วินาที!</span>
                  </div>
                ) : currentSelectedIndex === question.correctIndex ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ถูกต้องเยี่ยมมาก!</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>ยังไม่ถูกต้อง</span>
                  </div>
                )}
                <span className="text-xs sm:text-sm text-white/60">
                  เฉลยที่ถูกต้องคือ <strong className="text-emerald-400">ข้อ {String.fromCharCode(65 + question.correctIndex)}</strong>
                </span>
              </div>

              <button
                onClick={onNextQuestion}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#FFD100] hover:bg-[#ffe066] text-[#000000] font-black tracking-tight transition-all shadow-lg shadow-[#FFD100]/20 cursor-pointer"
              >
                <span>{isLastQuestion ? 'ดูสรุปผลคะแนน' : 'ข้อถัดไป'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-3 text-sm sm:text-base text-white/80 leading-relaxed">
              <Sparkles className="w-5 h-5 text-[#FFD100] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#FFD100] font-semibold block mb-1">
                  คำอธิบายความรู้เรื่อง {question.category}:
                </strong>
                {question.explanation}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls (when user hasn't answered yet, show prompt) */}
      {!hasAnswered && (
        <div className="w-full max-w-4xl mt-6 px-4 flex justify-between items-center text-xs font-mono text-white/40 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#FFD100]" />
            <span>นับถอยหลัง {timePerQuestion} วินาที — เลือก 1 คำตอบก่อนหมดเวลา</span>
          </span>
          <span>Question {questionNumber} of {totalQuestions}</span>
        </div>
      )}
    </div>
  );
};
