import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Briefcase, Coins, Activity, Sparkles } from 'lucide-react';
import { TarotCard } from './TarotCard';
import { tarotDeck } from '../data/tarotDeck';
import { saveReading } from '../utils/history';
import { v4 as uuidv4 } from 'uuid';
import type { Card } from '../types/tarot';

// ประเภทการทำนาย
const readingTypes = [
  {
    id: 'love',
    name: 'ความรัก',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    cards: 3,
    description: 'ทำนายเรื่องความรัก ความสัมพันธ์ และชีวิตคู่'
  },
  {
    id: 'career',
    name: 'อาชีพการงาน',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
    cards: 3,
    description: 'ทำนายเรื่องการงาน ความก้าวหน้า และโอกาสในอาชีพ'
  },
  {
    id: 'finance',
    name: 'การเงิน',
    icon: Coins,
    color: 'from-green-500 to-emerald-600',
    cards: 3,
    description: 'ทำนายเรื่องการเงิน การลงทุน และโชคลาภ'
  },
  {
    id: 'health',
    name: 'สุขภาพ',
    icon: Activity,
    color: 'from-orange-500 to-red-600',
    cards: 3,
    description: 'ทำนายเรื่องสุขภาพกาย สุขภาพจิต และการดูแลตัวเอง'
  }
];

export function SpecializedReading() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);

  const currentType = selectedType ? readingTypes.find(t => t.id === selectedType) : null;

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedCards([]);
    setIsReversed([]);
  };

  const handleCardSelect = () => {
    if (!currentType || selectedCards.length >= currentType.cards) return;

    const remainingCards = tarotDeck.filter(
      card => !selectedCards.some(selected => selected.name === card.name)
    );

    const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    const isCardReversed = Math.random() > 0.5;

    setSelectedCards([...selectedCards, randomCard]);
    setIsReversed([...isReversed, isCardReversed]);
  };

  const handleComplete = () => {
    if (!selectedType) return;
    
    saveReading({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'tarot',
      reading: `การทำนายเฉพาะด้าน: ${readingTypes.find(t => t.id === selectedType)?.name}`,
      details: {
        cards: selectedCards.map((card, index) => ({
          name: card.name,
          isReversed: isReversed[index]
        })),
        specializedType: selectedType
      }
    });
  };

  const resetReading = () => {
    setSelectedType(null);
    setSelectedCards([]);
    setIsReversed([]);
  };

  useEffect(() => {
    if (currentType && selectedCards.length === currentType.cards) {
      handleComplete();
    }
  }, [selectedCards.length, currentType]);

  return (
    <div className="w-full" id="specialized">
      <div className="max-w-6xl mx-auto">
        {/* เลือกประเภทการทำนาย */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {readingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border
                  ${selectedType === type.id 
                    ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg scale-[1.02]`
                    : 'glass-card border-cosmic-700/50 hover:border-stardust-500/50 hover:bg-cosmic-800/60 text-cosmic-200 hover:text-stardust-300 group'
                  }`}
                whileHover={selectedType !== type.id ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <Icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? 'text-white' : 'text-cosmic-400 group-hover:text-stardust-300 transition-colors'}`} />
                  <h3 className={`text-xl font-bold mb-2 font-display tracking-wide ${selectedType === type.id ? 'text-white' : 'text-white transition-colors'}`}>{type.name}</h3>
                  <p className={`text-sm leading-relaxed ${selectedType === type.id ? 'text-white/90' : 'text-cosmic-300 transition-colors'}`}>{type.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* พื้นที่แสดงไพ่ */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto glass-panel p-6 sm:p-10 border border-cosmic-700/50 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col items-center gap-12">
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8 w-full">
                {selectedCards.map((card, index) => (
                  <TarotCard
                    key={index}
                    card={card}
                    isReversed={isReversed[index]}
                    isRevealed={true}
                  />
                ))}
                {selectedCards.length < (currentType?.cards || 0) && (
                  <motion.button
                    onClick={handleCardSelect}
                    className="w-48 h-72 sm:w-56 sm:h-80 rounded-2xl border-2 border-dashed border-cosmic-600 hover:border-stardust-500 glass-card hover:bg-cosmic-800/80 flex flex-col items-center justify-center text-cosmic-400 hover:text-stardust-300 transition-all gap-4 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Sparkles className="w-10 h-10 group-hover:animate-pulse" />
                    <span className="text-sm font-semibold tracking-wide uppercase">อธิษฐานแล้วเปิดไพ่</span>
                    <span className="text-xs text-cosmic-500 font-medium">ใบที่ {selectedCards.length + 1} / {currentType?.cards}</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* แสดงความหมาย */}
            {currentType && selectedCards.length === currentType.cards && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 w-full pt-8 border-t border-cosmic-800"
              >
                <h4 className="text-2xl font-display font-bold mb-6 text-white flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-stardust-400" />
                  ความหมายของไพ่
                </h4>
                <div className="space-y-6">
                  {selectedCards.map((card, index) => (
                    <div key={index} className="p-6 glass-card rounded-2xl border border-cosmic-700/50 bg-cosmic-900/30">
                      <h5 className="font-semibold mb-3 text-stardust-300 flex items-center gap-2 text-lg">
                        <span className="w-6 h-6 rounded-full bg-cosmic-800 flex items-center justify-center text-xs text-stardust-400 border border-cosmic-600">
                          {index + 1}
                        </span>
                        {card.name} {isReversed[index] ? <span className="text-red-400 text-sm font-normal">(กลับหัว)</span> : ''}
                      </h5>
                      <p className="text-cosmic-200 leading-relaxed font-light pl-8">
                        {isReversed[index] 
                          ? card.meaning[selectedType as 'love' | 'career' | 'finance' | 'health'].reversed
                          : card.meaning[selectedType as 'love' | 'career' | 'finance' | 'health'].upright
                        }
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <motion.button
                    onClick={resetReading}
                    className="px-8 py-3 bg-gradient-to-r from-cosmic-700 to-cosmic-900 border border-cosmic-600 hover:border-stardust-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-stardust-500/20 uppercase tracking-wide"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    เริ่มทำนายใหม่
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 