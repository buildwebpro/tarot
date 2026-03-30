import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Star, Layers, Grid3X3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { TarotCard } from '../components/TarotCard';
import { tarotDeck } from '../data/tarotDeck';
import { getTarotReading } from '../utils/openai';
import type { Card } from '../types/tarot';
import { saveReading } from '../utils/history';
import { v4 as uuidv4 } from 'uuid';
import { CelticCrossReading } from '../components/CelticCrossReading';
import { SpecializedReading } from '../components/SpecializedReading';

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardSelect = async () => {
    if (selectedCards.length === 3) return;
    const remainingCards = tarotDeck.filter(
      card => !selectedCards.some(selected => selected.name === card.name)
    );
    if (remainingCards.length === 0) return;

    const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    const isCardReversed = Math.random() > 0.5;
    setSelectedCards(prev => [...prev, randomCard]);
    setIsReversed(prev => [...prev, isCardReversed]);

    if (selectedCards.length === 2) {
      setIsLoading(true);
      setError(null);
      try {
        const interpretation = await getTarotReading([...selectedCards, randomCard], [...isReversed, isCardReversed]);
        setReading(interpretation);
        saveReading({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          type: 'tarot',
          reading: interpretation,
          details: {
            cards: [...selectedCards, randomCard].map((card, index) => ({
              name: card.name,
              isReversed: [...isReversed, isCardReversed][index]
            }))
          }
        });
      } catch {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
    setIsReversed([]);
    setReading('');
    setError(null);
  };

  return (
    <>
      <Helmet>
        <title>ไพ่ทาโรต์ออนไลน์ — ไพ่เสี่ยงทาย Celtic Cross ไพ่เฉพาะด้าน | รุทสะกิดดาว</title>
        <meta name="description" content="เปิดไพ่ทาโรต์ออนไลน์ ไพ่เสี่ยงทาย 3 ใบ ไพ่เฉพาะด้าน ความรัก การงาน การเงิน สุขภาพ Celtic Cross 10 ใบ ทำนายดวงชะตาแม่นยำ 20ปี ประสบการณ์" />
        <meta name="keywords" content="ไพ่ทาโรต์, ไพ่เสี่ยงทาย, Celtic Cross, ดูดวงไพ่, ดูไพ่ออนไลน์, tarot reading, ไพ่เฉพาะด้าน" />
        <link rel="canonical" href="https://rujskiddao-tarot.web.app/tarot" />
      </Helmet>

      {/* Page Header — Cosmic Dark */}
      <section className="bg-transparent text-white py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-stardust-400 to-stardust-300">ไพ่ทาโรต์</h1>
          <p className="text-cosmic-200 text-lg sm:text-xl max-w-2xl text-shadow">เลือกรูปแบบการเปิดไพ่ที่ต้องการ — เสริมชะตาด้วยไพ่เสี่ยงทาย ไพ่เฉพาะด้าน หรือ ศาสตร์ลึกซึ้ง Celtic Cross</p>
        </div>
      </section>

      {/* ═══ ไพ่เสี่ยงทาย 3 ใบ ═══ */}
      <section id="general" className="relative py-16 lg:py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cosmic-800/80 border border-cosmic-600 shadow-inner flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-stardust-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white drop-shadow">ไพ่เสี่ยงทายทั่วไป</h2>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-cosmic-900 border border-cosmic-600 text-stardust-400 rounded-full sm:ml-2 uppercase tracking-wide">3 ใบ</span>
            <p className="text-cosmic-300 sm:ml-4 text-sm sm:text-base hidden sm:block">ทำนายอดีต ปัจจุบัน อนาคต</p>
          </div>
          <p className="text-cosmic-300 mb-10 text-sm sm:hidden px-1">ทำนายอดีต ปัจจุบัน อนาคต</p>

          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {selectedCards.map((card, index) => (
                <TarotCard key={card.name} card={card} isReversed={isReversed[index]} isRevealed={true} />
              ))}
              {selectedCards.length < 3 && (
                <motion.button
                  className="w-48 h-72 sm:w-56 sm:h-80 rounded-2xl border-2 border-dashed border-cosmic-600 hover:border-stardust-500 glass-card hover:bg-cosmic-800/80 flex flex-col items-center justify-center text-cosmic-400 hover:text-stardust-300 transition-all gap-4 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCardSelect}
                >
                  <Sparkles className="w-10 h-10 group-hover:animate-pulse" />
                  <span className="text-sm font-semibold tracking-wide uppercase">อธิษฐานแล้วเปิดไพ่</span>
                  <span className="text-xs text-cosmic-500 font-medium">ใบที่ {selectedCards.length + 1} / 3</span>
                </motion.button>
              )}
            </div>

            {reading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl glass-panel p-6 sm:p-10 border border-cosmic-700/50 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Star className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-3 border-b border-cosmic-800 pb-4">
                  <Sparkles className="w-6 h-6 text-stardust-400" />
                  คำทำนายของคุณ
                </h3>
                <div className="text-cosmic-200 leading-relaxed reading-section text-shadow-sm font-light text-lg">
                  {reading}
                </div>
              </motion.div>
            )}

            {selectedCards.length === 3 && (
              <button
                className="px-8 py-3 bg-gradient-to-r from-cosmic-700 to-cosmic-900 border border-cosmic-600 hover:border-stardust-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-stardust-500/20 uppercase tracking-wide"
                onClick={handleReset}
              >
                เริ่มทำนายใหม่
              </button>
            )}

            {isLoading && (
              <div className="flex flex-col items-center gap-4 text-cosmic-300">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                </div>
                <span className="text-sm font-medium tracking-wide animate-pulse">กำลังสแกนดวงดาว...</span>
              </div>
            )}

            {error && (
              <div className="text-red-300 text-sm bg-red-950/50 border border-red-900/50 px-6 py-3 rounded-lg flex items-center gap-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ ไพ่เฉพาะด้าน ═══ */}
      <section id="specialized" className="bg-cosmic-950/40 border-y border-cosmic-800 backdrop-blur-sm py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cosmic-800/80 border border-cosmic-600 shadow-inner flex items-center justify-center">
                <Layers className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white drop-shadow">ไพ่เฉพาะด้าน</h2>
            </div>
            <span className="px-3 py-1 text-xs font-semibold bg-cosmic-900 border border-emerald-900/50 text-emerald-400 rounded-full sm:ml-2 uppercase tracking-wide">4 หมวด</span>
            <p className="text-cosmic-300 sm:ml-4 text-sm sm:text-base hidden sm:block">เลือกเจาะลึก: ความรัก การงาน การเงิน สุขภาพ</p>
          </div>
          <p className="text-cosmic-300 mb-10 text-sm sm:hidden px-1">เลือกเจาะลึก: ความรัก การงาน การเงิน สุขภาพ</p>
          <SpecializedReading />
        </div>
      </section>

      {/* ═══ Celtic Cross ═══ */}
      <section id="celtic-cross" className="py-16 lg:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 text-center sm:text-left">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-xl bg-cosmic-800/80 border border-cosmic-600 shadow-inner flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-stardust-400" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white drop-shadow">Celtic Cross</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <span className="px-3 py-1 text-xs font-semibold bg-cosmic-900 border border-stardust-900/50 text-stardust-400 rounded-full sm:ml-2 uppercase tracking-wide">10 ใบ</span>
              <p className="text-cosmic-300 text-sm sm:text-base hidden sm:block">วิเคราะห์ชีวิตรอบด้านอย่างลึกซึ้ง</p>
            </div>
          </div>
          <p className="text-cosmic-300 mb-10 text-sm sm:hidden text-center">วิเคราะห์ชีวิตรอบด้านอย่างลึกซึ้ง</p>
          
          <div className="glass-card p-6 sm:p-10 rounded-3xl border border-cosmic-700/50">
            <CelticCrossReading />
          </div>
        </div>
      </section>
    </>
  );
}
