// ตรวจ Firebase ID token บน Workers (ไม่ต้องใช้ firebase-admin)
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
let jwksCache = { keys: null, at: 0 };

const b64url = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));

export async function verifyFirebaseToken(token, projectId) {
  if (!token) return null;
  const [h, p, s] = token.split('.');
  if (!s) return null;
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}` || payload.exp < now) return null;

  if (!jwksCache.keys || Date.now() - jwksCache.at > 3600e3) {
    const r = await fetch(JWKS_URL, { cf: { cacheTtl: 3600 } });
    jwksCache = { keys: (await r.json()).keys, at: Date.now() };
  }
  const jwk = jwksCache.keys.find(k => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(s), new TextEncoder().encode(`${h}.${p}`));
  return ok ? payload : null;
}

// ---- LLM proxy (แทน Firebase Functions generateAI) ----
const PROVIDERS = {
  groq:     { url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.1-8b-instant', key: 'GROQ_API_KEY' },
  deepseek: { url: 'https://api.deepseek.com/v1/chat/completions',     model: 'deepseek-chat',        key: 'DEEPSEEK_API_KEY' },
  minimax:  { url: 'https://api.minimax.io/v1/text/chatcompletion_v2', model: 'MiniMax-M2.7',           key: 'MINIMAX_API_KEY' },
};

export async function generateAI(env, { provider = 'deepseek', prompt, systemPrompt, maxTokens = 2000, model }) {
  const p = PROVIDERS[provider];
  if (!p) throw new Error(`Unsupported provider: ${provider}`);
  const apiKey = env[p.key];
  // ถ้าไม่ได้ตั้ง key ของ provider นั้น ให้ fallback ไป DeepSeek
  if (!apiKey) {
    if (provider !== 'deepseek' && env.DEEPSEEK_API_KEY) return generateAI(env, { provider: 'deepseek', prompt, systemPrompt, maxTokens });
    throw new Error(`${p.key} not configured`);
  }
  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(p.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: model || p.model, messages, max_tokens: maxTokens }),
  });
  if (!res.ok) throw new Error(`${provider} error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return { text: json.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้', usage: json.usage };
}
