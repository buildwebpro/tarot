// LINE บอทดูดวงรายวัน (webhook + cron) — ใช้ D1 + DeepSeek

const ZODIACS = [
  ['aries','ราศีเมษ'],['taurus','ราศีพฤษภ'],['gemini','ราศีเมถุน'],['cancer','ราศีกรกฎ'],
  ['leo','ราศีสิงห์'],['virgo','ราศีกันย์'],['libra','ราศีตุลย์'],['scorpio','ราศีพิจิก'],
  ['sagittarius','ราศีธนู'],['capricorn','ราศีมังกร'],['aquarius','ราศีกุมภ์'],['pisces','ราศีมีน'],
];
const ZNAME = Object.fromEntries(ZODIACS);

const todayBKK = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const thaiDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  const mo = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return `${d} ${mo[m - 1]} ${y + 543}`;
};
const formatReading = (zodiac, date, text) => `🔮 ${ZNAME[zodiac]} · ${thaiDate(date)}\n\n${text}`;

// ---------- LINE ----------
export async function verifySignature(secret, body, signature) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return btoa(String.fromCharCode(...new Uint8Array(sig))) === signature;
}
const lineApi = (env, path, body) => fetch(`https://api.line.me/v2/bot/${path}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.LINE_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
const reply = (env, replyToken, messages) => lineApi(env, 'message/reply', { replyToken, messages });
const multicast = (env, to, messages) => lineApi(env, 'message/multicast', { to, messages });

const zodiacQuickReply = (text) => ({
  type: 'text', text,
  quickReply: { items: ZODIACS.map(([k, th]) => ({
    type: 'action',
    action: { type: 'postback', label: th.replace('ราศี', ''), data: `zodiac=${k}`, displayText: th },
  })) },
});

// ---------- DeepSeek ----------
async function genReading(env, zodiac, date) {
  const r = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-chat', temperature: 0.9, max_tokens: 400,
      messages: [
        { role: 'system', content: `คุณคือ ${env.PERSONA} เขียนดวงรายวันภาษาไทยสำหรับส่งทาง LINE
กติกา: ความยาว 90-130 คำ แบ่ง 3 ย่อหน้าสั้น: ภาพรวมวัน / ความรัก+การงาน+การเงิน (เลือกพูดแค่ 2 ด้านที่เด่นวันนี้) / คำแนะนำ 1 ข้อ + เลขหรือสีมงคล
ห้ามใช้คำว่า "พลังงาน" "จักรวาล" "ก้าวเดิน" ห้ามขึ้นต้นด้วยชื่อราศี ห้าม emoji เกิน 2 ตัว ห้ามหัวข้อ markdown` },
        { role: 'user', content: `วันที่ ${thaiDate(date)} ${ZNAME[zodiac]}` },
      ],
    }),
  });
  if (!r.ok) throw new Error(`deepseek ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.choices[0].message.content.trim();
}

// ---------- D1 ----------
async function getReading(env, zodiac, date) {
  const row = await env.DB.prepare('SELECT text FROM daily_readings WHERE reading_date=? AND zodiac=?')
    .bind(date, zodiac).first();
  if (row) return row.text;
  const text = await genReading(env, zodiac, date);
  await env.DB.prepare('INSERT OR IGNORE INTO daily_readings (reading_date, zodiac, text) VALUES (?,?,?)')
    .bind(date, zodiac, text).run();
  return text;
}
const upsertUser = (env, uid, zodiac) => env.DB.prepare(`
  INSERT INTO line_users (line_user_id, zodiac) VALUES (?1, ?2)
  ON CONFLICT(line_user_id) DO UPDATE SET
    zodiac = COALESCE(?2, zodiac), updated_at = datetime('now')`).bind(uid, zodiac ?? null).run();

// ---------- Webhook ----------
export async function handleEvent(env, ev) {
  const uid = ev.source?.userId;
  if (!uid) return;
  const date = todayBKK();

  if (ev.type === 'follow') {
    await upsertUser(env, uid, null);
    return reply(env, ev.replyToken, [zodiacQuickReply('สวัสดี 🙏 เลือกราศีของคุณก่อน แล้วกด "ดูดวงวันนี้" ได้ทุกวัน')]);
  }

  if (ev.type === 'postback' && ev.postback?.data?.startsWith('zodiac=')) {
    const zodiac = ev.postback.data.slice(7);
    if (!ZNAME[zodiac]) return;
    await upsertUser(env, uid, zodiac);
    const text = await getReading(env, zodiac, date);
    return reply(env, ev.replyToken, [
      { type: 'text', text: `บันทึก${ZNAME[zodiac]}แล้ว ✅ นี่คือดวงวันนี้ของคุณ` },
      { type: 'text', text: formatReading(zodiac, date, text) },
    ]);
  }

  if (ev.type === 'message' && ev.message?.type === 'text') {
    const t = ev.message.text.trim();
    if (/เปลี่ยนราศี|เลือกราศี/.test(t))
      return reply(env, ev.replyToken, [zodiacQuickReply('เลือกราศีใหม่ได้เลย')]);

    if (/ดูดวง|ดวงวันนี้|วันนี้/.test(t)) {
      const row = await env.DB.prepare('SELECT zodiac FROM line_users WHERE line_user_id=?').bind(uid).first();
      if (!row?.zodiac) return reply(env, ev.replyToken, [zodiacQuickReply('ยังไม่ได้เลือกราศี เลือกก่อนนะ')]);
      const text = await getReading(env, row.zodiac, date);
      return reply(env, ev.replyToken, [{ type: 'text', text: formatReading(row.zodiac, date, text) }]);
    }

    return reply(env, ev.replyToken, [{ type: 'text',
      text: 'พิมพ์ "ดูดวงวันนี้" เพื่อดูดวง หรือ "เปลี่ยนราศี" เพื่อเลือกใหม่' }]);
  }
}

// ---------- Cron: gen 12 ราศี + push ให้ paid ----------
export async function dailyPush(env) {
  const date = todayBKK();
  for (const [zodiac] of ZODIACS) {
    const text = await getReading(env, zodiac, date);
    const { results } = await env.DB.prepare(`
      SELECT line_user_id FROM line_users
      WHERE zodiac=? AND tier='paid' AND (paid_until IS NULL OR paid_until >= ?)`).bind(zodiac, date).all();
    const ids = results.map(r => r.line_user_id);
    let status = 'ok';
    for (let i = 0; i < ids.length; i += 500) {
      const r = await multicast(env, ids.slice(i, i + 500), [{ type: 'text', text: formatReading(zodiac, date, text) }]);
      if (!r.ok) status = `error ${r.status}: ${await r.text()}`;
    }
    await env.DB.prepare('INSERT INTO push_log (reading_date, zodiac, recipients, status) VALUES (?,?,?,?)')
      .bind(date, zodiac, ids.length, status).run();
  }
}


export const isZodiac = z => !!ZNAME[z];
export { getReading, formatReading, todayBKK, ZNAME };
