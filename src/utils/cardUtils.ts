// เพิ่ม mapping สำหรับชื่อไฟล์พิเศษ
const specialImageMap: { [key: string]: string } = {
  'Ace of Wands': 'waac',
  'Ace of Cups': 'cuac',
  'Ace of Swords': 'swac', 
  'Ace of Pentacles': 'peac',
  // เพิ่ม mapping สำหรับ court cards ของชุด Cups
  'King of Cups': 'cuki',
  'Queen of Cups': 'cuqu',
  'Knight of Cups': 'cukn',
  'Page of Cups': 'cupa',
  // เพิ่ม mapping พิเศษอื่นๆ ตามที่พบว่ามีปัญหา
  'King of Pentacles': 'peki',
  'Queen of Pentacles': 'pequ',
  'Knight of Pentacles': 'pekn',
  'Page of Pentacles': 'pepa',
  'King of Swords': 'swki',
  'Queen of Swords': 'swqu',
  'Knight of Swords': 'swkn',
  'Page of Swords': 'swpa',
  'King of Wands': 'waki',
  'Queen of Wands': 'waqu',
  'Knight of Wands': 'wakn',
  'Page of Wands': 'wapa',
};

// ฟังก์ชันแปลงชื่อไพ่เป็นรหัสรูปภาพ
export function getCardImageCode(cardName: string): string {
  // ตรวจสอบ mapping พิเศษก่อน
  if (specialImageMap[cardName]) {
    return specialImageMap[cardName];
  }

  // Major Arcana
  const majorArcanaMap: { [key: string]: string } = {
    'The Fool': 'ar00',
    'The Magician': 'ar01',
    'The High Priestess': 'ar02',
    'The Empress': 'ar03',
    'The Emperor': 'ar04',
    'The Hierophant': 'ar05',
    'The Lovers': 'ar06',
    'The Chariot': 'ar07',
    'Strength': 'ar08',
    'The Hermit': 'ar09',
    'Wheel of Fortune': 'ar10',
    'Justice': 'ar11',
    'The Hanged Man': 'ar12',
    'Death': 'ar13',
    'Temperance': 'ar14',
    'The Devil': 'ar15',
    'The Tower': 'ar16',
    'The Star': 'ar17',
    'The Moon': 'ar18',
    'The Sun': 'ar19',
    'Judgement': 'ar20',
    'The World': 'ar21'
  };

  // Minor Arcana
  const suitMap: { [key: string]: string } = {
    'Wands': 'wa',
    'Cups': 'cu',
    'Swords': 'sw',
    'Pentacles': 'pe'
  };

  // แปลงตัวเลขหรือตัวอักษรเป็นเลข 01-14
  const numberMap: { [key: string]: string } = {
    'Ace': '01',
    'Two': '02',
    'Three': '03',
    'Four': '04',
    'Five': '05',
    'Six': '06',
    'Seven': '07',
    'Eight': '08',
    'Nine': '09',
    'Ten': '10',
    'Page': '11',
    'Knight': '12',
    'Queen': '13',
    'King': '14'
  };

  // ตรวจสอบ Major Arcana
  if (majorArcanaMap[cardName]) {
    return majorArcanaMap[cardName];
  }

  // สำหรับ Minor Arcana
  const parts = cardName.split(' of ');
  if (parts.length === 2) {
    const [number, suit] = parts;
    const suitCode = suitMap[suit];
    
    // เพิ่ม logging เพื่อตรวจสอบ
    console.log('Card parts:', { number, suit });
    console.log('Suit code:', suitCode);
    console.log('Number code:', numberMap[number]);

    if (!suitCode) {
      console.warn(`ไม่พบรหัสสำหรับชุดไพ่: ${suit}`);
      return 'ar00';
    }

    const numberCode = numberMap[number];
    if (!numberCode) {
      console.warn(`ไม่พบรหัสสำหรับตัวเลข: ${number}`);
      return 'ar00';
    }

    const imageCode = `${suitCode}${numberCode}`;
    console.log('Final image code:', imageCode);
    return imageCode;
  }

  console.warn(`ไม่สามารถแปลงชื่อไพ่: ${cardName}`);
  return 'ar00';
} 