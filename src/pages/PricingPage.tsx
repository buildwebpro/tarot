import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, Sparkles, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>ค่าบริการ — รุทสะกิดดาว</title>
        <meta name="description" content="ค่าบริการดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน ดูดวงรายวัน โดยรุทสะกิดดาว ผู้มีประสบการณ์ 20 ปี" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-950/60 via-cosmic-980/80 to-cosmic-950/90 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stardust-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-stardust-400 to-stardust-500 text-glow">
                ค่าบริการ
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-cosmic-200 leading-relaxed max-w-2xl mx-auto">
              ปรับแต่งให้คุณเป็นคนกำหนดอนาคตด้วยตัวเอง
            </p>
            <p className="text-stardust-400 font-medium mt-4">— รุท สะกิดดาว —</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            {/* ยูเรเนียน - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-deep-950/95 to-cosmic-950/90 border border-stardust-500/30 rounded-3xl" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-stardust-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stardust-500/20 text-stardust-400 rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4" />
                  แนะนำ
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  โหราศาสตร์ยูเรเนียน
                </h2>
                <p className="text-cosmic-300 mb-6">
                  ระบบโหราศาสตร์ขั้นสูงจากเยอรมัน วิเคราะห์ดวงชะตาอย่างละเอียด
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl lg:text-6xl font-bold text-stardust-400">200</span>
                  <span className="text-2xl text-cosmic-300">บาท</span>
                  <span className="text-cosmic-400 text-sm ml-2">/ 1 ครั้ง</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    'วิเคราะห์จุดสำคัญ 6 จุด',
                    'อาทิตย์ จันทร์ เมอริเดียน ลัคนา ราหู เมษ',
                    'ใช้เวลาวิเคราะห์ 15-20 นาที',
                    'ระบุโอกาสและความท้าทาย',
                    'คำแนะนำที่เหมาะกับคุณ',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-cosmic-200">
                      <CheckCircle className="w-5 h-5 text-stardust-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/uranian"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  เปิดดวงยูเรเนียน
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            {/* ไพ่ทาโรต์ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cosmic-900/80 via-deep-950/95 to-cosmic-950/90 border border-cosmic-700/50 rounded-3xl" />

              <div className="relative p-8 lg:p-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  ไพ่ทาโรต์
                </h2>
                <p className="text-cosmic-300 mb-6">
                  เปิดไพ่ทำนายด้วยประสบการณ์ 20 ปี
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl lg:text-6xl font-bold text-white">ฟรี</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    'ไพ่เสี่ยงทาย 3 ใบ',
                    'ไพ่เฉพาะด้าน (ความรัก การงาน การเงิน สุขภาพ)',
                    'Celtic Cross 10 ใบ',
                    'ดูดวงรายวัน 12 ราศี',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-cosmic-200">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/tarot"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-cosmic-800 hover:bg-cosmic-700 border border-cosmic-600 text-white font-semibold rounded-xl transition-all"
                >
                  เปิดไพ่ทาโรต์
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 lg:py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 lg:p-10 border border-stardust-500/20"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-stardust-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-stardust-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">คำแนะนำเพิ่มเติมจากรุท</h3>
                <p className="text-cosmic-400 text-sm">สำหรับดวงยูเรเนียน</p>
              </div>
            </div>

            <div className="space-y-4 text-cosmic-200 leading-relaxed">
              <p>
                💡 เวลาเกิด (ตกฟาก) สำคัญมากครับ หากไม่ทราบเวลาที่แน่นอน แนะนำให้ใช้การเปิดไพ่ทาโรต์แทน
                ซึ่งผมก็เตรียมพร้อมให้บริการในราคา Standard เช่นกันครับ
              </p>

              <div className="border-t border-cosmic-800/50 pt-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-stardust-400 shrink-0 mt-1" />
                  <p>
                    <strong className="text-stardust-300">การเตรียมคำถาม:</strong> การมีคำถามที่ชัดเจน
                    จะช่วยให้คุณได้รับคำตอบที่คมชัดและคุ้มค่าเวลาที่สุดครับ
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            พร้อมเปิดรับคำทำนายแล้วหรือยัง?
          </h2>
          <p className="text-cosmic-300 text-lg mb-8">
            เริ่มต้นเส้นทางของคุณกับหน้าไพ่ทาโรต์วันนี้
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/uranian"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-full transition-all shadow-lg shadow-stardust-500/30"
            >
              <Star className="w-5 h-5" />
              เปิดดวงยูเรเนียน
            </Link>
            <Link
              to="/tarot"
              className="inline-flex items-center gap-2 px-8 py-4 glass-card hover:bg-cosmic-800/80 border border-cosmic-600 text-white font-medium rounded-full transition-all"
            >
              เปิดไพ่ทาโรต์
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
