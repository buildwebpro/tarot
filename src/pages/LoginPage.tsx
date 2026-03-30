import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/firebase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await authService.login(email, password);
        navigate('/');
      } else {
        await authService.register(email, password, displayName || undefined);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'} — รุทสะกิดดาว</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-deep-950/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl border border-cosmic-700/50"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-stardust-400" />
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </h2>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-cosmic-400 hover:text-stardust-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-cosmic-200 mb-1.5">ชื่อแสดง</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 focus:border-transparent"
                  placeholder="ชื่อของคุณ"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 disabled:from-cosmic-700 disabled:to-cosmic-600 disabled:cursor-not-allowed text-deep-950 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? 'กำลังโหลด...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-stardust-400 hover:text-stardust-300 transition-colors text-sm font-medium"
            >
              {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
