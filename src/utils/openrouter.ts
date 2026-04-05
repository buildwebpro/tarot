// Groq API utility for AI tarot reading

const API_URL = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateTarotReading(
  cards: { name: string; position: string; isReversed: boolean }[]
): Promise<string> {
  const cardsList = cards
    .map((card, i) => `${i + 1}. ${card.position}: ${card.name}${card.isReversed ? ' (กลับหัว)' : ''}`)
    .join('\n');

  const prompt = `คุณเป็นผู้เชี่ยวชาญการทำนายไพ่ทาโรต์แบบ Celtic Cross จงทำนายโดยอาศัยไพ่ 10 ใบดังนี้:

${cardsList}

กรุณาทำนายโดยอธิบายความหมายของแต่ละไพ่ในตำแหน่งของมัน และให้คำทำนายรวมเป็นภาษาไทย โดยเน้นความสัมพันธ์ การงาน และการเงิน`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
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
      if (response.status === 401) {
        throw new Error('Groq API key is invalid or expired');
      }
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
  } catch (error) {
    console.error('AI reading error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}