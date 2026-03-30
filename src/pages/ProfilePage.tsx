import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { User, Star, Calendar, MapPin, Clock, Save, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ProfilePage() {
  const { user, userProfile, isAuthenticated, isLoading, isPremium, refreshProfile } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setBirthDate(userProfile.birthDate || '');
      setBirthTime(userProfile.birthTime || '');
      setBirthPlace(userProfile.birthPlace || '');
    }
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSaveBirthData = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        birthDate,
        birthTime,
        birthPlace,
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving birth data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>โปรไฟล์ | รุทสะกิดดาว</title>
      </Helmet>

      <section className="py-8 max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500/30 to-indigo-600/30 rounded-full mb-6">
            <User className="w-12 h-12 text-purple-200" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{user?.displayName || 'สมาชิก'}</h1>
          <p className="text-purple-300">{user?.email}</p>
          {isPremium && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm">
              <Crown className="w-4 h-4" />
              Premium Member
            </div>
          )}
        </header>

        <div className="space-y-6">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              สถิติ
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-stardust-400">{userProfile?.credits || 0}</p>
                <p className="text-purple-300 text-sm mt-1">เครดิต</p>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-200">{isPremium ? '∞' : '-'}</p>
                <p className="text-purple-300 text-sm mt-1">สิทธิ์ Premium</p>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-4 text-center">
                <p className="text-sm font-bold text-purple-200">
                  {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('th-TH') : '-'}
                </p>
                <p className="text-purple-300 text-sm mt-1">วันที่สมัคร</p>
              </div>
            </div>
          </motion.div>

          {/* Birth Data Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-300" />
              ข้อมูลวันเกิด
            </h2>
            <p className="text-purple-300 text-sm mb-6">
              กรอกข้อมูลนี้ไว้ จะได้ไม่ต้องกรอกใหม่ทุกครั้งที่ดูดวงยูเรเนียน
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    วันเกิด
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 mb-2 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    เวลาเกิด
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 mb-2 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  สถานที่เกิด
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="จังหวัด, ประเทศ"
                  className="w-full px-4 py-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveBirthData}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                {saveSuccess && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-sm"
                  >
                    ✅ บันทึกสำเร็จ!
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              เติมเครดิต
            </h2>
            <ul className="text-purple-200 space-y-2 mb-4 text-sm">
              <li>• 5 ครั้ง - 100 บาท</li>
              <li>• 10 ครั้ง - 180 บาท</li>
              <li>• 20 ครั้ง - 320 บาท</li>
            </ul>
            <p className="text-purple-300 text-sm mb-4">
              ติดต่อ Line: 0942511969 เพื่อเติมเครดิต
            </p>
            {isPremium && (
              <p className="text-amber-300 text-sm flex items-center gap-2">
                <Crown className="w-4 h-4" /> Premium - ทำนายได้ไม่จำกัด
              </p>
            )}
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/history"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center transition-colors"
            >
              <Clock className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <span className="text-sm">ประวัติการดูดวง</span>
            </Link>
            <Link
              to="/uranian"
              className="bg-white/5 hover:bg-white/10 rounded-xl p-4 text-center transition-colors"
            >
              <Star className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <span className="text-sm">ดูดวงยูเรเนียน</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
