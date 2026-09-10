// ดูดวง.online — Worker เดียว: หน้าเว็บ (assets) + /api/* + LINE bot + cron
import { computeChart } from './chart.js';
import { verifyFirebaseToken, generateAI } from './auth-ai.js';
import { verifySignature, handleEvent, dailyPush, getReading, formatReading, todayBKK, isZodiac } from './line.js';

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra } });
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function requireUser(req, env) {
  const auth = req.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  return verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // ---- ผังดวง (Swiss Ephemeris) — รองรับทั้ง path ใหม่และ path เดิมของ vite proxy ----
    if (path === '/api/chart' || path === '/api/astrology/chart') {
      try {
        const q = Object.fromEntries(url.searchParams);
        if (!q.date) return json({ error: 'date required (YYYY-MM-DD)' }, 400, CORS);
        const chart = await computeChart(q);
        return json(chart, 200, { ...CORS, 'Cache-Control': 'public, max-age=86400' });
      } catch (e) { return json({ error: String(e.message || e) }, 400, CORS); }
    }

    // ---- LLM proxy (แทน Firebase Functions generateAI) ----
    if (path === '/api/ai' && req.method === 'POST') {
      const user = await requireUser(req, env);
      if (!user) return json({ error: 'ต้องเข้าสู่ระบบก่อนเรียกใช้งาน AI' }, 401, CORS);
      let body;
      try { body = await req.json(); } catch { return json({ error: 'invalid json' }, 400, CORS); }
      if (!body.prompt || typeof body.prompt !== 'string') return json({ error: 'prompt is required' }, 400, CORS);
      const t0 = Date.now();
      try {
        const { text, usage } = await generateAI(env, body);
        ctx.waitUntil(env.DB.prepare('INSERT INTO ai_log (uid, provider, kind, tokens, ms) VALUES (?,?,?,?,?)')
          .bind(user.user_id, body.provider || 'deepseek', body.kind || null, usage?.total_tokens ?? null, Date.now() - t0).run().catch(() => {}));
        return json({ text }, 200, CORS);
      } catch (e) {
        console.error('AI error', e);
        return json({ error: 'เกิดข้อผิดพลาดในการเรียก AI กรุณาลองใหม่' }, 502, CORS);
      }
    }

    // ---- ดวงรายวัน 12 ราศี (cache ใน D1 วันละครั้ง) ใช้ได้ทั้งเว็บและ LINE ----
    const m = path.match(/^\/api\/daily\/(\w+)$/);
    if (m && isZodiac(m[1])) {
      const date = todayBKK();
      const text = await getReading(env, m[1], date);
      return json({ zodiac: m[1], date, text, formatted: formatReading(m[1], date, text) }, 200,
        { ...CORS, 'Cache-Control': 'public, max-age=600' });
    }

    // ---- LINE webhook ----
    if (path === '/line/webhook' && req.method === 'POST') {
      const body = await req.text();
      if (!(await verifySignature(env.LINE_SECRET, body, req.headers.get('x-line-signature') || '')))
        return new Response('bad signature', { status: 401 });
      const events = JSON.parse(body).events || [];
      ctx.waitUntil(Promise.allSettled(events.map(ev => handleEvent(env, ev).catch(e => console.error(e)))));
      return new Response('ok');
    }
    if (path === '/line/run-daily' && url.searchParams.get('key') === env.LINE_SECRET) {
      ctx.waitUntil(dailyPush(env));
      return new Response('started');
    }

    if (path === '/api/health') return json({ ok: true, ts: new Date().toISOString() }, 200, CORS);
    if (path.startsWith('/api/') || path.startsWith('/line/')) return json({ error: 'not found' }, 404, CORS);

    // ที่เหลือ = หน้าเว็บ (Vite SPA)
    return env.ASSETS.fetch(req);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(dailyPush(env));
  },
};
