import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion, UserAnswer } from '../types';
import { saveLeaderboardEntry } from '../utils/storage';
import {
  RefreshCw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Award,
  ShieldCheck,
  Sparkles,
  Trophy,
  AlertTriangle,
  Clock,
  Send,
  User,
  Mail,
  Zap,
} from 'lucide-react';

interface ResultScreenProps {
  questions: QuizQuestion[];
  answers: UserAnswer[];
  durationSeconds: number;
  onPlayAgain: () => void;
  onOpenQuestionBank: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  answers,
  durationSeconds,
  onPlayAgain,
  onOpenQuestionBank,
  onOpenLeaderboard,
}) => {
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalCount = questions.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const isWin = correctCount >= 3;
  const isPerfectScore = correctCount === 5;

  // Form State for 5/5 score submission
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isWin) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b'],
      });
    }
  }, [isWin]);

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setFormError('กรุณากรอกชื่อของคุณ');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setFormError('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }

    setFormError('');
    saveLeaderboardEntry({
      name: userName.trim(),
      email: userEmail.trim(),
      durationSeconds: Math.max(1, durationSeconds),
      score: correctCount,
      totalQuestions: totalCount,
    });
    setIsSubmitted(true);
  };

  const getRankBadge = () => {
    if (correctCount === 5) {
      return {
        title: '🏆 Legendary Firewall Architect',
        desc: 'ยอดเยี่ยมที่สุด! คุณตอบถูกครบ 5/5 ข้อ เข้าใจระบบความปลอดภัยเครือข่ายระดับสมบูรณ์แบบ',
        badgeClass: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      };
    }
    if (correctCount === 4) {
      return {
        title: '🛡️ Senior Network Security Specialist',
        desc: 'ดีเยี่ยม! คุณตอบถูก 4/5 ข้อ ผ่านเกณฑ์ชัยชนะในระดับผู้เชี่ยวชาญ Firewall',
        badgeClass: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      };
    }
    if (correctCount === 3) {
      return {
        title: '⚙️ Security Engineer',
        desc: 'ยินดีด้วย! คุณตอบถูก 3/5 ข้อ ผ่านเกณฑ์ชัยชนะที่กำหนดไว้สำเร็จ',
        badgeClass: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      };
    }
    return {
      title: '📚 Junior Security Trainee',
      desc: `คุณตอบถูก ${correctCount}/5 ข้อ ยังไม่ถึงเกณฑ์ชัยชนะ (ต้องการอย่างน้อย 3 ใน 5 ข้อ) ลองทบทวนความรู้ในคลังคำถามแล้วท้าทายใหม่นะครับ!`,
      badgeClass: 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]',
    };
  };

  const rank = getRankBadge();

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-5xl mx-auto overflow-y-auto">
      <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-6 sm:p-12 shadow-2xl my-4">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          {/* Win / Lose Status Banner */}
          <div className="mb-6 flex flex-col items-center gap-3">
            {isWin ? (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-300 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 animate-bounce">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>MISSION SUCCESS — ยินดีด้วย คุณเป็นผู้ชนะ! (ผ่านเกณฑ์ 3/5 ข้อ)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 border-2 border-rose-500/60 text-rose-300 font-bold text-sm tracking-wide shadow-lg shadow-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>MISSION FAILED — ยังไม่ผ่านเกณฑ์ชัยชนะ (ต้องการ 3 ใน 5 ข้อ)</span>
              </div>
            )}

            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${rank.badgeClass}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{rank.title}</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            สรุปผลการทดสอบ
          </h2>
          <p className="text-base sm:text-lg text-white/70 mb-8">{rank.desc}</p>

          {/* Score Stats Card */}
          <div className="grid grid-cols-3 gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase mb-1">ตอบถูก</p>
              <p
                className={`text-2xl sm:text-3xl font-mono font-bold ${
                  isWin ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {correctCount} <span className="text-sm text-white/50">/ {totalCount}</span>
              </p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-xs font-bold text-white/50 uppercase mb-1">เวลาที่ใช้</p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-[#FFD100]">
                {durationSeconds} <span className="text-xs text-white/50 font-sans">วิ</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase mb-1">สถานะเกม</p>
              <p
                className={`text-sm sm:text-base font-bold pt-1 ${
                  isWin ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isWin ? '✅ ชนะเกม' : '❌ ต้องแก้ตัว'}
              </p>
            </div>
          </div>

          {/* Special Registration Form for Perfect Score 5/5 */}
          {isPerfectScore && (
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#FFD100]/15 to-[#FFD100]/5 border-2 border-[#FFD100]/50 shadow-[0_0_30px_rgba(255,209,0,0.15)] text-left max-w-lg mx-auto animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD100] text-black flex items-center justify-center shrink-0 font-bold shadow-md">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    🎉 ลงบันทึกสถิติ 5 คะแนนเต็ม!
                  </h3>
                  <p className="text-xs text-white/70">
                    เวลาสปีดรันของคุณ: <strong className="text-[#FFD100]">{durationSeconds} วินาที</strong>
                  </p>
                </div>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmitRecord} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                      ⚠️ {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">
                      ชื่อผู้ทำแบบทดสอบ *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="กรอกชื่อ-นามสกุล หรือ ฉายา..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1.5">
                      อีเมล (Email) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="example@domain.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/20 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white/80">
                    <span className="flex items-center gap-1.5 font-bold text-white/60">
                      <Zap className="w-4 h-4 text-[#FFD100]" />
                      ระยะเวลาจากระบบ:
                    </span>
                    <span className="font-mono font-bold text-[#FFD100] text-sm">
                      {durationSeconds} วินาที
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#FFD100] hover:bg-[#ffe066] text-black font-extrabold text-sm transition-all shadow-lg shadow-[#FFD100]/25 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>บันทึกสถิติลง Dashboard Leaderboard</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-300">
                    บันทึกสถิติลง Leaderboard เรียบร้อยแล้ว!
                  </h4>
                  <p className="text-xs text-white/70">
                    ขอบคุณที่ร่วมสนุก คุณสามารถเปิดดูตารางอันดับผู้นำได้ทันที
                  </p>
                  <button
                    onClick={onOpenLeaderboard}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>ดูตารางคะแนน Leaderboard</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
            <button
              onClick={onPlayAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#FFD100] hover:bg-[#ffe066] text-[#000000] font-black tracking-tight transition-all shadow-lg shadow-[#FFD100]/25 text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>เล่นใหม่อีกครั้ง (สุ่ม 5 ข้อใหม่)</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFD100]/15 border border-[#FFD100]/30 text-[#FFD100] font-bold hover:bg-[#FFD100]/25 transition-all cursor-pointer text-sm"
            >
              <Trophy className="w-4 h-4" />
              <span>ดู Dashboard (Leaderboard)</span>
            </button>

            <button
              onClick={onOpenQuestionBank}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10 hover:text-white transition-all cursor-pointer text-sm"
            >
              <BookOpen className="w-4 h-4 text-[#FFD100]" />
              <span>ดูคลังคำถาม</span>
            </button>
          </div>
        </div>

        {/* Breakdown of 5 Questions */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFD100]" />
            <span>สรุปรายละเอียดข้อที่ตอบในรอบนี้ ({questions.length} ข้อ)</span>
          </h3>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const answer = answers.find((a) => a.questionId === question.id);
              const isCorrect = answer?.isCorrect ?? false;
              const isTimeout = answer?.isTimeout ?? false;
              const selectedIdx = answer?.selectedIndex ?? -1;

              return (
                <div
                  key={question.id}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : isTimeout
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-rose-500/5 border-rose-500/30'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-white/10 font-mono text-xs font-bold flex items-center justify-center text-white/80">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                        {question.category}
                      </span>
                      <span className="text-xs font-mono text-white/40">
                        (โจทย์ #{question.id})
                      </span>
                    </div>

                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ถูกต้อง (+1)</span>
                      </span>
                    ) : isTimeout ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                        <Clock className="w-4 h-4" />
                        <span>หมดเวลา (0)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
                        <XCircle className="w-4 h-4" />
                        <span>ไม่ถูกต้อง (0)</span>
                      </span>
                    )}
                  </div>

                  <p className="text-base sm:text-lg font-medium text-white/95 mb-4 leading-snug">
                    {question.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                    {question.options.map((option, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isThisCorrect = optIdx === question.correctIndex;
                      const isThisSelected = optIdx === selectedIdx;

                      let itemStyle = 'bg-white/5 border-white/5 text-white/60';
                      if (isThisCorrect) {
                        itemStyle =
                          'bg-emerald-500/15 border-emerald-500/50 text-white font-semibold';
                      } else if (isThisSelected && !isThisCorrect) {
                        itemStyle =
                          'bg-rose-500/15 border-rose-500/50 text-white/90 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border ${itemStyle}`}
                        >
                          <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                            {letter}
                          </span>
                          <span className="flex-1 truncate">{option}</span>
                          {isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isThisSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed">
                    <strong className="text-[#FFD100] font-bold mr-1">
                      💡 คำอธิบาย:
                    </strong>
                    {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
