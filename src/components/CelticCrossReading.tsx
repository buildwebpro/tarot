import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { tarotDeck } from '../data/tarotDeck';
import { TarotCard } from './TarotCard';
import { saveReading } from '../utils/history';
import { generateTarotReading } from '../utils/openrouter';
import { v4 as uuidv4 } from 'uuid';
import type { Card } from '../types/tarot';

const POSITIONS = [
  { id: 0, name: 'สถานการณ์ปัจจุบัน', gridArea: '3/4/4/5', zIndex: 1 },
  { id: 1, name: 'อุปสรรค', gridArea: '3/4/4/5', rotate: true, zIndex: 2 },
  { id: 2, name: 'เป้าหมาย', gridArea: '1/4/2/5' },
  { id: 3, name: 'รากฐาน', gridArea: '5/4/6/5' },
  { id: 4, name: 'อดีต', gridArea: '3/3/4/4' },
  { id: 5, name: 'อนาคต', gridArea: '3/5/4/6' },
  { id: 6, name: 'ตัวคุณ', gridArea: '2/2/3/3' },
  { id: 7, name: 'สภาพแวดล้อม', gridArea: '2/6/3/7' },
  { id: 8, name: 'ความหวัง/ความกลัว', gridArea: '5/2/6/3' },
  { id: 9, name: 'ผลลัพธ์', gridArea: '5/6/6/7' }
];

export function CelticCrossReading() {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [aiReading, setAiReading] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleCardSelect = () => {
    if (selectedCards.length >= 10) return;

    const remainingCards = tarotDeck.filter(
      card => !selectedCards.some(selected => selected.name === card.name)
    );

    const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    const isCardReversed = Math.random() > 0.5;

    setSelectedCards([...selectedCards, randomCard]);
    setIsReversed([...isReversed, isCardReversed]);
  };

  const startReading = async () => {
    setIsReading(true);
    setIsLoadingAI(true);
    setAiReading('');

    // บันทึกประวัติ
    saveReading({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'tarot',
      reading: 'Celtic Cross Reading',
      details: {
        cards: selectedCards.map((card, index) => ({
          name: card.name,
          position: POSITIONS[index].name,
          isReversed: isReversed[index]
        }))
      }
    });

    // เรียก AI ทำนาย
    const cardsData = selectedCards.map((card, index) => ({
      name: card.name,
      position: POSITIONS[index].name,
      isReversed: isReversed[index]
    }));

    const result = await generateTarotReading(cardsData);
    setAiReading(result);
    setIsLoadingAI(false);
  };

  const resetReading = () => {
    setSelectedCards([]);
    setIsReversed([]);
    setIsReading(false);
    setAiReading('');
    setIsLoadingAI(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center sm:justify-end items-center mb-8 flex-wrap gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            {selectedCards.length === 10 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={startReading}
                className="px-6 py-3 bg-gradient-to-r from-cosmic-700 to-cosmic-900 border border-cosmic-600 hover:border-stardust-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-stardust-500/20 uppercase tracking-wide flex items-center"
                disabled={isReading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                เริ่มการทำนาย
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCardSelect}
                className="px-6 py-3 bg-gradient-to-r from-cosmic-700 to-cosmic-900 border border-cosmic-600 hover:border-stardust-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-stardust-500/20 uppercase tracking-wide flex items-center"
                disabled={selectedCards.length >= 10}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                เปิดไพ่ ({selectedCards.length}/10)
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetReading}
              className="px-6 py-3 glass-card hover:bg-cosmic-800/80 border border-cosmic-600 hover:border-red-400/50 text-white rounded-full text-sm font-semibold transition-all flex items-center tracking-wide uppercase"
              disabled={!isReading && selectedCards.length === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              เริ่มใหม่
            </motion.button>
          </div>
        </div>

        <div className="glass-panel border border-cosmic-700/50 rounded-2xl p-4 sm:p-8 mb-8 overflow-x-auto relative min-h-[500px] flex items-center justify-center">
          {!isReading ? (
            <div className="flex flex-wrap justify-center gap-4 min-h-[300px]">
              {selectedCards.map((card, index) => (
                <div key={index} className="transform scale-[0.45] sm:scale-[0.52]">
                  <TarotCard
                    card={card}
                    isReversed={isReversed[index]}
                    isRevealed={true}
                  />
                </div>
              ))}
              {selectedCards.length < 10 && (
                <motion.div
                  className="w-40 h-64 sm:w-56 sm:h-80 rounded-2xl border-2 border-dashed border-cosmic-600 hover:border-stardust-500 glass-card hover:bg-cosmic-800/80 flex flex-col items-center justify-center text-cosmic-400 hover:text-stardust-300 transition-all gap-4 group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCardSelect}
                >
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 group-hover:animate-pulse" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">อธิษฐานแล้วเปิดไพ่</span>
                  <span className="text-xs text-cosmic-500 font-medium">ใบที่ {selectedCards.length + 1} / 10</span>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex justify-center min-w-full">
              <div className="relative grid grid-cols-7 grid-rows-6 gap-2 w-[900px] h-[680px] max-w-full">
                {POSITIONS.map((position, index) => (
                  <div
                    key={index}
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                      gridArea: position.gridArea,
                      zIndex: position.zIndex || 0
                    }}
                  >
                    <div
                      className={`transform scale-[0.48] ${position.rotate ? 'rotate-90' : ''}`}
                      style={{
                        transformOrigin: 'center',
                        position: 'absolute'
                      }}
                    >
                      <TarotCard
                        card={selectedCards[index]}
                        isReversed={isReversed[index]}
                        isRevealed={true}
                      />
                    </div>
                    <div className="absolute -bottom-5 text-xs text-cosmic-300 text-center w-full font-medium tracking-wide drop-shadow-sm">
                      {position.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isReading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 w-full pt-8 border-t border-cosmic-800"
          >
            <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-stardust-400" /> คำทำนายจากไพ่
            </h3>

            {isLoadingAI ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                  <div className="w-2.5 h-2.5 bg-stardust-400 rounded-full animate-bounce [animation-delay:0.4s] shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                </div>
                <span className="text-sm font-medium tracking-wide animate-pulse text-cosmic-300">กำลังสแกนดวงดาวและทำนาย...</span>
              </div>
            ) : aiReading ? (
              <div className="glass-card bg-cosmic-900/30 border border-cosmic-700/50 rounded-2xl p-6 sm:p-10 shadow-xl">
                <p className="text-cosmic-200 whitespace-pre-wrap leading-relaxed text-lg font-light">
                  {aiReading}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCards.map((card, index) => (
                  <div key={index} className="p-5 glass-card rounded-2xl border border-cosmic-700/50 bg-cosmic-900/30">
                    <h4 className="font-semibold mb-3 text-stardust-300 flex items-center gap-2 text-sm sm:text-base">
                      <span className="w-6 h-6 rounded-full bg-cosmic-800 flex items-center justify-center text-xs text-stardust-400 border border-cosmic-600 shrink-0">
                        {index + 1}
                      </span>
                      <span className="line-clamp-1">{POSITIONS[index].name}</span>
                      <span className="text-cosmic-300 mx-1">-</span> 
                      <span className="line-clamp-1 truncate">{card.name}</span>
                      {isReversed[index] ? <span className="text-red-400 font-normal shrink-0">(กลับหัว)</span> : ''}
                    </h4>
                    <p className="text-cosmic-200 leading-relaxed font-light text-sm pl-8">
                      {isReversed[index] ? card.meaning.reversed : card.meaning.upright}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
