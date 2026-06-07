import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { zodiacSigns } from '../data/zodiac';
import { getDailyHoroscope } from '../utils/horoscope';
import { useAuth } from '../contexts/AuthContext';

interface DailyHoroscopeProps {
  onClose: () => void;
}

export function DailyHoroscope({ onClose }: DailyHoroscopeProps) {
  const { user } = useAuth();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string>('');

  const handleSelectSign = async (sign: string) => {
    setSelectedSign(sign);
    const dailyReading = await getDailyHoroscope(sign, user?.uid);
    setHoroscope(dailyReading);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-purple-900/90 rounded-xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">ดูดวงรายวันตามราศี</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {zodiacSigns.map((sign) => (
            <button
              key={sign.name}
              onClick={() => handleSelectSign(sign.name)}
              className={`p-4 rounded-lg transition-colors ${
                selectedSign === sign.name
                  ? 'bg-purple-500'
                  : 'bg-purple-700/50 hover:bg-purple-600/50'
              }`}
            >
              <img src={sign.image} alt={sign.name} className="w-16 h-16 mx-auto mb-2" />
              <p className="text-center font-medium">{sign.thaiName}</p>
              <p className="text-sm text-center text-purple-200">{sign.period}</p>
            </button>
          ))}
        </div>

        {horoscope && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">
              คำทำนายสำหรับ {zodiacSigns.find(s => s.name === selectedSign)?.thaiName}
            </h3>
            <p className="text-lg whitespace-pre-line">{horoscope}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          ปิด
        </button>
      </div>
    </motion.div>
  );
} 