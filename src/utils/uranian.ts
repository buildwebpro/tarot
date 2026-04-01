interface UranianData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question?: string;
  onProgress?: (status: string) => void;
}

class UranianError extends Error {
  constructor(
    message: string,
    public code: string,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = 'UranianError';
  }
}

const ERROR_MESSAGES: Record<string, { th: string; isRetryable: boolean }> = {
  CHART_API_FAILED: {
    th: 'ไม่สามารถดึงข้อมูลผังดวงชะตาได้ กรุณาลองใหม่ภายหลัง',
    isRetryable: true
  },
  CHART_API_NETWORK: {
    th: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ดวงชะตา กรุณาตรวจสอบอินเทอร์เน็ต',
    isRetryable: true
  },
  MINIMAX_API_FAILED: {
    th: 'ไม่สามารถสร้างคำทำนายได้ในขณะนี้ กรุณาลองใหม่ภายหลัง',
    isRetryable: true
  },
  MINIMAX_API_KEY: {
    th: 'ระบบ AI กำลังมีปัญหา กรุณาติดต่อผู้ดูแลระบบ',
    isRetryable: false
  },
  MINIMAX_NETWORK: {
    th: 'ไม่สามารถเชื่อมต่อกับระบบ AI ได้ กรุณาตรวจสอบอินเทอร์เน็ต',
    isRetryable: true
  },
};

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
  let chartApiError: UranianError | null = null;
  try {
    const isDev = import.meta.env.DEV;
    const apiBase = isDev ? '/api/astrology' : (import.meta.env.VITE_ASTROLOGY_API_URL || 'https://astrology.buildweb.pro');
    const chartRes = await fetch(`${apiBase}/chart?date=${data.birthDate}&time=${data.birthTime}&lat=${lat}&lon=${lon}&tz=7`);
    if (chartRes.ok) {
      const chartJson = await chartRes.json();
      
      chartDataStr = "ข้อมูลดาวบนท้องฟ้า ณ เวลาเกิด (จากการคำนวณจริง):\n\n";
      
      if (chartJson.six_points_identity) {
        chartDataStr += "【จุดสำคัญ 6 จุด (Six Points Identity)】\n";
        for (const [key, val] of Object.entries(chartJson.six_points_identity)) {
          const sign = (val as any).sign || '';
          const degree = (val as any).degree || '';
          const minute = (val as any).minute || '';
          chartDataStr += `- ${key}: ${sign} ${degree}°${minute}'\n`;
        }
      }
      
      if (chartJson.planets && Object.keys(chartJson.planets).length > 0) {
        chartDataStr += "\n【ดาวเคราะห์และตำแหน่งในราศี】\n";
        for (const [planet, data] of Object.entries(chartJson.planets)) {
          const sign = (data as any).sign || '';
          const degree = (data as any).degree || '';
          const minute = (data as any).minute || '';
          const house = (data as any).house ? ` (เรือน ${(data as any).house})` : '';
          chartDataStr += `- ${planet}: ${sign} ${degree}°${minute}'${house}\n`;
        }
      }

      if (chartJson.houses && Object.keys(chartJson.houses).length > 0) {
        chartDataStr += "\n【เรือนชะตา (Houses)】\n";
        for (const [house, data] of Object.entries(chartJson.houses)) {
          const sign = (data as any).sign || '';
          const degree = (data as any).degree || '';
          const minute = (data as any).minute || '';
          chartDataStr += `- เรือน ${house}: ${sign} ${degree}°${minute}'\n`;
        }
      }

      if (chartJson.aspects && chartJson.aspects.length > 0) {
        chartDataStr += "\n【มุมสัมพันธ์ระหว่างดาว (Aspects)】\n";
        for (const a of chartJson.aspects) {
          chartDataStr += `- ${a.planet1} ${a.aspect} ${a.planet2} (${a.orb}°)\n`;
        }
      }

      if (chartJson.midpoints && chartJson.midpoints.length > 0) {
        chartDataStr += "\n【จุดศูนย์รังสี (Midpoints)】\n";
        chartDataStr += "การวิเคราะห์: จุดกึ่งกลางระหว่างดาว 2 ดวง หากมีดาวดวงอื่นมาสัมผัสจะเกิดพลังพิเศษ\n";
        for (const m of chartJson.midpoints) {
          const atMp = m.at_midpoint.map((a: any) => a.planet).join(", ");
          chartDataStr += `- ${m.planets} = ${m.midpoint_sign} (ดาวสัมผัส: ${atMp || 'ไม่มี'})\n`;
        }
      }

      if (chartJson.planetary_pictures && chartJson.planetary_pictures.length > 0) {
        chartDataStr += "\n【ภาพดาว (Planetary Pictures)】\n";
        chartDataStr += "ภาพดาวคือรูปแบบพิเศษของจุดศูนย์รังสีที่มีดาว 2 ดวงมาสัมผัส แสดงถึงพลังงานเฉพาะทาง:\n";
        for (const p of chartJson.planetary_pictures.slice(0, 20)) {
          chartDataStr += `- ${p.picture}: ${p.interpretation}\n`;
        }
      }
    } else if (chartRes.status === 401 || chartRes.status === 403) {
      chartApiError = new UranianError(
        'Chart API authentication failed',
        'CHART_API_FAILED',
        false
      );
      throw chartApiError;
    } else {
      chartApiError = new UranianError(
        `Chart API returned ${chartRes.status}`,
        'CHART_API_FAILED',
        true
      );
      throw chartApiError;
    }
  } catch (error) {
    if (error instanceof UranianError) {
      console.error("Chart API error:", error.message);
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      chartApiError = new UranianError(
        'Network error: Cannot connect to chart API',
        'CHART_API_NETWORK',
        true
      );
      console.error("Chart API network error:", error);
    } else {
      console.error("Chart API error:", error);
    }
    if (chartApiError) {
      data.onProgress?.('พบปัญหาการดึงข้อมูลดาว... ระบบจะใช้การคำนวณหลักการพื้นฐานแทน...');
    }
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
- สรุปด้วยคำแนะนำที่สำคัญที่สุดสำหรับเจ้าชะตา ประกอบด้วย:
  - 🎯 สิ่งที่สำคัญที่สุด
  - ⚡ สิ่งที่ต้องระวัง
  - 🔥 สิ่งที่ควรโฟกัส
- ใช้ emoji เพื่อความสวยงามและเข้าใจง่าย`;

  try {
    const apiUrl = import.meta.env.VITE_MINIMAX_API_URL || 'https://api.minimax.io/v1/text/chatcompletion_v2';
    const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7',
        messages: [
          {
            role: 'system',
            content: `คุณเป็นโหรผู้เชี่ยวชาญด้านโหราศาสตร์ยูเรเนียน (Uranian Astrology) ที่มีความเชี่ยวชาญสูง

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
- สรุปปิดท้ายด้วยส่วน【สรุปคำแนะนำสำคัญ】ที่ชัดเจน กระชับ`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new UranianError(
          'MiniMax API key is invalid or expired',
          'MINIMAX_API_KEY',
          false
        );
      }
      throw new UranianError(
        `MiniMax API returned ${response.status}`,
        'MINIMAX_API_FAILED',
        true
      );
    }

    const resData = await response.json();
    return resData.choices[0].message.content || 'ขออภัย ไม่สามารถทำนายได้ในขณะนี้';
  } catch (error) {
    if (error instanceof UranianError) {
      console.error('Uranian API error:', error.message);
      const errorInfo = ERROR_MESSAGES[error.code];
      if (errorInfo) {
        throw new Error(errorInfo.th);
      }
      throw new Error(error.message);
    } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('MiniMax network error:', error);
      throw new Error(ERROR_MESSAGES.MINIMAX_NETWORK.th);
    }
    console.error('Error getting Uranian reading:', error);
    throw new Error('เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง');
  }
}
