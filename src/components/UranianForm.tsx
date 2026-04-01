import React, { useState } from 'react';
import { Sparkles, Lock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getUranianReading } from '../utils/uranian';
import { useAuth } from '../contexts/AuthContext';
import { historyService } from '../services/firestore';
import { usersService } from '../services/users';

interface UranianFormProps {
  onReadingComplete?: (reading: string) => void;
}

export function UranianForm({ onReadingComplete }: UranianFormProps) {
  const { user, userProfile, isPremium, isAuthenticated, refreshProfile } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [reading, setReading] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const checkReadingLimit = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      setShowPremiumModal(true);
      return false;
    }

    if (!isPremium && (userProfile?.credits || 0) < 1) {
      setShowPremiumModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const canProceed = await checkReadingLimit();
    if (!canProceed) return;

    setIsLoading(true);
    setStatus('กำลังเตรียมข้อมูล...');

    try {
      const reading = await getUranianReading({
        birthDate,
        birthTime,
        birthPlace,
        question: question || undefined,
        onProgress: (msg) => setStatus(msg),
      });

      setReading(reading);
      onReadingComplete?.(reading);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReading('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setQuestion('');
    setShowSavedMessage(false);
  };

  const handleSaveToHistory = async () => {
    if (!user || !reading || !birthDate || !birthTime || !birthPlace) return;
    
    setIsSaving(true);
    try {
      await historyService.saveReading({
        userId: user.uid,
        type: 'uranian',
        timestamp: new Date().toISOString(),
        reading,
        details: {
          birthData: {
            date: birthDate,
            time: birthTime,
            place: birthPlace,
          },
        },
        isPremium: false,
      });

      await usersService.deductCredit(user.uid);
      await refreshProfile();

      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (err) {
      console.error('Error saving to history:', err);
      setError('ไม่สามารถบันทึกคำทำนายได้');
    } finally {
      setIsSaving(false);
    }
  };

  if (reading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400" />
            ผลคำทำนายโหราศาสตร์ยูเรเนียน
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-purple-100 leading-relaxed">
              {reading}
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {user && (
              <button
                onClick={handleSaveToHistory}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <span>💾</span>
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกคำทำนาย'}
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              ทำนายดวงใหม่
            </button>
          </div>
          {showSavedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center text-green-200"
            >
              ✅ บันทึกคำทำนายสำเร็จ!
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">โหราศาสตร์ยูเรเนียน</h3>
            <p className="text-purple-200">
              ทำนายดวงชะตาด้วยระบบโหราศาสตร์ยูเรเนียนอันแม่นยำ
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-300">
              <Lock className="w-4 h-4" />
              <span>1 เครดิต = 1 ครั้ง | ต้องเข้าสู่ระบบ</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 mb-2">วันเกิด</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2">เวลาเกิด</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 mb-2">สถานที่เกิด</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="จังหวัด, ประเทศ"
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 mb-2">คำถาม (ถ้ามี)</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="คำถามที่ต้องการถาม..."
                rows={3}
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-medium">เกิดข้อผิดพลาด</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-800 disabled:to-indigo-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  {status || 'กำลังคำนวณ...'}
                </span>
              ) : (
                'เปิดคำทำนาย'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          freeReadingsCount={userProfile?.freeReadingsCount ?? 0}
        />
      )}
    </>
  );
}

interface PremiumModalProps {
  onClose: () => void;
  freeReadingsCount: number;
}

function PremiumModal({ onClose, freeReadingsCount }: PremiumModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h3 className="text-2xl font-bold mb-4">เติมเครดิต</h3>

          <p className="text-purple-200 mb-6">
            คุณไม่มีเครดิตในการทำนาย
            <br />
            ติดต่อ Line: 0942511969 เพื่อเติมเครดิต
          </p>

          <div className="space-y-3">
            <div className="bg-purple-800/50 rounded-lg p-4 text-left">
              <h4 className="font-semibold mb-2 text-amber-300">แพ็กเกจเครดิต:</h4>
              <ul className="text-sm text-purple-200 space-y-1">
                <li>• 1 เครดิต = 200 บาท</li>
                <li>• โหราศาสตร์ยูเรเนียน 1 ครั้ง = 1 เครดิต</li>
                <li>• ไพ่ทาโรต์ - ดูฟรี</li>
                <li>• ดูดวงรายวัน - ดูฟรี</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 text-purple-300 hover:text-white transition-colors text-sm"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
