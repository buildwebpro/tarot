import type { Card } from '../../types/tarot';
import { majorArcanaMeanings } from '../tarotMeanings/majorArcana';
import { minorArcanaMeanings } from '../tarotMeanings/minorArcana';
import type { TarotMeaning } from '../tarotMeanings';
import { getCardImageCode } from '../../utils/cardUtils';

const BASE_URL = 'https://www.sacred-texts.com/tarot/pkt/img';

// เพิ่มฟังก์ชันตรวจสอบรูปภาพ
async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// สร้าง Card array จาก meanings
const tarotDeck: Card[] = [
  // Major Arcana
  ...Object.entries(majorArcanaMeanings).map(([name, meaning]) => {
    const imageCode = getCardImageCode(name);
    const imageUrl = `${BASE_URL}/${imageCode}.jpg`;
    
    // ตรวจสอบและ log ข้อมูล
    console.log(`Checking image for ${name}:`, imageUrl);
    checkImageExists(imageUrl).then(exists => {
      if (!exists) {
        console.warn(`ไม่พบรูปภาพสำหรับไพ่: ${name} (${imageUrl})`);
      }
    });

    return {
      name,
      image: imageUrl,
      meaning: {
        upright: [
          meaning.upright.love,
          meaning.upright.career,
          meaning.upright.finance,
          meaning.upright.health
        ],
        reversed: [
          meaning.reversed.love,
          meaning.reversed.career,
          meaning.reversed.finance,
          meaning.reversed.health
        ]
      }
    };
  }),
  // Minor Arcana
  ...Object.entries(minorArcanaMeanings).map(([name, meaning]) => {
    const imageCode = getCardImageCode(name);
    const imageUrl = `${BASE_URL}/${imageCode}.jpg`;
    
    // ตรวจสอบและ log ข้อมูล
    console.log(`Checking image for ${name}:`, imageUrl);
    checkImageExists(imageUrl).then(exists => {
      if (!exists) {
        console.warn(`ไม่พบรูปภาพสำหรับไพ่: ${name} (${imageUrl})`);
      }
    });

    return {
      name,
      image: imageUrl,
      meaning: {
        upright: [
          meaning.upright.love,
          meaning.upright.career,
          meaning.upright.finance,
          meaning.upright.health
        ],
        reversed: [
          meaning.reversed.love,
          meaning.reversed.career,
          meaning.reversed.finance,
          meaning.reversed.health
        ]
      }
    };
  })
];

// Debug information
console.log('Total cards in deck:', tarotDeck.length);
console.log('Available cards:', tarotDeck.map(card => ({
  name: card.name,
  image: card.image,
  imageExists: checkImageExists(card.image)
})));

export { tarotDeck }; 