"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAI = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const groqApiKey = (0, params_1.defineSecret)('GROQ_API_KEY');
const deepseekApiKey = (0, params_1.defineSecret)('DEEPSEEK_API_KEY');
const minimaxApiKey = (0, params_1.defineSecret)('MINIMAX_API_KEY');
// ===================== LLM Proxy =====================
// เป้าหมาย: ซ่อน API Key จริงจาก client bundle
// วิธีตั้งค่า secret (แนะนำ):
//   firebase functions:config:set groq.key="YOUR_GROQ_KEY" deepseek.key="..." minimax.key="..."
// หรือใช้ Firebase Secret Manager (แนะนำสำหรับ production)
const getConfig = () => {
    var _a, _b, _c;
    // Support both functions.config() (legacy) and process.env (newer / Secret Manager)
    const cfg = admin.app().options.functionsConfig || {};
    return {
        groq: groqApiKey.value() || process.env.GROQ_API_KEY || ((_a = cfg.groq) === null || _a === void 0 ? void 0 : _a.key) || '',
        deepseek: deepseekApiKey.value() || process.env.DEEPSEEK_API_KEY || ((_b = cfg.deepseek) === null || _b === void 0 ? void 0 : _b.key) || '',
        minimax: minimaxApiKey.value() || process.env.MINIMAX_API_KEY || ((_c = cfg.minimax) === null || _c === void 0 ? void 0 : _c.key) || '',
    };
};
exports.generateAI = (0, https_1.onCall)({
    cors: true,
    secrets: [groqApiKey, deepseekApiKey, minimaxApiKey],
    // region: 'asia-southeast1', // ตรงกับ Firestore location ได้
}, async (request) => {
    // ต้องล็อกอินเท่านั้น (สำคัญ)
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'ต้องเข้าสู่ระบบก่อนเรียกใช้งาน AI');
    }
    const data = request.data;
    const { provider, prompt, systemPrompt, maxTokens = 2000 } = data;
    if (!prompt || typeof prompt !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'prompt is required');
    }
    const keys = getConfig();
    try {
        if (provider === 'groq') {
            return await callGroq(prompt, keys.groq, maxTokens);
        }
        else if (provider === 'deepseek') {
            return await callDeepSeek(prompt, keys.deepseek, maxTokens);
        }
        else if (provider === 'minimax') {
            return await callMinimax(prompt, systemPrompt, keys.minimax, maxTokens);
        }
        else {
            throw new https_1.HttpsError('invalid-argument', `Unsupported provider: ${provider}`);
        }
    }
    catch (error) {
        console.error('LLM proxy error:', error);
        // อย่า leak รายละเอียด key ไป client
        throw new https_1.HttpsError('internal', 'เกิดข้อผิดพลาดในการเรียก AI กรุณาลองใหม่');
    }
});
// ---------------- Internal callers ----------------
async function callGroq(prompt, apiKey, maxTokens) {
    var _a, _b, _c;
    if (!apiKey)
        throw new Error('GROQ key not configured on server');
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
    if (!res.ok)
        throw new Error(`Groq error ${res.status}`);
    const json = await res.json();
    return ((_c = (_b = (_a = json.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || 'ไม่สามารถทำนายได้';
}
async function callDeepSeek(prompt, apiKey, maxTokens) {
    var _a, _b, _c;
    if (!apiKey)
        throw new Error('DeepSeek key not configured on server');
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
    if (!res.ok)
        throw new Error(`DeepSeek error ${res.status}`);
    const json = await res.json();
    return ((_c = (_b = (_a = json.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || 'ไม่สามารถทำนายได้';
}
async function callMinimax(prompt, systemPrompt, apiKey, maxTokens) {
    var _a, _b, _c;
    if (!apiKey)
        throw new Error('MiniMax key not configured on server');
    const messages = [];
    if (systemPrompt)
        messages.push({ role: 'system', content: systemPrompt });
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
    if (!res.ok)
        throw new Error(`MiniMax error ${res.status}`);
    const json = await res.json();
    return ((_c = (_b = (_a = json.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || 'ขออภัย ไม่สามารถทำนายได้ในขณะนี้';
}
//# sourceMappingURL=index.js.map