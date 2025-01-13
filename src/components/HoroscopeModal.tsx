import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { zodiacSigns } from '../data/zodiac';
import { getDailyHoroscope } from '../utils/horoscope';

interface HoroscopeModalProps {
  sign: string;
  onClose: () => void;
}

export function HoroscopeModal({ sign, onClose }: HoroscopeModalProps) {
  const [horoscope, setHoroscope] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const zodiacSign = zodiacSigns.find(s => s.name === sign);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        const reading = await getDailyHoroscope(sign);
        setHoroscope(reading);
      } catch (error) {
        console.error('Error fetching horoscope:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [sign]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-6 max-w-2xl w-full shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={zodiacSign?.image} 
            alt={zodiacSign?.name} 
            className="w-16 h-16"
          />
          <div>
            <h3 className="text-2xl font-bold">{zodiacSign?.thaiName}</h3>
            <p className="text-purple-200">{zodiacSign?.period}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none">
            <div className="bg-purple-700/30 rounded-lg p-4 mb-4">
              <p className="text-lg whitespace-pre-line">{horoscope}</p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          ปิด
        </button>
      </motion.div>
    </motion.div>
  );
} 