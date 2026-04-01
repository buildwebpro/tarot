interface UranianData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question?: string;
  onProgress?: (status: string) => void;
}

// Helper to get lat/lon from place name using OpenStreetMap Nominatim
async function getCoordinates(place: string): Promise<{ lat: number, lon: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`, {
      headers: {
        'Accept-Language': 'th,en-US,en;q=0.5',
      }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.warn("Geocoding failed:", e);
  }
  return null;
}

export async function getUranianReading(data: UranianData): Promise<string> {
  // 1. Get Coordinates
  data.onProgress?.('กำลังค้นหาพิกัดสถานที่เกิด...');
  let lat = 13.7563; // Default BKK
  let lon = 100.5018;

  const coords = await getCoordinates(data.birthPlace);
  if (coords) {
    lat = coords.lat;
    lon = coords.lon;
  } else {
    data.onProgress?.(`ไม่พบพิกัดของ "${data.birthPlace}" ใช้พิกัดกรุงเทพฯ เป็นค่าเริ่มต้น...`);
    await new Promise(r => setTimeout(r, 1500));
  }

  // 2. Fetch Chart Data from API
  data.onProgress?.('กำลังคำนวณผังดวงชะตาด้วยดาราศาสตร์ (Swiss Ephemeris)...');
  let chartDataStr = "";
  try {
    const apiUrl = import.meta.env.VITE_ASTROLOGY_API_URL || 'https://astrology.buildweb.pro';
    const chartRes = await fetch(`${apiUrl}/chart?date=${data.birthDate}&time=${data.birthTime}&lat=${lat}&lon=${lon}`);
    if (chartRes.ok) {
      const chartJson = await chartRes.json();
      
      chartDataStr = "ข้อมูลดาวบนท้องฟ้า ณ เวลาเกิด (จากการคำนวณจริง):\n\n";
      
      if (chartJson.six_points_identity) {
        chartDataStr += "[จุดสำคัญ]\n";
        for (const [key, val] of Object.entries(chartJson.six_points_identity)) {
          chartDataStr += `- ${key}: ${(val as any).sign}\n`;
        }
      }
      
      if (chartJson.planets_sorted) {
        chartDataStr += "\n[ตำแหน่งดาวและเรือนชะตา]\n";
        for (const p of chartJson.planets_sorted) {
          chartDataStr += `- ${p.name} (${p.symbol}): ราศี ${p.sign} (เรือนที่ ${p.house})\n`;
        }
      }

      if (chartJson.midpoints && chartJson.midpoints.length > 0) {
        chartDataStr += "\n[จุดศูนย์รังสี (Midpoints)]\n";
        for (const m of chartJson.midpoints.slice(0, 15)) {
          const atMp = m.at_midpoint.map((a: any) => a.planet).join(", ");
          chartDataStr += `- ${m.planets} = ${m.midpoint_sign} (สัมพันธ์: ${atMp})\n`;
        }
      }
    } else {
      throw new Error(`API returned ${chartRes.status}`);
    }
  } catch (error) {
    console.error("Chart API error:", error);
    data.onProgress?.('พบปัญหาการดึงข้อมูลดาว... ระบบจะใช้การคำนวณหลักการพื้นฐานแทน...');
    await new Promise(r => setTimeout(r, 1500));
  }

  // 3. Request AI Reading
  data.onProgress?.('กำลังวิเคราะห์คำทำนายและแปลผลข้อมูลดวงชะตา...');
  
  const prompt = `คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียน (Uranian Astrology) ที่มีประสบการณ์มากกว่า 20 ปี

ข้อมูลเจ้าชะตา:
- วันเกิด: ${data.birthDate}
- เวลาเกิด: ${data.birthTime}
- สถานที่เกิด: ${data.birthPlace}
${data.question ? `- คำถาม: ${data.question}` : ''}

${chartDataStr ? `--- ข้อมูลตำแหน่งดาวจากการคำนวณดาราศาสตร์จริง ---
${chartDataStr}
-----------------------------------------------------

จงใช้ข้อมูลดาราศาสตร์ที่ให้ไว้นี้เป็นหลักในการทำนายอย่างเคร่งครัด อิงตามราศี เรือน และจุดศูนย์รังสีที่มีจริงในผัง` : ''}

โปรดทำการวิเคราะห์ดวงชะตาด้วยระบบโหราศาสตร์ยูเรเนียน โดยคำนึงถึง:

1. **จุดเจ้าชะตาสำคัญ (Sensitive Points)**
   - จุดอาทิตย์ (Sun Point)
   - จุดจันทร์ (Moon Point)
   - จุดลัคนา (Ascendant Point)
   - จุดแม่ม่าย (Black Moon/Lilith)
   - จุดโชค (Part of Fortune)

2. **ดาวทิพย์ (Transneptunian Planets)**
   หากในข้อมูลดาราศาสตร์ไม่มีดาวทิพย์แนบมาด้วย ให้พิจารณาดาวที่มีอิทธิพลต่อเจ้าชะตา 
   - คิวปิโด (Cupido), ฮาเดส (Hades), เซอุส (Zeus), โครโนส (Kronos)
   - อพอลลอน (Apollon), แอดเมตอส (Admetos), วุลคานุส (Vulcanus), โพไซดอน (Poseidon)

3. **มุมดวงสำคัญ (Major Angles)**
   - วิเคราะห์มุมและเรือนชะตาต่างๆ ตามข้อมูล

4. **การทำนายครอบคลุม**
   - บุคลิกภาพและตัวตน
   - ความรักและความสัมพันธ์
   - การงานและอาชีพ
   - การเงินและความมั่งคั่ง
   - สุขภาพ
   - ดวงชะตาประจำปี

โปรดเขียนคำทำนายอย่างละเอียด เป็นมืออาชีพ แต่เข้าใจง่าย ใช้ภาษาที่สวยงามและลึกซึ้ง เหมาะสำหรับการนำไปใช้ในชีวิตจริง
คำทำนายต้องดึงข้อมูลของดาวที่คุณได้รับจาก "ข้อมูลดาวบนท้องฟ้า" มาวิเคราะห์อย่างมีหลักการ เช่น กล่าวถึงว่าดาวใดอยู่ราศีใดหรือสัมพันธ์กันอย่างไรก่อนที่จะแปลความหมายให้เจ้าชะตาฟัง

รูปแบบการตอบ:
- เริ่มต้นด้วยการเกริ่นนำเกี่ยวกับดวงชะตาและจุดเด่นของดาว
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
            content: 'คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียนที่มีความแม่นยำสูง และมีความเข้าใจการอ่านไฟล์ข้อมูลดาวในรูปแบบข้อความ'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const resData = await response.json();
    return resData.choices[0].message.content || 'ขออภัย ไม่สามารถทำนายได้ในขณะนี้';
  } catch (error) {
    console.error('Error getting Uranian reading:', error);
    return 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง';
  }
}
