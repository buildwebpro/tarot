import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { zodiacSigns } from '../data/zodiac';
import { HoroscopeModal } from '../components/HoroscopeModal';

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>ดูดวงรายวันตามราศี — ทำนายดวงประจำวัน | รุทสะกิดดาว</title>
        <meta name="description" content="ดูดวงรายวันตามราศีทั้ง 12 ราศี ทำนายดวงความรัก การเงิน การงาน สุขภาพ ประจำวัน แม่นยำ 20ปี ประสบการณ์" />
        <meta name="keywords" content="ดูดวงรายวัน, ดูดวงตามราศี, ราศี, ดูดวงประจำวัน, ดูดวงวันนี้, horoscope" />
        <link rel="canonical" href="https://rujskiddao-tarot.web.app/horoscope" />
      </Helmet>

      {/* Page Header */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-stardust-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-stardust-200 via-stardust-400 to-stardust-500 mb-6 drop-shadow-sm tracking-tight"
          >
            ดูดวงรายวัน
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-cosmic-200 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            เลือกราศีของคุณเพื่อดูคำทำนายประจำวัน — ความรัก การเงิน การงาน สุขภาพ
          </motion.p>
        </div>
      </section>

      {/* Zodiac Grid */}
      <section className="py-12 lg:py-16 relative z-10 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {zodiacSigns.map((sign, i) => (
              <motion.button
                key={sign.name}
                onClick={() => setSelectedSign(sign.name)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="group relative glass-card p-6 sm:p-8 rounded-3xl border border-cosmic-700/50 hover:border-stardust-500/80 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all duration-300 text-center overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-stardust-500/0 via-stardust-500/0 to-stardust-500/0 group-hover:from-stardust-500/5 group-hover:via-transparent group-hover:to-stardust-500/5 transition-all duration-500"></div>

                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full bg-cosmic-900/50 border border-cosmic-700/50 group-hover:border-stardust-500/50 flex items-center justify-center p-4 transition-colors duration-300 shadow-inner isolate">
                    <img
                      src={sign.image}
                      alt={sign.thaiName}
                      className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.4)] transition-all duration-300 mix-blend-screen"
                    />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white mb-2 group-hover:text-stardust-300 transition-colors drop-shadow-sm">{sign.thaiName}</h2>
                  <p className="text-sm text-stardust-400 font-medium tracking-wide">{sign.period}</p>
                  <p className="text-xs text-cosmic-300 mt-2">{sign.element}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cosmic-800/60 text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-stardust-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-stardust-600/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-6 relative z-10 shadow-sm">ดูดวงรายวันคืออะไร?</h2>
            <p className="text-cosmic-200 leading-relaxed font-light text-lg relative z-10">
              ดูดวงรายวันตามราศีเป็นการทำนายดวงชะตาประจำวัน โดยอิงจากตำแหน่งดวงดาวและราศีเกิดของคุณ 
              ระบบของเราใช้ประสบการณ์ 20 ปี วิเคราะห์ตำแหน่งดาวเคราะห์ร่วมกับหลักโหราศาสตร์ดั้งเดิม 
              เพื่อให้คำทำนายที่ครอบคลุมทั้งด้านความรัก การเงิน การงาน และสุขภาพ 
              อัปเดตใหม่ทุกวัน เพื่อให้คุณเตรียมตัวรับมือกับสิ่งที่จะเกิดขึ้น
            </p>
          </div>
        </div>
      </section>

      {selectedSign && (
        <HoroscopeModal
          sign={selectedSign}
          onClose={() => setSelectedSign(null)}
        />
      )}
    </>
  );
}
