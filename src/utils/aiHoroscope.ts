// DeepSeek API utility for AI horoscope reading

const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

export async function generateHoroscopeReading(sign: string, thaiName: string, element: string): Promise<string> {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านโหราศาสตร์ จงทำนายดวงชะตาประจำวันสำหรับราศี ${thaiName} (${sign}) ธาตุ${element} โดยให้คำทำนายในหัวข้อต่อไปนี้เป็นภาษาไทย:

1. ด้านความรัก
2. ด้านการงาน
3. ด้านการเงิน
4. ด้านสุขภาพ
5. สีมงคล เลขนำโชค และเวลามงคล

ให้คำทำนายที่สนุก น่าสนใจ และให้กำลังใจ ห้ามใส่วันที่หรือข้อความใดๆ ที่เป็นตัวยึดเวลา (เช่น วันที่ วันนี้ แล้วแต่วัน) ให้เขีย��เสมือนเป็นคำทำนายทั่วไปที่ไม่ต้องระบุวันที่`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
      if (response.status === 401) {
        throw new Error('DeepSeek API key is invalid or expired');
      }
      throw new Error(`DeepSeek API returned ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
  } catch (error) {
    console.error('AI horoscope error:', error);
    return 'เกิดข้อผิดพลาดในการทำนาย กรุณาลองใหม่ภายหลัง';
  }
}
