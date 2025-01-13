import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { zodiacSigns } from '../data/zodiac';
import { getDailyHoroscope } from '../utils/horoscope';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface HoroscopeModalProps {
  sign: string;
  onClose: () => void;
}

export function HoroscopeModal({ sign, onClose }: HoroscopeModalProps) {
  const [horoscope, setHoroscope] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const zodiacSign = zodiacSigns.find(s => s.name === sign);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reading = await getDailyHoroscope(sign);
        setHoroscope(reading);
      } catch (error) {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        console.error('Error fetching horoscope:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [sign]);

  const handleRetry = () => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const reading = await getDailyHoroscope(sign);
        setHoroscope(reading);
      } catch (error) {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        console.error('Error fetching horoscope:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      {isLoading ? (
        <LoadingSpinner message="กำลังดูดวง..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleRetry} />
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-8 max-w-2xl w-full shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-purple-700/50 p-4 rounded-xl">
              <img 
                src={zodiacSign?.image} 
                alt={zodiacSign?.name} 
                className="w-20 h-20 object-contain"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">{zodiacSign?.thaiName}</h3>
              <p className="text-purple-200">{zodiacSign?.period}</p>
              <p className="text-purple-300">{zodiacSign?.element}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="bg-purple-700/30 backdrop-blur-sm rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {horoscope}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <span>ปิด</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 