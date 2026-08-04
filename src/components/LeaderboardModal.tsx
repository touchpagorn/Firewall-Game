import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import {
  getStoredLeaderboard,
  resetLeaderboard,
  exportLeaderboardToCSV,
} from '../utils/storage';
import {
  Trophy,
  X,
  Download,
  Trash2,
  Clock,
  User,
  Mail,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Search,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const loadData = () => {
    const data = getStoredLeaderboard();
    setEntries(data);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setShowConfirmReset(false);
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportLeaderboardToCSV(entries);
  };

  const handleReset = () => {
    resetLeaderboard();
    setEntries([]);
    setShowConfirmReset(false);
  };

  const filteredEntries = entries.filter((item) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] border border-white/15 rounded-[32px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD100]/20 border border-[#FFD100]/40 flex items-center justify-center text-[#FFD100] shrink-0 shadow-lg shadow-[#FFD100]/10">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Dashboard สรุปคนได้ 5 คะแนนเต็ม</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/40 text-[#FFD100] font-mono">
                  {entries.length} คน
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                เรียงตามลำดับระยะเวลาที่ทำได้เร็วที่สุด (Speedrun Ranking)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Actions */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อ หรือ อีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FFD100]/50 transition-all"
            />
          </div>

          {/* Buttons: Export CSV & Reset */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FFD100] hover:bg-[#ffe066] text-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#FFD100]/20"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                disabled={entries.length === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset สถิติ</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 p-1.5 rounded-xl animate-fade-in">
                <span className="text-xs text-rose-200 font-bold px-2">
                  ยืนยันลบทั้งหมด?
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-all"
                >
                  ตกลง ลบเลย
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold cursor-pointer transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Table / List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/30">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                ยังไม่มีข้อมูลผู้ทำได้ 5 คะแนนเต็ม
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                เมื่อผู้เล่นตอบคำถามถูกครบทั้ง 5 ข้อในแบบทดสอบ
                ระบบจะให้ลงชื่อและอีเมลเพื่อจัดอันดับใน Dashboard นี้โดยอัตโนมัติ
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-white/50 text-xs">
              ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchTerm}"
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-4 text-center">อันดับ</th>
                    <th className="py-3 px-4">ชื่อผู้ทำแบบทดสอบ</th>
                    <th className="py-3 px-4">อีเมล</th>
                    <th className="py-3 px-4 text-center">ระยะเวลาที่ใช้</th>
                    <th className="py-3 px-4 text-center">คะแนน</th>
                    <th className="py-3 px-4 text-right">วันที่ทำรายการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredEntries.map((item, idx) => {
                    const rankNumber = idx + 1;
                    let rankBadge = null;

                    if (rankNumber === 1) {
                      rankBadge = (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold text-sm shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                          🥇 1
                        </span>
                      );
                    } else if (rankNumber === 2) {
                      rankBadge = (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300/20 border border-slate-300/50 text-slate-200 font-bold text-sm">
                          🥈 2
                        </span>
                      );
                    } else if (rankNumber === 3) {
                      rankBadge = (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/30 border border-amber-600/50 text-amber-400 font-bold text-sm">
                          🥉 3
                        </span>
                      );
                    } else {
                      rankBadge = (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 text-white/60 font-mono text-xs font-bold">
                          #{rankNumber}
                        </span>
                      );
                    }

                    const dateStr = new Date(item.timestamp).toLocaleString(
                      'th-TH',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    );

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-white/[0.03] transition-colors ${
                          rankNumber === 1 ? 'bg-amber-500/[0.04]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          {rankBadge}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white/95">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#FFD100] shrink-0" />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-white/70 text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span>{item.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD100]/15 border border-[#FFD100]/30 text-[#FFD100] text-xs font-bold font-mono">
                            <Zap className="w-3.5 h-3.5 text-[#FFD100]" />
                            <span>{item.durationSeconds} วินาที</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400 text-xs">
                          {item.score}/{item.totalQuestions}
                        </td>
                        <td className="py-3.5 px-4 text-right text-xs text-white/40 font-mono">
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] text-center text-xs text-white/40 flex items-center justify-between px-6">
          <span>* เฉพาะผู้ทำคะแนนเต็ม 5/5 ข้อเท่านั้นที่สามารถบันทึกสถิติได้</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
