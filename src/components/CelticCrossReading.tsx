import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { tarotDeck } from '../data/tarotDeck';
import { TarotCard } from './TarotCard';
import { saveReading } from '../utils/history';
import { generateTarotReading } from '../utils/openrouter';
import { v4 as uuidv4 } from 'uuid';

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
    <div className="w-full bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-white">การทำนายไพ่ทาโรต์แบบ Celtic Cross</h2>
          <div className="flex gap-4">
            {selectedCards.length === 10 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={startReading}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                disabled={isReading}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                เริ่มการทำนาย
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleCardSelect}
                className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                disabled={selectedCards.length >= 10}
              >
                เลือกไพ่ ({selectedCards.length}/10)
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={resetReading}
              className="px-6 py-3 bg-purple-700/50 rounded-lg hover:bg-purple-600/50 transition-colors flex items-center"
              disabled={!isReading && selectedCards.length === 0}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              เริ่มใหม่
            </motion.button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 overflow-auto">
          {!isReading ? (
            <div className="flex flex-wrap justify-center gap-4 min-h-[300px]">
              {selectedCards.map((card, index) => (
                <div key={index} className="transform scale-[0.52]">
                  <TarotCard
                    card={card}
                    isReversed={isReversed[index]}
                    isRevealed={true}
                  />
                </div>
              ))}
              {selectedCards.length < 10 && (
                <motion.div
                  className="w-48 h-72 bg-purple-700/50 rounded-xl border-2 border-purple-400/50 flex items-center justify-center text-purple-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleCardSelect}
                >
                  คลิกเพื่อเลือกไพ่
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative grid grid-cols-7 grid-rows-6 gap-2 w-[1000px] h-[750px]">
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
                    <div className="absolute -bottom-5 text-xs text-purple-200 text-center w-full">
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
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-3">คำทำนายจาก AI</h3>

            {isLoadingAI ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-purple-400 mr-3" />
                <span className="text-purple-200">กำลังทำนาย...</span>
              </div>
            ) : aiReading ? (
              <div className="bg-purple-800/30 rounded-lg p-4">
                <p className="text-purple-100 whitespace-pre-wrap leading-relaxed">
                  {aiReading}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCards.map((card, index) => (
                  <div key={index} className="p-3 bg-purple-800/50 rounded-lg">
                    <h4 className="font-bold text-base text-purple-200">
                      {POSITIONS[index].name} - {card.name}
                      {isReversed[index] ? ' (กลับหัว)' : ''}
                    </h4>
                    <p className="mt-1 text-sm text-purple-300">
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
