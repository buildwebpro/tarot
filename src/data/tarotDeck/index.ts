import type { Card } from '../../types/tarot';
import { majorArcanaMeanings } from '../tarotMeanings/majorArcana';
import { minorArcanaMeanings } from '../tarotMeanings/minorArcana';
import { getCardImageCode } from '../../utils/cardUtils';

const BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img';

// สร้าง Card array จาก meanings
const tarotDeck: Card[] = [
  // Major Arcana
  ...Object.entries(majorArcanaMeanings).map(([name, meaning]) => {
    const imageCode = getCardImageCode(name);
    const imageUrl = `${BASE_URL}/${imageCode}.jpg`;
    
    return {
      name,
      image: imageUrl,
      meaning: {
        love: {
          upright: meaning.upright.love,
          reversed: meaning.reversed.love
        },
        career: {
          upright: meaning.upright.career,
          reversed: meaning.reversed.career
        },
        finance: {
          upright: meaning.upright.finance,
          reversed: meaning.reversed.finance
        },
        health: {
          upright: meaning.upright.health,
          reversed: meaning.reversed.health
        }
      }
    };
  }),
  // Minor Arcana
  ...Object.entries(minorArcanaMeanings).map(([name, meaning]) => {
    const imageCode = getCardImageCode(name);
    const imageUrl = `${BASE_URL}/${imageCode}.jpg`;
    
    return {
      name,
      image: imageUrl,
      meaning: {
        love: {
          upright: meaning.upright.love,
          reversed: meaning.reversed.love
        },
        career: {
          upright: meaning.upright.career,
          reversed: meaning.reversed.career
        },
        finance: {
          upright: meaning.upright.finance,
          reversed: meaning.reversed.finance
        },
        health: {
          upright: meaning.upright.health,
          reversed: meaning.reversed.health
        }
      }
    };
  })
];

export { tarotDeck }; 