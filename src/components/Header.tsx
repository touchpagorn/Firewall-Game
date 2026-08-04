import React from 'react';
import { ShieldCheck, BookOpen, RefreshCw, Trophy, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenQuestionBank: () => void;
  onOpenSetup: () => void;
  onOpenLeaderboard: () => void;
  onResetGame: () => void;
  isPlaying: boolean;
  score?: number;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  totalQuestionsInBank?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuestionBank,
  onOpenSetup,
  onOpenLeaderboard,
  onResetGame,
  isPlaying,
  score = 0,
  currentQuestionIndex = 1,
  totalQuestions = 5,
  totalQuestionsInBank = 15,
}) => {
  return (
    <header className="relative z-10 w-full p-4 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
          <ShieldCheck className="w-6 h-6 text-[#FFD100]" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">
            Firewall Defense Quiz
          </h1>
          <p className="text-xs text-[#FFD100] font-mono uppercase tracking-widest">
            Level: Network Security Specialist
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        {isPlaying && (
          <div className="flex gap-3">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-5 py-2 text-center min-w-[80px] sm:min-w-[100px]">
              <p className="text-[10px] text-white/50 uppercase font-bold">Question</p>
              <p className="text-lg sm:text-xl font-mono text-[#FFD100]">
                {currentQuestionIndex} / {totalQuestions}
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 sm:px-5 py-2 text-center min-w-[90px] sm:min-w-[110px]">
              <p className="text-[10px] text-white/50 uppercase font-bold flex items-center justify-center gap-1">
                <span>Correct</span>
                <span className="text-[9px] text-[#FFD100] font-normal">(เกณฑ์ 3/5)</span>
              </p>
              <p className="text-lg sm:text-xl font-mono text-white">
                <span className={score >= 3 ? 'text-[#FFD100] font-bold' : 'text-white'}>{score}</span>
                <span className="text-xs text-white/40"> / {totalQuestions}</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isPlaying && (
            <button
              onClick={onResetGame}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-[#FFD100]/50 transition-all cursor-pointer"
              title="เริ่มสุ่มชุดคำถามใหม่"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">สุ่มใหม่</span>
            </button>
          )}

          <button
            onClick={onOpenLeaderboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FFD100]/20 border border-[#FFD100]/40 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#000000] transition-all cursor-pointer shadow-sm"
            title="ดู Dashboard ผู้ทำได้ 5 คะแนนเต็ม"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          <button
            onClick={onOpenQuestionBank}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FFD100]" />
            <span>คลังคำถาม ({totalQuestionsInBank})</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFD100]/15 border border-[#FFD100]/30 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#000000] transition-all cursor-pointer shadow-sm"
            title="ตั้งค่าเวลานับถอยหลัง / เพิ่มหรือแก้ไขคำถาม"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ตั้งค่าระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

