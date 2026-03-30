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
      className="fixed inset-0 bg-cosmic-980/80 backdrop-blur-md flex items-center justify-center p-4 z-[60] overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen py-8 flex items-center justify-center w-full">
        {isLoading ? (
          <LoadingSpinner message="กำลังสแกนดวงดาวและทำนาย..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRetry} />
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="glass-panel border border-cosmic-700/50 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-[0_0_50px_rgba(234,179,8,0.15)] relative flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-stardust-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-stardust-600/10 rounded-full blur-[80px]"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 relative z-10">
              <div className="glass-card bg-cosmic-800/50 p-6 rounded-2xl border border-cosmic-600/50 shrink-0">
                <img
                  src={zodiacSign?.image}
                  alt={zodiacSign?.name}
                  className="w-24 h-24 object-contain mix-blend-screen opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
              </div>
              <div className="text-center sm:text-left mt-2 sm:mt-0">
                <h3 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-white to-stardust-500 drop-shadow-sm">
                  {zodiacSign?.thaiName}
                </h3>
                <p className="text-stardust-400 font-medium mb-1 tracking-wide">{zodiacSign?.period}</p>
                <p className="text-cosmic-300 text-sm">{zodiacSign?.element}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none flex-1 overflow-y-auto relative z-10 custom-scrollbar pr-2">
              <div className="glass-card bg-cosmic-900/30 border border-cosmic-700/30 rounded-2xl p-6 sm:p-8">
                <p className="text-lg leading-relaxed whitespace-pre-line text-cosmic-100 font-light">
                  {horoscope}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-cosmic-800/50 relative z-10">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-cosmic-700 to-cosmic-900 border border-cosmic-600 hover:border-stardust-500 text-white rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] uppercase tracking-widest flex items-center gap-2"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 