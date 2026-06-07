import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';

admin.initializeApp();

const groqApiKey = defineSecret('GROQ_API_KEY');
const deepseekApiKey = defineSecret('DEEPSEEK_API_KEY');
const minimaxApiKey = defineSecret('MINIMAX_API_KEY');

// ===================== LLM Proxy =====================
// เป้าหมาย: ซ่อน API Key จริงจาก client bundle
// วิธีตั้งค่า secret (แนะนำ):
//   firebase functions:config:set groq.key="YOUR_GROQ_KEY" deepseek.key="..." minimax.key="..."
// หรือใช้ Firebase Secret Manager (แนะนำสำหรับ production)

const getConfig = () => {
  // Support both functions.config() (legacy) and process.env (newer / Secret Manager)
  const cfg: any = (admin.app().options as any).functionsConfig || {};
  return {
    groq: groqApiKey.value() || process.env.GROQ_API_KEY || cfg.groq?.key || '',
    deepseek: deepseekApiKey.value() || process.env.DEEPSEEK_API_KEY || cfg.deepseek?.key || '',
    minimax: minimaxApiKey.value() || process.env.MINIMAX_API_KEY || cfg.minimax?.key || '',
  };
};

interface LLMRequest {
  provider: 'groq' | 'deepseek' | 'minimax';
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  model?: string;
}

export const generateAI = onCall(
  {
    cors: true,
    secrets: [groqApiKey, deepseekApiKey, minimaxApiKey],
    // region: 'asia-southeast1', // ตรงกับ Firestore location ได้
  },
  async (request) => {
    // ต้องล็อกอินเท่านั้น (สำคัญ)
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'ต้องเข้าสู่ระบบก่อนเรียกใช้งาน AI');
    }

    const data = request.data as LLMRequest;
    const { provider, prompt, systemPrompt, maxTokens = 2000 } = data;

    if (!prompt || typeof prompt !== 'string') {
      throw new HttpsError('invalid-argument', 'prompt is required');
    }

    const keys = getConfig();

    try {
      if (provider === 'groq') {
        return await callGroq(prompt, keys.groq, maxTokens);
      } else if (provider === 'deepseek') {
        return await callDeepSeek(prompt, keys.deepseek, maxTokens);
      } else if (provider === 'minimax') {
        return await callMinimax(prompt, systemPrompt, keys.minimax, maxTokens);
      } else {
        throw new HttpsError('invalid-argument', `Unsupported provider: ${provider}`);
      }
    } catch (error: any) {
      console.error('LLM proxy error:', error);
      // อย่า leak รายละเอียด key ไป client
      throw new HttpsError('internal', 'เกิดข้อผิดพลาดในการเรียก AI กรุณาลองใหม่');
    }
  }
);

// ---------------- Internal callers ----------------

async function callGroq(prompt: string, apiKey: string, maxTokens: number): Promise<string> {
  if (!apiKey) throw new Error('GROQ key not configured on server');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
}

async function callDeepSeek(prompt: string, apiKey: string, maxTokens: number): Promise<string> {
  if (!apiKey) throw new Error('DeepSeek key not configured on server');

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`DeepSeek error ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'ไม่สามารถทำนายได้';
}

async function callMinimax(prompt: string, systemPrompt: string | undefined, apiKey: string, maxTokens: number): Promise<string> {
  if (!apiKey) throw new Error('MiniMax key not configured on server');

  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch('https://api.minimax.io/v1/text/chatcompletion_v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'MiniMax-M2.7',
      messages,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) throw new Error(`MiniMax error ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'ขออภัย ไม่สามารถทำนายได้ในขณะนี้';
}
