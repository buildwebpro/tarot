import React, { useState, useEffect } from 'react';
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
  const [isReading, setIsReading] = useState(false);

  const currentType = selectedType ? readingTypes.find(t => t.id === selectedType) : null;

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedCards([]);
    setIsReversed([]);
    setIsReading(false);
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
      type: 'tarot_specialized',
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
    setIsReading(false);
  };

  useEffect(() => {
    if (currentType && selectedCards.length === currentType.cards) {
      handleComplete();
    }
  }, [selectedCards.length, currentType]);

  return (
    <div className="w-full py-12" id="specialized-reading">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <Sparkles className="w-8 h-8 inline-block mr-2" />
            ดูดวงไพ่ทาโรต์เฉพาะด้าน
          </h2>
          <p className="text-lg text-purple-200">เลือกประเภทการทำนายที่ต้องการ</p>
        </header>
        
        {/* เลือกประเภทการทำนาย */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {readingTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className={`relative overflow-hidden rounded-xl p-6 text-left transition-all
                  ${selectedType === type.id 
                    ? `bg-gradient-to-r ${type.color} text-white`
                    : 'bg-white/10 hover:bg-white/20'
                  }`}
                whileHover={{ scale: 1.02 }}
              >
                <Icon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                <p className="text-sm opacity-80">{type.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* พื้นที่แสดงไพ่ */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
          >
            <div className="flex flex-wrap justify-center gap-6">
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
                  className="w-64 h-96 bg-purple-700/50 rounded-xl border-2 border-purple-400/50
                    flex items-center justify-center text-purple-200 hover:bg-purple-700/60"
                  whileHover={{ scale: 1.05 }}
                >
                  เลือกไพ่
                </motion.button>
              )}
            </div>

            {/* แสดงความหมาย */}
            {currentType && selectedCards.length === currentType.cards && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-6 bg-white/5 rounded-lg"
              >
                <h4 className="text-xl font-semibold mb-4">ความหมายของไพ่</h4>
                <div className="space-y-4">
                  {selectedCards.map((card, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <h5 className="font-medium mb-2">
                        {card.name} {isReversed[index] ? '(กลับหัว)' : ''}
                      </h5>
                      <p className="text-sm opacity-80">
                        {isReversed[index] 
                          ? card.meaning[selectedType as 'love' | 'career' | 'finance' | 'health'].reversed
                          : card.meaning[selectedType as 'love' | 'career' | 'finance' | 'health'].upright
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentType && selectedCards.length === currentType.cards && (
              <motion.button
                onClick={resetReading}
                className="mt-6 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                เริ่มทำนายใหม่
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 