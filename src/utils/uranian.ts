interface UranianData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question?: string;
}

export async function getUranianReading(data: UranianData): Promise<string> {
  const prompt = `คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียน (Uranian Astrology) ที่มีประสบการณ์มากกว่า 20 ปี

ข้อมูลเจ้าชะตา:
- วันเกิด: ${data.birthDate}
- เวลาเกิด: ${data.birthTime}
- สถานที่เกิด: ${data.birthPlace}
${data.question ? `- คำถาม: ${data.question}` : ''}

โปรดทำการวิเคราะห์ดวงชะตาด้วยระบบโหราศาสตร์ยูเรเนียน โดยคำนึงถึง:

1. **จุดเจ้าชะตาสำคัญ (Sensitive Points)**
   - จุดอาทิตย์ (Sun Point)
   - จุดจันทร์ (Moon Point)
   - จุดลัคนา (Ascendant Point)
   - จุดแม่ม่าย (Black Moon/Lilith)
   - จุดโชค (Part of Fortune)

2. **ดาวทิพย์ (Transneptunian Planets)**
   - คิวปิโด (Cupido) - ความรัก ความสัมพันธ์
   - ฮาเดส (Hades) - การเปลี่ยนแปลง ลึกซึ้ง
   - เซอุส (Zeus) - พลังอำนาจ ความสำเร็จ
   - โครโนส (Kronos) - วินัย ความรับผิดชอบ
   - อพอลลอน (Apollon) - ความคิดสร้างสรรค์
   - แอดเมตอส (Admetos) - ความอดทน การรอคอย
   - วุลคานุส (Vulcanus) - การทำงานหนัก
   - โพไซดอน (Poseidon) - จิตวิญญาณ

3. **มุมดวงสำคัญ (Major Angles)**
   - วิเคราะห์มุม 0°, 90°, 180°, 120°, 60°
   - พิจารณาเรือนชะตาทั้ง 12 เรือน

4. **การทำนายครอบคลุม**
   - บุคลิกภาพและตัวตน
   - ความรักและความสัมพันธ์
   - การงานและอาชีพ
   - การเงินและความมั่งคั่ง
   - สุขภาพ
   - ดวงชะตาประจำปี

โปรดเขียนคำทำนายอย่างละเอียด เป็นมืออาชีพ แต่เข้าใจง่าย ใช้ภาษาที่สวยงามและลึกซึ้ง เหมาะสำหรับการนำไปใช้ในชีวิตจริง

รูปแบบการตอบ:
- เริ่มต้นด้วยการเกริ่นนำเกี่ยวกับดวงชะตาโดยรวม
- แบ่งเป็นส่วนๆ ตามหัวข้อด้านบน
- สรุปด้วยคำแนะนำที่สำคัญที่สุดสำหรับเจ้าชะตา
- ใช้ emoji เพื่อความสวยงามและเข้าใจง่าย`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียนที่มีความแม่นยำสูง'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content || 'ขออภัย ไม่สามารถทำนายได้ในขณะนี้';
  } catch (error) {
    console.error('Error getting Uranian reading:', error);
    return 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ กรุณาลองใหม่อีกครั้ง';
  }
}
