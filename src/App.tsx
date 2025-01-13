import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { TarotCard } from './components/TarotCard';
import { tarotDeck } from './data/tarotDeck';
import { getTarotReading } from './utils/openai';
import type { Card, Reading } from './types/tarot';
import { tarotMeanings } from './data/tarotMeanings';

function App() {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCardSelect = async () => {
    if (selectedCards.length === 3) return;

    const remainingCards = tarotDeck.filter(
      card => !selectedCards.some(selected => selected.name === card.name)
    );

    if (remainingCards.length === 0) {
      console.error('No cards remaining');
      return;
    }

    const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
    const isCardReversed = Math.random() > 0.5;

    console.log('Selected card:', randomCard.name);
    console.log('Card meaning:', tarotMeanings[randomCard.name]);

    setSelectedCards(prev => [...prev, randomCard]);
    setIsReversed(prev => [...prev, isCardReversed]);

    if (selectedCards.length === 2) {
      setIsLoading(true);
      try {
        const interpretation = await getTarotReading([...selectedCards, randomCard], [...isReversed, isCardReversed]);
        setReading(interpretation);
      } catch (error) {
        console.error('Error getting reading:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedCards([]);
    setIsReversed([]);
    setReading('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            ดูดวงด้วยไพ่ทารอต 3 ใบ
          </h1>
          <p className="text-lg text-purple-200">เสี่ยงทายคำตอบต่อคำถามของคุณ ด้วยพลังของไพ่ทารอต</p>
        </header>

        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8">
            {selectedCards.map((card, index) => (
              <TarotCard
                key={card.name}
                card={card}
                isReversed={isReversed[index]}
                isRevealed={true}
              />
            ))}
            {selectedCards.length < 3 && (
              <motion.button
                className="w-64 h-96 bg-purple-700/50 rounded-xl border-2 border-purple-400/50 flex items-center justify-center text-purple-200 hover:bg-purple-700/60 transition-colors"
                whileHover={{ scale: 1.05 }}
                onClick={handleCardSelect}
              >
                คลิกเพื่อเปิดไพ่ 3 ครั้ง
              </motion.button>
            )}
          </div>

          {reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl bg-white/10 backdrop-blur-lg p-6 rounded-xl"
            >
              <h2 className="text-2xl font-semibold mb-4">คำทำนายของคุณ</h2>
              <p className="text-lg leading-relaxed text-purple-100 whitespace-pre-line">
                {reading}
              </p>
            </motion.div>
          )}

          {selectedCards.length === 3 && (
            <motion.button
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              onClick={handleReset}
            >
              เริ่มทำนายใหม่(อย่าใช้มากกว่า 2 ครั้ง เพื่อความแม่นยำ)
            </motion.button>
          )}

          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;