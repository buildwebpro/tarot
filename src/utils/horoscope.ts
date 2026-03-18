import { dailyPredictions } from '../data/horoscope/dailyPredictions';
import { zodiacSigns } from '../data/zodiac';
import { saveReading } from './history';
import { generateHoroscopeReading } from './aiHoroscope';
import { v4 as uuidv4 } from 'uuid';

export async function getDailyHoroscope(sign: string): Promise<string> {
  try {
    const predictions = dailyPredictions[sign];
    if (!predictions) {
      throw new Error('ไม่พบข้อมูลสำหรับราศีนี้');
    }

    // ดึงข้อมูลราศีจาก zodiac
    const zodiacSign = zodiacSigns.find(z => z.name === sign);
    const thaiName = zodiacSign?.thaiName || sign;
    const element = zodiacSign?.element || '';

    // เรียก AI ทำนาย
    const reading = await generateHoroscopeReading(sign, thaiName, element);

    // บันทึกประวัติ
    saveReading({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'zodiac',
      reading,
      details: {
        sign,
        thaiName
      }
    });

    return reading;
  } catch (error) {
    console.error('Error generating horoscope:', error);

    // ถ้า AI ไม่ได้ ใช้ fallback ของเดิม
    try {
      const predictions = dailyPredictions[sign];
      const zodiacSign = zodiacSigns.find(z => z.name === sign);

      const randomPrediction = (arr: string[]) =>
        arr[Math.floor(Math.random() * arr.length)];

      const luckyColor = randomPrediction(predictions.lucky.colors);
      const luckyNumber = randomPrediction(predictions.lucky.numbers);
      const luckyTime = randomPrediction(predictions.lucky.times);

      const fallbackReading = `
💘 ด้านความรัก
${randomPrediction(predictions.love)}

💼 ด้านการงาน
${randomPrediction(predictions.career)}

💰 ด้านการเงิน
${randomPrediction(predictions.finance)}

🏥 ด้านสุขภาพ
${randomPrediction(predictions.health)}

✨ สิ่งมงคลประจำวัน
🎨 สีมงคล: ${luckyColor}
🔢 เลขนำโชค: ${luckyNumber}
⏰ เวลามงคล: ${luckyTime}
      `;

      saveReading({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        type: 'zodiac',
        reading: fallbackReading,
        details: {
          sign,
          thaiName: zodiacSign?.thaiName
        }
      });

      return fallbackReading;
    } catch (fallbackError) {
      return 'ขออภัย ไม่สามารถดูดวงได้ในขณะนี้';
    }
  }
}
