// OpenRouter API utility for AI tarot reading

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateTarotReading(
  cards: { name: string; position: string; isReversed: boolean }[]
): Promise<string> {
  // สร้าง prompt สำหรับ AI
  const cardsList = cards
    .map((card, i) => `${i + 1}. ${card.position}: ${card.name}${card.isReversed ? ' (กลับหัว)' : ''}`)
    .join('\n');

  const prompt = `คุณเป็นผู้เชี่ยวชาญการทำนายไพ่ทาโรต์แบบ Celtic Cross จงทำนายโดยอาศัยไพ่ 10 ใบดังนี้:

${cardsList}

กรุณาทำนายโดยอธิบายความหมายของแต่ละไพ่ในตำแหน่งของมัน และให้คำทำนายรวมเป็นภาษาไทย โดยเน้นความสัมพันธ์ การงาน และการเงิน`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Tarot Reading App'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
  } catch (error) {
    console.error('AI reading error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}
