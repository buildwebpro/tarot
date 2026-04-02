import { motion } from 'framer-motion';
import type { Card } from '../types/tarot';

interface TarotCardProps {
  card: Card;
  isReversed?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
}

export function TarotCard({ card, isReversed = false, isRevealed = false, onClick }: TarotCardProps) {
  return (
    <motion.div
      className={`relative w-56 h-80 sm:w-64 sm:h-96 cursor-pointer perspective-1000 ${isRevealed ? '' : 'hover:scale-105'}`}
      onClick={onClick}
      whileHover={{ scale: isRevealed ? 1 : 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`relative w-full h-full transition-transform duration-1000 transform-style-3d ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* ด้านหน้าไพ่ (ปก) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-cosmic-600 shadow-xl">
          <img
            src="/card-back.jpg"
            alt="Card Back"
            className="w-full h-full object-contain bg-cosmic-900"
          />
        </div>

        {/* ด้านหลังไพ่ (รูปไพ่) */}
        <div 
          className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 border-cosmic-600 shadow-xl ${
            isReversed ? 'rotate-180' : ''
          }`}
        >
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-contain bg-cosmic-900"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}