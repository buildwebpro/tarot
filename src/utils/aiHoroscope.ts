// OpenRouter API utility for AI horoscope reading

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateHoroscopeReading(sign: string, thaiName: string, element: string): Promise<string> {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านโหราศาสตร์ จงทำนายดวงชะตาประจำวันสำหรับราศี ${thaiName} (${sign}) ธาตุ${element} โดยให้คำทำนายในหัวข้อต่อไปนี้เป็นภาษาไทย:

1. ด้านความรัก
2. ด้านการงาน
3. ด้านการเงิน
4. ด้านสุขภาพ
5. สีมงคล เลขนำโชค และเวลามงคล

ให้คำทำนายที่สนุก น่าสนใจ และให้กำลังใจ`;

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
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
  } catch (error) {
    console.error('AI horoscope error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}
