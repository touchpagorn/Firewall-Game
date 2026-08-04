import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { getStoredQuestions } from '../utils/storage';
import { X, Search, ShieldCheck, CheckCircle2, HelpCircle, Filter } from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ทั้งหมด');
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAllQuestions(getStoredQuestions());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ['ทั้งหมด', ...Array.from(new Set(allQuestions.map(q => q.category)))];
  const difficulties = ['ทั้งหมด', 'ง่าย', 'ปานกลาง', 'ท้าทาย'];

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ทั้งหมด' || q.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'ทั้งหมด' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'ง่าย':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ปานกลาง':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'ท้าทาย':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-[#FFD100]/20 text-[#FFD100] border-[#FFD100]/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-white/15 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-white my-auto">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center text-[#FFD100]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                คลังคำถาม Firewall ทั้งหมด ({allQuestions.length} ข้อ)
              </h2>
              <p className="text-xs sm:text-sm text-[#FFD100]/80">
                ศึกษารายละเอียดโจทย์ ตัวเลือก เฉลย และคำอธิบายความรู้
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search bar */}
        <div className="p-4 sm:px-8 sm:py-5 border-b border-white/10 bg-white/[0.01] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาคำถาม, ตัวเลือก, หรือคำอธิบาย..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#FFD100]/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Filter className="w-3.5 h-3.5" />
              <span>หมวดหมู่:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#0a0a0a] border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFD100]/50 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs bg-[#0a0a0a] border border-white/15 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFD100]/50 cursor-pointer"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  ระดับ: {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-base">ไม่พบคำถามที่ตรงกับเงื่อนไขที่ค้นหา</p>
            </div>
          ) : (
            filteredQuestions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#FFD100]/30 transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#FFD100]/20 border border-[#FFD100]/30 text-[#FFD100] font-mono text-xs font-bold flex items-center justify-center">
                      #{q.id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                      {q.category}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full border ${getDifficultyColor(
                      q.difficulty
                    )}`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-medium text-white/95 leading-relaxed">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((option, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                            : 'bg-white/5 border-white/5 text-white/60'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="text-sm leading-snug flex-1">
                          {option}
                        </span>
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/80 leading-relaxed flex gap-3">
                  <span className="text-[#FFD100] font-bold shrink-0">
                    💡 คำอธิบาย:
                  </span>
                  <span>{q.explanation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 sm:py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-white/50">
            แสดง {filteredQuestions.length} จากทั้งหมด {allQuestions.length} ข้อ
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#FFD100] hover:bg-[#ffe066] text-[#000000] font-bold text-sm transition-all shadow-lg shadow-[#FFD100]/20 cursor-pointer"
          >
            ปิดคลังคำถาม
          </button>
        </div>
      </div>
    </div>
  );
};
