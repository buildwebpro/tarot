import { dailyPredictions } from '../data/horoscope/dailyPredictions';

export async function getDailyHoroscope(sign: string): Promise<string> {
  try {
    const predictions = dailyPredictions[sign];
    if (!predictions) {
      throw new Error('ไม่พบข้อมูลสำหรับราศีนี้');
    }

    // สุ่มเลือกคำทำนายจากแต่ละหมวด
    const randomPrediction = (arr: string[]) => 
      arr[Math.floor(Math.random() * arr.length)];

    const luckyColor = randomPrediction(predictions.lucky.colors);
    const luckyNumber = randomPrediction(predictions.lucky.numbers);
    const luckyTime = randomPrediction(predictions.lucky.times);

    return `
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
  } catch (error) {
    console.error('Error generating horoscope:', error);
    return 'ขออภัย ไม่สามารถดูดวงได้ในขณะนี้';
  }
} 