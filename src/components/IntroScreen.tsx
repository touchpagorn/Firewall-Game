import React from 'react';
import { ShieldCheck, Play, BookOpen, Sparkles, CheckCircle2, Timer, Trophy, Settings } from 'lucide-react';

interface IntroScreenProps {
  onStartQuiz: () => void;
  onOpenQuestionBank: () => void;
  onOpenSetup: () => void;
  onOpenLeaderboard: () => void;
  timePerQuestion?: number;
  totalQuestionsInBank?: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartQuiz,
  onOpenQuestionBank,
  onOpenSetup,
  onOpenLeaderboard,
  timePerQuestion = 10,
  totalQuestionsInBank = 15,
}) => {
  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 sm:p-14 shadow-2xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/30 text-[#FFD100] text-xs font-bold uppercase tracking-widest mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Network Security Specialist Quiz</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
          เกมตอบคำถาม <span className="text-[#FFD100] italic">Firewall</span>
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-6 leading-relaxed">
          ทดสอบความรู้ความเข้าใจเกี่ยวกับระบบป้องกันเครือข่าย คุณสมบัติการทำงาน นโยบายความปลอดภัย และสถาปัตยกรรมของ Firewall
        </p>

        {/* Highlight Win Condition banner */}
        <div className="mb-10 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFD100]/10 via-[#FFD100]/20 to-[#FFD100]/10 border border-[#FFD100]/40 inline-flex items-center gap-3 text-sm font-semibold text-[#FFD100] shadow-lg">
          <Trophy className="w-5 h-5 text-[#FFD100] shrink-0" />
          <span>เป้าหมายภารกิจ: ต้องตอบถูกให้ได้ <strong className="text-white underline decoration-[#FFD100] decoration-2">3 ใน 5 ข้อขึ้นไป</strong> เพื่อเป็นผู้ชนะ!</span>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center text-[#FFD100] mb-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">สุ่มโจทย์ 5 ข้อ (6 ตัวเลือก A-F)</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              สุ่มโจทย์ 5 ข้อจากคลังคำถาม {totalQuestionsInBank} ข้อ พร้อมสุ่มลำดับตัวเลือก A-F ใหม่ทุกครั้ง
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2 relative overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center text-[#FFD100] mb-1">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">นับถอยหลัง {timePerQuestion} วินาที</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              จำกัดเวลาข้อละ <strong className="text-[#FFD100]">{timePerQuestion} วินาที</strong> หากหมดเวลาจะถือว่าตอบผิดและแสดงเฉลยทันที
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center text-[#FFD100] mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">เฉลยและอธิบายทันที</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              แสดงคำอธิบายความรู้เชิงลึกของ Firewall ทุกข้อทันทีที่ตอบหรือหมดเวลา
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#FFD100] hover:bg-[#ffe066] text-[#000000] font-black tracking-tight transition-all shadow-lg shadow-[#FFD100]/25 text-base cursor-pointer"
          >
            <Play className="w-5 h-5 fill-[#000000]" />
            <span>เริ่มเล่นเกม (จับเวลา {timePerQuestion} วิ/ข้อ)</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFD100]/20 border border-[#FFD100]/40 text-[#FFD100] font-bold hover:bg-[#FFD100] hover:text-[#000000] transition-all text-sm cursor-pointer shadow-md"
          >
            <Trophy className="w-4 h-4" />
            <span>Dashboard สรุปอันดับ</span>
          </button>

          <button
            onClick={onOpenQuestionBank}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10 hover:text-white transition-all text-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#FFD100]" />
            <span>คลังคำถาม ({totalQuestionsInBank})</span>
          </button>

          <button
            onClick={onOpenSetup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-bold hover:bg-white/10 hover:text-white transition-all text-sm cursor-pointer"
            title="ตั้งค่าเวลานับถอยหลังต่อข้อ และจัดการคลังคำถาม"
          >
            <Settings className="w-4 h-4" />
            <span>ตั้งค่าระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
