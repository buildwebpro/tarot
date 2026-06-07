// Centralized AI / LLM Service
// SECURITY: All LLM calls now go through Firebase Cloud Functions (generateAI)
// so that real API keys never reach the client bundle.

import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../config/firebase'; // reuse existing initialized app

const functions = getFunctions(app);
// Region ควรตรงกับที่ deploy functions (ค่าเริ่มต้น us-central1 หรือ asia-southeast1)
const generateAICallable = httpsCallable(functions, 'generateAI');

async function callLLMProxy(
  provider: 'groq' | 'deepseek' | 'minimax',
  prompt: string,
  systemPrompt?: string,
  maxTokens = 2000
): Promise<string> {
  try {
    const result = await generateAICallable({
      provider,
      prompt,
      systemPrompt,
      maxTokens,
    });
    return (result.data as string) || 'ไม่สามารถทำนายได้';
  } catch (error: any) {
    console.error(`[AI Proxy] ${provider} error:`, error);
    // Fallback message (ไม่เปิดเผยรายละเอียด)
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ AI กรุณาลองใหม่');
  }
}

// ===================== Public API =====================

/**
 * Celtic Cross (10 cards) - Groq
 */
export async function generateTarotReading(
  cards: { name: string; position: string; isReversed: boolean }[]
): Promise<string> {
  try {
    const cardsList = cards
      .map((card, i) => `${i + 1}. ${card.position}: ${card.name}${card.isReversed ? ' (กลับหัว)' : ''}`)
      .join('\n');

    const prompt = `คุณเป็นผู้เชี่ยวชาญการทำนายไพ่ทาโรต์แบบ Celtic Cross จงทำนายโดยอาศัยไพ่ 10 ใบดังนี้:

${cardsList}

กรุณาทำนายโดยอธิบายความหมายของแต่ละไพ่ในตำแหน่งของมัน และให้คำทำนายรวมเป็นภาษาไทย โดยเน้นความสัมพันธ์ การงาน และการเงิน`;

    return await callLLMProxy('groq', prompt, undefined, 2000);
  } catch (error) {
    console.error('AI tarot reading error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}

/**
 * Orekurum (32 questions) - via secure proxy
 */
export async function generateOrekurumPrediction(
  question: string,
  codePattern: string
): Promise<string> {
  try {
    const prompt = `คุณเป็นผู้เชี่ยวชาญการทำนายโอเรกุรัม จงทำนายสำหรับคำถามนี้:

คำถาม: ${question}
รหัสที่ได้: ${codePattern}

กรุณาทำนายเป็นภาษาไทย สั้นๆ ได้ใจความ (2-3 บรรทัด)`;

    return await callLLMProxy('groq', prompt, undefined, 500);
  } catch (error) {
    console.error('Orekurum AI error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}

/**
 * Daily Horoscope - via secure proxy (DeepSeek)
 */
export async function generateHoroscopeReading(
  sign: string,
  thaiName: string,
  element: string
): Promise<string> {
  try {
    const prompt = `คุณเป็นผู้เชี่ยวชาญด้านโหราศาสตร์ จงทำนายดวงชะตาประจำวันสำหรับราศี ${thaiName} (${sign}) ธาตุ${element} โดยให้คำทำนายในหัวข้อต่อไปนี้เป็นภาษาไทย:

1. ด้านความรัก
2. ด้านการงาน
3. ด้านการเงิน
4. ด้านสุขภาพ
5. สีมงคล เลขนำโชค และเวลามงคล

ให้คำทำนายที่สนุก น่าสนใจ และให้กำลังใจ ห้ามใส่วันที่หรือข้อความใดๆ ที่เป็นตัวยึดเวลา (เช่น วันที่ วันนี้ แล้วแต่วัน) ให้เขียนเสมือนเป็นคำทำนายทั่วไปที่ไม่ต้องระบุวันที่`;

    return await callLLMProxy('deepseek', prompt, undefined, 1500);
  } catch (error) {
    console.error('AI horoscope error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}

/**
 * Specialized Tarot (3-card) - via secure proxy (Minimax)
 */
export async function generateSpecializedReading(
  typeName: string,
  cardsList: string
): Promise<string> {
  try {
    const prompt = `คุณเป็นผู้เชี่ยวชาญการทำนายไพ่ทาโรต์ ให้สรุปคำทำนายจากไพ่ 3 ใบสำหรับด้าน${typeName}:

${cardsList}

กรุณาสรุปคำทำนายเป็นภาษาไทยโดย:
1. อธิบายสิ่งที่ไพ่ทั้ง 3 ใบบ่งบอกรวมกัน
2. ให้คำแนะนำที่ชัดเจนและนำไปใช้ได้จริง
3. เขียนกระชับ 2-3 ย่อหน้า`;

    return await callLLMProxy('minimax', prompt, undefined, 1000);
  } catch (error) {
    console.error('Specialized AI error:', error);
    return '';
  }
}

/**
 * Uranian Astrology - Minimax (more complex prompt)
 * Note: The detailed system prompt is kept here for now.
 */
export async function generateUranianReading(fullPrompt: string): Promise<string> {
  try {
    const systemPrompt = `คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียน (Uranian Astrology) ที่มีความเชี่ยวชาญสูง

ให้คุณวิเคราะห์ดวงชะตาอย่างละเอียดและครบถ้วน โดยอิงจากข้อมูลดาวที่ได้รับมา:

【1. จุดสำคัญ 6 จุด (Six Points Identity)】
วิเคราะห์ MC, ASC, Sun, Moon, North Node, Vertex ว่าอยู่ราศีอะไร และส่งผลต่อชีวิตด้านใด

【2. ดาวเคราะห์ในราศีและเรือน】
วิเคราะห์ดาวแต่ละดวงว่าอยู่ราศีอะไร เรือนอะไร เจ้าเรือนคือดาวอะไร มีพลังอย่างไร

【3. มุมสัมพันธ์ (Aspects)】
วิเคราะห์มุมสัมพันธ์ระหว่างดาว เช่น conjunction, opposition, square, trine, sextile ส่งผลอย่างไร

【4. จุดศูนย์รังสี (Midpoints)】
วิเคราะห์จุดศูนย์รังสีที่มีดาวสัมผัส บ่งบอกถึงพลังพิเศษด้านใด

【5. ภาพดาว (Planetary Pictures)】
วิเคราะห์ภาพดาวที่เกิดขึ้น แสดงถึงพลังงานเฉพาะทางอะไร

【6. เรือนชะตา (Houses)】
วิเคราะห์เรือนแต่ละเรือนว่ามีดาวอะไรสถิต ส่งผลต่อด้านชีวิตอะไร

【7. การวิเคราะห์ด้านต่างๆ】
- ลักษณะนิสัย บุคลิกภาพ
- ความรัก ความสัมพันธ์
- การงาน อาชีพ
- การเงิน ทรัพย์สิน
- สุขภาพ
- การเติบโตทางจิตวิญญาณ

【8. สรุปคำแนะนำสำคัญ】⚠️ ส่วนนี้สำคัญมาก ต้องเขียนให้ชัดเจน กระชับ และนำไปใช้ได้จริง:
- 🎯 **สิ่งที่สำคัญที่สุด**: สิ่งที่เจ้าชะตาควรให้ความสำคัญในชีวิต
- ⚡ **สิ่งที่ต้องระวัง**: อุปสรรค ความเสี่ยง หรือจุดอ่อนที่ต้องระวัง
- 🔥 **สิ่งที่ควรโฟกัส**: โอกาส จุดแข็ง หรือทิศทางที่ควรมุ่งเน้น

【รูปแบบการตอบ】
- ใช้ภาษาไทย
- เขียนให้ครบถ้วน ละเอียด เจาะลึก
- อ้างอิงข้อมูลดาวที่ได้รับก่อนแปลความหมาย
- ใช้ emoji ประกอบให้สวยงาม
- แบ่งเป็นหัวข้อชัดเจน
- สรุปปิดท้ายด้วยส่วน【สรุปคำแนะนำสำคัญ】ที่ชัดเจน กระชับ`;

    return await callLLMProxy('minimax', fullPrompt, systemPrompt, 8000);
  } catch (error) {
    console.error('Uranian AI error:', error);
    throw new Error('เกิดข้อผิดพลาดในการทำนายยูเรเนียน กรุณาลองใหม่');
  }
}
