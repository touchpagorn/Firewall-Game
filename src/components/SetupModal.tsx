import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizSettings } from '../types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredQuestions,
  saveStoredQuestions,
  resetStoredQuestions,
} from '../utils/storage';
import {
  X,
  Timer,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Check,
  AlertCircle,
  Search,
  CheckCircle2,
  ShieldCheck,
  Save,
  HelpCircle,
} from 'lucide-react';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: () => void;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'timer' | 'questions'>('timer');
  const [settings, setSettings] = useState<QuizSettings>({ timePerQuestion: 10 });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  
  // Editor Form state (null = list view, 'add' or editing question id)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form Fields
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formCategory, setFormCategory] = useState('คุณสมบัติและการทำงาน');
  const [formDifficulty, setFormDifficulty] = useState<'ง่าย' | 'ปานกลาง' | 'ท้าทาย'>('ง่าย');
  const [formExplanation, setFormExplanation] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredSettings());
      setQuestions(getStoredQuestions());
      setEditingQuestion(null);
      setIsAdding(false);
      setSuccessMsg('');
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveTimer = (newTime: number) => {
    const updated = { timePerQuestion: newTime };
    setSettings(updated);
    saveStoredSettings(updated);
    onSettingsUpdated();
    showSuccessToast(`บันทึกเวลานับถอยหลังเป็น ${newTime} วินาทีเรียบร้อยแล้ว`);
  };

  const showSuccessToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  // Prepare categories for filtering
  const categories = ['ทั้งหมด', ...Array.from(new Set(questions.map((q) => q.category)))];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ทั้งหมด' || q.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartAdd = () => {
    setEditingQuestion(null);
    setIsAdding(true);
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormCategory('คุณสมบัติและการทำงาน');
    setFormDifficulty('ง่าย');
    setFormExplanation('');
    setFormError('');
  };

  const handleStartEdit = (q: QuizQuestion) => {
    setIsAdding(false);
    setEditingQuestion(q);
    setFormQuestion(q.question);
    setFormOptions([...q.options] as [string, string, string, string]);
    setFormCorrectIndex(q.correctIndex);
    setFormCategory(q.category);
    setFormDifficulty(q.difficulty);
    setFormExplanation(q.explanation);
    setFormError('');
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingQuestion(null);
    setFormError('');
  };

  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      setFormError('กรุณากรอกคำถาม');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      setFormError('กรุณากรอกตัวเลือกให้ครบทั้ง 4 ข้อ');
      return;
    }
    if (!formExplanation.trim()) {
      setFormError('กรุณากรอกคำอธิบายเฉลย');
      return;
    }

    if (isAdding) {
      const newId =
        questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      const newQuestion: QuizQuestion = {
        id: newId,
        question: formQuestion.trim(),
        options: formOptions.map((opt) => opt.trim()) as [string, string, string, string],
        correctIndex: formCorrectIndex,
        category: formCategory.trim() || 'ทั่วไป',
        difficulty: formDifficulty,
        explanation: formExplanation.trim(),
      };
      const updatedList = [newQuestion, ...questions];
      setQuestions(updatedList);
      saveStoredQuestions(updatedList);
      showSuccessToast('เพิ่มคำถามใหม่เข้าสู่คลังเรียบร้อยแล้ว');
    } else if (editingQuestion) {
      const updatedList = questions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              question: formQuestion.trim(),
              options: formOptions.map((opt) => opt.trim()) as [string, string, string, string],
              correctIndex: formCorrectIndex,
              category: formCategory.trim() || 'ทั่วไป',
              difficulty: formDifficulty,
              explanation: formExplanation.trim(),
            }
          : q
      );
      setQuestions(updatedList);
      saveStoredQuestions(updatedList);
      showSuccessToast(`แก้ไขคำถามข้อที่ #${editingQuestion.id} เรียบร้อยแล้ว`);
    }

    setIsAdding(false);
    setEditingQuestion(null);
    onSettingsUpdated();
  };

  const handleDeleteQuestion = (id: number) => {
    if (questions.length <= 5) {
      alert('ระบบต้องการคำถามอย่างน้อย 5 ข้อสำหรับการสุ่มเล่นเกม ไม่สามารถลบเพิ่มได้ครับ');
      return;
    }
    if (window.confirm(`ยืนยันการลบคำถามข้อที่ #${id} ออกจากระบบ?`)) {
      const updatedList = questions.filter((q) => q.id !== id);
      setQuestions(updatedList);
      saveStoredQuestions(updatedList);
      onSettingsUpdated();
      showSuccessToast('ลบคำถามออกจากระบบเรียบร้อยแล้ว');
    }
  };

  const handleResetDefaultQuestions = () => {
    if (window.confirm('คุณต้องการรีเซ็ตคลังคำถามกลับเป็นค่าเริ่มต้น 15 ข้อของระบบหรือไม่? (คำถามที่เพิ่มเองจะหายไป)')) {
      const defaultList = resetStoredQuestions();
      setQuestions(defaultList);
      onSettingsUpdated();
      showSuccessToast('รีเซ็ตคลังคำถามเป็นค่าเริ่มต้น 15 ข้อเรียบร้อยแล้ว');
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const copy = [...formOptions] as [string, string, string, string];
    copy[index] = val;
    setFormOptions(copy);
  };

  const timerPresets = [5, 10, 15, 20, 30, 60];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/40 flex items-center justify-center text-[#FFD100]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>ตั้งค่าระบบและจัดการคำถาม (Setup System)</span>
              </h3>
              <p className="text-xs text-white/50">
                ปรับตั้งค่าเวลานับถอยหลังต่อข้อ และเพิ่ม/แก้ไข/ลบ คำถามในคลัง
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="ปิดหน้าต่างตั้งค่า"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 text-emerald-300 text-sm font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-6 gap-2">
          <button
            onClick={() => {
              setActiveTab('timer');
              setIsAdding(false);
              setEditingQuestion(null);
            }}
            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'timer'
                ? 'border-[#FFD100] text-[#FFD100]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>1. ตั้งค่าเวลานับถอยหลัง</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('questions');
              setIsAdding(false);
              setEditingQuestion(null);
            }}
            className={`flex items-center gap-2 py-3.5 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'border-[#FFD100] text-[#FFD100]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>2. จัดการคลังคำถาม ({questions.length} ข้อ)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TIMER SETUP */}
          {activeTab === 'timer' && (
            <div className="space-y-8 max-w-2xl mx-auto py-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center text-[#FFD100] shrink-0">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      ระยะเวลานับถอยหลังต่อข้อ (Timer per Question)
                    </h4>
                    <p className="text-xs text-white/60 mt-1">
                      กำหนดระยะเวลาตอบคำถามในแต่ละข้อ หากหมดเวลา ระบบจะถือว่าตอบผิดและแสดงเฉลยทันที
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-widest block mb-3">
                    เลือกระยะเวลามาตรฐาน (วินาที)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {timerPresets.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSaveTimer(t)}
                        className={`py-3 px-4 rounded-xl font-mono font-bold text-sm border transition-all cursor-pointer ${
                          settings.timePerQuestion === t
                            ? 'bg-[#FFD100] text-[#000000] border-[#FFD100] shadow-lg shadow-[#FFD100]/25'
                            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        {t} วิ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Timer Input */}
                <div className="pt-4 border-t border-white/10">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-widest block mb-2">
                    หรือกำหนดเวลาเอง (วินาที)
                  </label>
                  <div className="flex items-center gap-3 max-w-xs">
                    <input
                      type="number"
                      min="3"
                      max="300"
                      value={settings.timePerQuestion}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 3) {
                          handleSaveTimer(val);
                        }
                      }}
                      className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-2.5 font-mono text-white text-sm focus:outline-none focus:border-[#FFD100]"
                    />
                    <span className="text-sm font-mono text-white/60 shrink-0">วินาที</span>
                  </div>
                </div>
              </div>

              {/* Current Settings Status Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFD100]/10 via-emerald-500/10 to-[#FFD100]/10 border border-[#FFD100]/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#FFD100] shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">ค่าที่บันทึกในระบบปัจจุบัน</p>
                    <p className="text-xs text-white/70">
                      ผู้เล่นจะมีเวลาตอบคำถาม <strong className="text-[#FFD100]">{settings.timePerQuestion} วินาที</strong> ต่อ 1 ข้อ
                    </p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-[#FFD100] text-[#000000] font-mono font-bold text-sm shrink-0">
                  {settings.timePerQuestion}s
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS MANAGEMENT */}
          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* If ADD or EDIT form is open */}
              {(isAdding || editingQuestion) ? (
                <form
                  onSubmit={handleSaveQuestionForm}
                  className="p-6 rounded-2xl bg-white/5 border border-white/15 space-y-5 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h4 className="text-base font-bold text-[#FFD100] flex items-center gap-2">
                      {isAdding ? (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>เพิ่มคำถามใหม่เข้าสู่คลัง (Add Question)</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-5 h-5" />
                          <span>แก้ไขคำถามข้อที่ #{editingQuestion?.id}</span>
                        </>
                      )}
                    </h4>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="text-xs font-bold text-white/60 hover:text-white py-1 px-3 rounded-lg hover:bg-white/10 transition-all"
                    >
                      ยกเลิก (Cancel)
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-2">
                      1. โจทย์คำถาม (Question Text) *
                    </label>
                    <textarea
                      rows={2}
                      value={formQuestion}
                      onChange={(e) => setFormQuestion(e.target.value)}
                      placeholder="กรอกโจทย์คำถามเกี่ยวกับ Firewall..."
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFD100]"
                      required
                    />
                  </div>

                  {/* Options (A, B, C, D) & Correct Radio */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-2">
                      2. ตัวเลือกคำตอบ 4 ข้อ และเลือกข้อที่ถูกต้อง (Correct Option) *
                    </label>
                    <div className="space-y-2.5">
                      {formOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                            formCorrectIndex === idx
                              ? 'bg-[#FFD100]/10 border-[#FFD100]/50'
                              : 'bg-black/30 border-white/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="correctOption"
                            checked={formCorrectIndex === idx}
                            onChange={() => setFormCorrectIndex(idx)}
                            className="w-4 h-4 accent-[#FFD100] cursor-pointer shrink-0"
                            title="เลือกให้ตัวเลือกนี้เป็นคำตอบที่ถูกต้อง"
                          />
                          <span className="w-6 h-6 rounded-lg bg-white/10 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            placeholder={`ตัวเลือกข้อ ${String.fromCharCode(65 + idx)}...`}
                            className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none"
                            required
                          />
                          {formCorrectIndex === idx && (
                            <span className="text-xs font-bold text-[#FFD100] shrink-0 px-2">
                              ✓ คำตอบที่ถูกต้อง
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category & Difficulty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-2">
                        3. หมวดหมู่ความรู้ (Category)
                      </label>
                      <input
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="เช่น คุณสมบัติและการทำงาน, นโยบายความปลอดภัย"
                        className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FFD100]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-2">
                        4. ระดับความยาก (Difficulty)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['ง่าย', 'ปานกลาง', 'ท้าทาย'] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormDifficulty(level)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              formDifficulty === level
                                ? 'bg-[#FFD100] text-[#333333] border-[#FFD100]'
                                : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-2">
                      5. คำอธิบายเฉลย (Explanation) *
                    </label>
                    <textarea
                      rows={3}
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      placeholder="อธิบายเหตุผลหรือความรู้เสริมของข้อนี้เมื่อผู้ใช้ตอบเสร็จหรือหมดเวลา..."
                      className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FFD100]"
                      required
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFD100] hover:bg-[#ffe066] text-[#333333] font-bold text-xs transition-all shadow-lg shadow-[#FFD100]/20 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isAdding ? 'บันทึกคำถามใหม่' : 'บันทึกการแก้ไข'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* LIST VIEW WITH ACTION BAR */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {/* Search Input */}
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="ค้นหาโจทย์ หรือ คำอธิบาย..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#FFD100]"
                        />
                      </div>

                      {/* Category Filter */}
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/90 focus:outline-none focus:border-[#FFD100]"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#333333] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleStartAdd}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD100] hover:bg-[#ffe066] text-[#333333] font-bold text-xs transition-all shadow-lg shadow-[#FFD100]/20 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>เพิ่มคำถามใหม่</span>
                      </button>

                      <button
                        onClick={handleResetDefaultQuestions}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-white/70 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                        title="รีเซ็ตคำถามทั้งหมดเป็น 15 ข้อค่าเริ่มต้น"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">รีเซ็ตค่าเริ่มต้น</span>
                      </button>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3">
                    {filteredQuestions.length === 0 ? (
                      <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/10">
                        <HelpCircle className="w-8 h-8 text-white/30 mx-auto mb-2" />
                        <p className="text-sm font-bold text-white/70">ไม่พบข้อคำถามตามคำค้นหา</p>
                      </div>
                    ) : (
                      filteredQuestions.map((q) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-white/10 font-mono text-xs font-bold text-white">
                                #{q.id}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/30 text-[#FFD100] text-[11px] font-bold">
                                {q.category}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px]">
                                {q.difficulty}
                              </span>
                            </div>

                            {/* Actions (Edit / Delete) */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleStartEdit(q)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
                                title="แก้ไขข้อนี้"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-white/60 hover:text-rose-400 transition-all cursor-pointer"
                                title="ลบข้อนี้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Question */}
                          <p className="text-sm font-bold text-white leading-relaxed">
                            {q.question}
                          </p>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt, idx) => (
                              <div
                                key={idx}
                                className={`p-2 rounded-xl border flex items-center gap-2 ${
                                  idx === q.correctIndex
                                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                                    : 'bg-black/20 border-white/5 text-white/70'
                                }`}
                              >
                                <span className="w-5 h-5 rounded bg-white/10 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="truncate">{opt}</span>
                                {idx === q.correctIndex && (
                                  <span className="ml-auto text-[10px] text-emerald-400">
                                    ✓ ข้อถูก
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Explanation */}
                          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-white/70">
                            <strong className="text-[#FFD100]">คำอธิบาย:</strong> {q.explanation}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <div className="text-xs text-white/50">
            จำนวนคำถามทั้งหมดในระบบ: <strong className="text-[#FFD100]">{questions.length} ข้อ</strong>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#FFD100] hover:bg-[#ffe066] text-[#333333] font-bold text-xs transition-all shadow-lg shadow-[#FFD100]/20 cursor-pointer"
          >
            เสร็จสิ้น (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
