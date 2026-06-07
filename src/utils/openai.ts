/**
 * Local (rule-based) Tarot interpretation.
 * This file does NOT call any LLM / OpenAI.
 * It builds a reading from local tarotMeanings data only.
 *
 * @deprecated filename - consider renaming to localTarot.ts in future cleanup.
 */

import type { Card } from '../types/tarot';
import { tarotMeanings } from '../data/tarotMeanings';

interface DetailedReading {
  card: string;
  position: string;
  meanings: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
}

// ฟังก์ชันช่วยจัดรูปแบบการอ่านไพ่แต่ละด้าน
const formatReadings = (readings: DetailedReading[], aspect: keyof DetailedReading['meanings']) => {
  return readings
    .map(r => [
      `• ${r.card} (${r.position}):`,  // แยกชื่อไพ่กับความหมายออกเป็นบรรทัด
      `    ${r.meanings[aspect]}`      // ย่อหน้าความหมาย
    ].join('\n'))
    .join('\n\n');  // เว้น 2 บรรทัดระหว่างแต่ละไพ่
};

// ฟังก์ชันสร้างส่วนของการทำนาย
const createSection = (title: string, content: string) => {
  return `
${title} ${'-'.repeat(45)}
${content}

`;  // ใช้ template literal เพื่อรักษาการเว้นบรรทัด
};

// ฟังก์ชันสร้างคำแนะนำ
function generateAdvice(readings: Array<{ position: string }>) {
  const hasReversed = readings.some(r => r.position === 'กลับหัว');
  
  return [
    'ในช่วงเวลานี้ คุณควรใช้สติและความรอบคอบในการตัดสินใจ',
    '',
    'พิจารณาทุกด้านอย่างถี่ถ้วน และเชื่อมั่นในศักยภาพของตัวเอง',
    '',
    hasReversed 
      ? 'ระมัดระวังในการตัดสินใจสำคัญ และอย่าประมาท' 
      : 'เป็นช่วงเวลาที่ดีในการเริ่มต้นสิ่งใหม่ๆ'
  ].join('\n');
}

export async function getTarotReading(cards: Card[], isReversed: boolean[]) {
  try {
    // สร้างคำทำนายพื้นฐานจากไพ่ที่ได้
    const basicReading = cards
      .map((card, i) => {
        const position = isReversed[i] ? '(กลับหัว)' : '';
        return `${card.name} ${position}`;
      })
      .join(' • ');

    // สร้างคำทำนายแบบละเอียด
    const detailedReadings = cards.map((card, i) => {
      const position = isReversed[i] ? 'reversed' : 'upright';
      const cardMeaning = tarotMeanings[card.name];
      
      if (!cardMeaning) {
        console.warn(`ไม่พบความหมายของไพ่ ${card.name} ในฐานข้อมูล`);
        return {
          card: card.name,
          position: isReversed[i] ? 'กลับหัว' : 'หงายขึ้น',
          meanings: {
            love: 'ไม่พบข้อมูล',
            career: 'ไม่พบข้อมูล',
            finance: 'ไม่พบข้อมูล',
            health: 'ไม่พบข้อมูล'
          }
        };
      }

      return {
        card: card.name,
        position: isReversed[i] ? 'กลับหัว' : 'หงายขึ้น',
        meanings: cardMeaning[position]
      };
    });

    // สร้างแต่ละส่วนของการทำนาย
    const introSection = `🔮 ไพ่ที่คุณได้รับ
${basicReading}

`;
    
    const loveSection = createSection(
      '❤️ ด้านความรัก',
      formatReadings(detailedReadings, 'love')
    );
    
    const financeSection = createSection(
      '💰 ด้านการเงิน',
      formatReadings(detailedReadings, 'finance')
    );
    
    const careerSection = createSection(
      '💼 ด้านการงาน',
      formatReadings(detailedReadings, 'career')
    );
    
    const healthSection = createSection(
      '🧘‍♀️ ด้านสุขภาพ',
      formatReadings(detailedReadings, 'health')
    );
    
    // สรุปคำแนะนำ
    const adviceSection = createSection(
      '💡 สรุปคำแนะนำ',
      generateAdvice(detailedReadings)
    );

    // รวมทุกส่วนเข้าด้วยกันโดยใช้ template literal
    return `${introSection}${loveSection}${financeSection}${careerSection}${healthSection}${adviceSection}`;

  } catch (error) {
    console.error('Error during tarot reading:', error);
    return "ขออภัย ไม่สามารถทำนายได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
  }
}