import { motion } from 'framer-motion';
import type { Card } from '../types/tarot';

interface TarotCardProps {
  card: Card;
  isReversed: boolean;
  onClick?: () => void;
  isRevealed: boolean;
}

export function TarotCard({ card, isReversed, onClick, isRevealed }: TarotCardProps) {
  return (
    <motion.div
      className="relative w-64 h-96 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute w-full h-full rounded-xl shadow-xl"
        initial={false}
        animate={{
          rotateY: isRevealed ? 0 : 180,
          rotateX: isReversed && isRevealed ? 180 : 0
        }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute w-full h-full backface-hidden">
          <img
            src={card.image}
            alt={card.name}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
            <h3 className="text-white text-xl font-semibold">{card.name}</h3>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-purple-900 rounded-xl [transform:rotateY(180deg)]">
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src="https://images.unsplash.com/photo-1601024445121-e294d33f47db?w=500"
              alt="Tarot card back"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}