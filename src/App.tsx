import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { TarotCard } from './components/TarotCard';
import { tarotDeck } from './data/tarotDeck';
import { getTarotReading } from './utils/openai';
import type { Card, Reading } from './types/tarot';
import { tarotMeanings } from './data/tarotMeanings';
import { DailyHoroscope } from './components/DailyHoroscope';
import { zodiacSigns } from './data/zodiac';
import { HoroscopeModal } from './components/HoroscopeModal';
import { Helmet } from 'react-helmet';
import { ReadingHistory } from './components/ReadingHistory';
import { saveReading } from './utils/history';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CelticCrossReading } from './components/CelticCrossReading';
import { SpecializedReading } from './components/SpecializedReading';

function App() {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isReversed, setIsReversed] = useState<boolean[]>([]);
  const [reading, setReading] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHoroscope, setShowHoroscope] = useState(false);
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const zodiacElements = useMemo(() => {
    return zodiacSigns.reduce((acc, sign) => {
      if (!acc.includes(sign.element)) {
        acc.push(sign.element);
      }
      return acc;
    }, [] as string[]);
  }, []);

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
      } catch (error) {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        console.error('Error:', error);
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
    <div role="main" aria-label="ดูดวงออนไลน์">
      <Helmet>
        <title>ดูดวงออนไลน์ - ไพ่ทาโรต์และดูดวงรายวันตามราศี</title>
        <meta name="description" content="ดูดวงออนไลน์ด้วยไพ่ทาโรต์และดูดวงรายวันตามราศี ทำนายดวงชะตาแม่นๆ ฟรี" />
        <meta name="keywords" content="ดูดวง, ไพ่ทาโรต์, ดูดวงรายวัน, ราศี, ทำนาย, ดูดวงฟรี, ดูดวงแม่นๆ" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ดูดวงออนไลน์ - ไพ่ทาโรต์และดูดวงรายวัน" />
        <meta property="og:description" content="ดูดวงออนไลน์ด้วยไพ่ทาโรต์และดูดวงรายวันตามราศี ทำนายดวงชะตาแม่นๆ ฟรี" />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ดูดวงออนไลน์ - ไพ่ทาโรต์และดูดวงรายวัน" />
        <meta name="twitter:description" content="ดูดวงออนไลน์ด้วยไพ่ทาโรต์และดูดวงรายวันตามราศี ทำนายดวงชะตาแม่นๆ ฟรี" />
        <meta name="twitter:image" content="/og-image.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Your Name" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <html lang="th" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://your-domain.com" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <section id="tarot" className="mb-16">
            <section className="mb-16">
              <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                  <Sparkles className="w-8 h-8 inline-block mr-2" />
                  ดูดวงไพ่ทาโรต์
                </h1>
                <p className="text-lg text-purple-200">เลือกไพ่ 3 ใบเพื่อทำนายดวงชะตา</p>
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
                      คลิกเพื่อเปิดไพ่
                    </motion.button>
                  )}
                </div>

                {reading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-xl text-center"
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
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            </section>

            <section className="pt-16 border-t border-purple-500/30">
              <SpecializedReading />
            </section>

            <section className="pt-16 border-t border-purple-500/30">
              <CelticCrossReading />
            </section>
          </section>

          <section id="horoscope" className="pt-16 border-t border-purple-500/30">
            <header className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ดูดวงรายวันตามราศี</h2>
              <p className="text-lg text-purple-200">เลือกราศีของคุณเพื่อดูคำทำนายประจำวัน</p>
            </header>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.name}
                  onClick={() => setSelectedSign(sign.name)}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-700/50 to-purple-900/50 p-6 transition-all hover:from-purple-600/50 hover:to-purple-800/50"
                >
                  <div className="relative z-10">
                    <img 
                      src={sign.image} 
                      alt={sign.name} 
                      className="w-16 h-16 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold mb-2">{sign.thaiName}</h3>
                    <p className="text-sm text-purple-200">{sign.period}</p>
                    <p className="text-sm text-purple-300">{sign.element}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-700/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </section>

          {selectedSign && (
            <HoroscopeModal
              sign={selectedSign}
              onClose={() => setSelectedSign(null)}
            />
          )}

          <section id="history">
            <ReadingHistory />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;