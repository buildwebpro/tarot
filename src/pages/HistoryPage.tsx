import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, Trash2, BookOpen, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { historyService } from '../services/firestore';
import { getHistory } from '../utils/history';
import { Link, Navigate } from 'react-router-dom';
import type { ReadingHistory } from '../types/firebase';

export default function HistoryPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'tarot' | 'uranian' | 'zodiac'>('uranian');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      if (user) {
        const firestoreHistory = await historyService.getUserHistory(user.uid);
        setHistory(firestoreHistory);
      }
      // Always load local history
      setLocalHistory(getHistory());
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (readingId: string) => {
    try {
      await historyService.deleteReading(readingId);
      setHistory(prev => prev.filter(r => r.id !== readingId));
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      tarot: 'ไพ่ทาโรต์',
      uranian: 'ยูเรเนียน',
      zodiac: 'ดูดวงราศี',
    };
    return map[type] || type;
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'ไม่ระบุ';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'ไม่ระบุ';
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'ไม่ระบุ';
    }
  };  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tarot': return '🃏';
      case 'uranian': return '🔮';
      case 'zodiac': return '⭐';
      case 'celtic_cross': return '✨';
      default: return '📖';
    }
  };

  // Combine and deduplicate
  const allHistory = isAuthenticated ? history : localHistory.map(h => ({
    ...h,
    userId: 'local',
    isPremium: false,
  }));

  const filteredHistory = allHistory.filter(reading => {
    if (filter === 'all') return true;
    return reading.type === filter;
  });

  return (
    <>
      <Helmet>
        <title>ประวัติการดูดวง | รุทสะกิดดาว</title>
        <meta name="description" content="ดูประวัติการดูดวงทั้งหมดของคุณ ไพ่ทาโรต์ ยูเรเนียน ดูดวงราศี" />
      </Helmet>

      <section className="py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-full mb-6">
            <Clock className="w-10 h-10 text-purple-300" />
          </div>
          <h1 className="text-4xl font-bold mb-4">ประวัติการดูดวง</h1>
          <p className="text-lg text-purple-200">
            {isAuthenticated
              ? 'ประวัติการดูดวงโหราศาสตร์ยูเรเนียนของคุณ'
              : 'เข้าสู่ระบบเพื่อบันทึกประวัติการดูดวงแบบถาวร'}
          </p>
        </header>

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 mx-auto mb-6 text-purple-400/30" />
            <p className="text-purple-300 text-lg mb-6">ยังไม่มีประวัติการดูดวง</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              เริ่มดูดวงเลย
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {filteredHistory.map((reading) => (
                <motion.div
                  key={reading.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === reading.id ? null : reading.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(reading.type)}</span>
                      <div>
                        <span className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">
                          {getTypeLabel(reading.type)}
                        </span>
                        <p className="text-purple-300 text-xs mt-1">
                          {formatDate(reading.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    {isAuthenticated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(reading.id);
                        }}
                        className="text-purple-400 hover:text-red-400 transition-colors p-2"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {reading.details?.cards && (
                    <div className="flex gap-3 mb-3 flex-wrap">
                      {reading.details.cards.map((card: any, index: number) => (
                        <span key={index} className="text-xs bg-purple-800/50 px-2 py-1 rounded text-purple-200">
                          {card.name} {card.isReversed ? '(กลับหัว)' : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {reading.details?.birthData && (
                    <div className="mb-3 text-sm text-purple-300">
                      📅 {reading.details.birthData.date} ⏰ {reading.details.birthData.time} 📍 {reading.details.birthData.place}
                    </div>
                  )}

                  <div className={`text-purple-100 whitespace-pre-line ${expandedId === reading.id ? '' : 'line-clamp-4'} text-sm leading-relaxed`}>
                    {reading.reading}
                  </div>
                  {expandedId !== reading.id && (
                    <p className="text-purple-400 text-xs mt-2 text-center">คลิกเพื่อดูเพิ่มเติม</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  );
}
