import { majorArcanaMeanings } from './majorArcana';
import { minorArcanaMeanings } from './minorArcana';

// สร้าง base meanings สำหรับแต่ละตำแหน่งในการวางไพ่แบบ Celtic Cross
const baseMeanings = {
  // Major Arcana
  ...Object.entries(majorArcanaMeanings).reduce((acc, [name, meaning]) => ({
    ...acc,
    [name]: {
      position1: { // ตำแหน่งที่ 1: สถานการณ์ปัจจุบัน
        upright: `สถานการณ์ปัจจุบัน: ${meaning.upright.general || meaning.upright.love}`,
        reversed: `สถานการณ์ปัจจุบัน: ${meaning.reversed.general || meaning.reversed.love}`
      },
      position2: { // ตำแหน่งที่ 2: อุปสรรค/สิ่งที่ท้าทาย
        upright: `สิ่งที่ท้าทาย: ${meaning.upright.general || meaning.upright.career}`,
        reversed: `สิ่งที่ท้าทาย: ${meaning.reversed.general || meaning.reversed.career}`
      },
      position3: { // ตำแหน่งที่ 3: อดีต
        upright: `รากฐานจากอดีต: ${meaning.upright.general || meaning.upright.finance}`,
        reversed: `รากฐานจากอดีต: ${meaning.reversed.general || meaning.reversed.finance}`
      },
      position4: { // ตำแหน่งที่ 4: อนาคตอันใกล้
        upright: `อนาคตอันใกล้: ${meaning.upright.general || meaning.upright.health}`,
        reversed: `อนาคตอันใกล้: ${meaning.reversed.general || meaning.reversed.health}`
      },
      position5: { // ตำแหน่งที่ 5: เป้าหมายที่เป็นไปได้
        upright: `เป้าหมายที่เป็นไปได้: ${meaning.upright.general}`,
        reversed: `เป้าหมายที่เป็นไปได้: ${meaning.reversed.general}`
      },
      position6: { // ตำแหน่งที่ 6: อนาคตที่กำลังจะมาถึง
        upright: `อนาคตที่กำลังจะมาถึง: ${meaning.upright.general}`,
        reversed: `อนาคตที่กำลังจะมาถึง: ${meaning.reversed.general}`
      },
      position7: { // ตำแหน่งที่ 7: ความรู้สึกของคุณ
        upright: `ความรู้สึกของคุณ: ${meaning.upright.general}`,
        reversed: `ความรู้สึกของคุณ: ${meaning.reversed.general}`
      },
      position8: { // ตำแหน่งที่ 8: อิทธิพลภายนอก
        upright: `อิทธิพลภายนอก: ${meaning.upright.general}`,
        reversed: `อิทธิพลภายนอก: ${meaning.reversed.general}`
      },
      position9: { // ตำแหน่งที่ 9: ความหวังและความกลัว
        upright: `ความหวังและความกลัว: ${meaning.upright.general}`,
        reversed: `ความหวังและความกลัว: ${meaning.reversed.general}`
      },
      position10: { // ตำแหน่งที่ 10: ผลลัพธ์สุดท้าย
        upright: `ผลลัพธ์สุดท้าย: ${meaning.upright.general}`,
        reversed: `ผลลัพธ์สุดท้าย: ${meaning.reversed.general}`
      }
    }
  }), {}),

  // Minor Arcana - ทำแบบเดียวกัน
  ...Object.entries(minorArcanaMeanings).reduce((acc, [name, meaning]) => ({
    ...acc,
    [name]: {
      position1: {
        upright: `สถานการณ์ปัจจุบัน: ${meaning.upright.general || meaning.upright.love}`,
        reversed: `สถานการณ์ปัจจุบัน: ${meaning.reversed.general || meaning.reversed.love}`
      },
      // ... ทำเหมือนกับ Major Arcana ทุกตำแหน่ง
      position10: {
        upright: `ผลลัพธ์สุดท้าย: ${meaning.upright.general}`,
        reversed: `ผลลัพธ์สุดท้าย: ${meaning.reversed.general}`
      }
    }
  }), {})
};

// ความหมายเฉพาะที่ต้องการแก้ไขเพิ่มเติม
const customMeanings = {
  "The Empress": {
    position1: {
      upright: "สถานการณ์ปัจจุบัน: แสดงถึงความอุดมสมบูรณ์และการเติบโตในชีวิต",
      reversed: "สถานการณ์ปัจจุบัน: กำลังเผชิญกับความไม่มั่นคงในชีวิต"
    },
    // สามารถกำหนดความหมายเฉพาะสำหรับแต่ละตำแหน่งได้
    position10: {
      upright: "ผลลัพธ์สุดท้าย: จะได้รับพรแห่งความอุดมสมบูรณ์และความสำเร็จ",
      reversed: "ผลลัพธ์สุดท้าย: ต้องระวังเรื่องการพึ่งพาผู้อื่นมากเกินไป"
    }
  }
  // เพิ่มความหมายเฉพาะสำหรับไพ่อื่นๆ ตามต้องการ
};

// รวมความหมายทั้งหมด
export const celticCrossMeanings = {
  ...baseMeanings,
  ...customMeanings
};

// Celtic Cross positions and their meanings
export const celticCrossPositions = {
  1: "สถานการณ์ปัจจุบัน - สิ่งที่มีผลต่อผู้ถาม",
  2: "อุปสรรค - สิ่งที่ขัดขวางหรือท้าทาย",
  3: "รากฐาน - สิ่งที่เกิดขึ้นในอดีต",
  4: "สิ่งที่ผ่านพ้น - อิทธิพลที่กำลังจะหมดไป",
  5: "เป้าหมาย - สิ่งที่เป็นไปได้ในอนาคต",
  6: "อนาคต - สิ่งที่กำลังจะเกิดขึ้น",
  7: "ความรู้สึก - ทัศนคติของผู้ถาม",
  8: "สิ่งแวดล้อม - อิทธิพลภายนอก",
  9: "ความหวังและความกลัว",
  10: "ผลลัพธ์สุดท้าย"
};

// Helper function สำหรับดึงความหมายตามตำแหน่ง
export const getCelticCrossMeaning = (
  cardName: string,
  position: number,
  isReversed: boolean
): string => {
  const card = celticCrossMeanings[cardName];
  if (!card || !card.positions[position]) {
    return "ไม่พบความหมายสำหรับตำแหน่งนี้";
  }
  return isReversed ? 
    card.positions[position].reversed : 
    card.positions[position].upright;
}; 