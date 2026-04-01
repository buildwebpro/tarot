import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Grid3X3, Layers, Globe } from 'lucide-react';
import { lazy, Suspense } from 'react';

const ArticleList = lazy(() => import('../components/ArticleList'));

export default function HomePage() {
  const services = [
    {
      title: 'ไพ่เสี่ยงทาย',
      desc: 'เปิดไพ่ 3 ใบ ทำนายอดีต ปัจจุบัน อนาคต ด้วยประสบการณ์ 20 ปี',
      icon: <Sparkles className="w-6 h-6" />,
      link: '/tarot',
      tag: '3 ใบ',
    },
    {
      title: 'ไพ่เฉพาะด้าน',
      desc: 'เลือกเรื่องที่ต้องการทำนาย — ความรัก การงาน การเงิน สุขภาพ',
      icon: <Layers className="w-6 h-6" />,
      link: '/tarot#specialized',
      tag: '4 หมวด',
    },
    {
      title: 'Celtic Cross',
      desc: 'การเปิดไพ่ 10 ใบ วิเคราะห์ชีวิตรอบด้านอย่างละเอียดที่สุด',
      icon: <Grid3X3 className="w-6 h-6" />,
      link: '/tarot#celtic-cross',
      tag: '10 ใบ',
    },
    {
      title: 'ดูดวงรายวัน',
      desc: 'ดูดวงรายวันตามราศีของคุณ ทำนายความรัก การเงิน สุขภาพ การงาน',
      icon: <Star className="w-6 h-6" />,
      link: '/horoscope',
      tag: '12 ราศี',
    },
    {
      title: 'โหราศาสตร์ยูเรเนียน',
      desc: 'ระบบโหราศาสตร์ขั้นสูงจากเยอรมัน ทำนายดวงชะตาด้วยความแม่นยำสูง',
      icon: <Globe className="w-6 h-6" />,
      link: '/uranian',
      tag: 'ขั้นสูง',
    },
  ];

  return (
    <>
      <Helmet>
        <title>รุทสะกิดดาว — ดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน ดูดวงรายวัน</title>
        <meta name="description" content="บริการดูดวงออนไลน์ ไพ่ทาโรต์ ไพ่เสี่ยงทาย Celtic Cross ดูดวงรายวันตามราศี โหราศาสตร์ยูเรเนียน ทำนายดวงชะตาแม่นยำ 20ปี ประสบการณ์" />
      </Helmet>

      {/* ═══ HERO — Dark Section (Cosmic Style) ═══ */}
      <section className="relative text-white overflow-hidden min-h-[90vh] flex items-center">
        {/* Background cosmic elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-950/40 via-transparent to-cosmic-980/90 pointer-events-none" />

        {/* Starfield background (optimized) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay shadow-inner" />

        {/* Zodiac constellation symbols - subtle decorative */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          {/* Aries symbol top left */}
          <div className="absolute top-[15%] left-[10%] text-6xl font-light text-stardust-400" style={{ transform: 'rotate(-15deg)' }}>♈</div>
          {/* Taurus symbol */}
          <div className="absolute top-[25%] right-[15%] text-5xl font-light text-stardust-300" style={{ transform: 'rotate(10deg)' }}>♉</div>
          {/* Cancer symbol */}
          <div className="absolute top-[40%] left-[5%] text-5xl font-light text-stardust-400" style={{ transform: 'rotate(-5deg)' }}>♋</div>
          {/* Leo symbol */}
          <div className="absolute top-[35%] right-[8%] text-6xl font-light text-stardust-300" style={{ transform: 'rotate(15deg)' }}>♌</div>
          {/* Libra symbol */}
          <div className="absolute bottom-[35%] left-[12%] text-5xl font-light text-stardust-400" style={{ transform: 'rotate(-10deg)' }}>♎</div>
          {/* Scorpio symbol */}
          <div className="absolute bottom-[30%] right-[10%] text-5xl font-light text-stardust-300" style={{ transform: 'rotate(8deg)' }}>♏</div>
          {/* Sagittarius symbol */}
          <div className="absolute bottom-[45%] left-[20%] text-6xl font-light text-stardust-400" style={{ transform: '-5deg' }}>♐</div>
          {/* Pisces symbol */}
          <div className="absolute bottom-[50%] right-[20%] text-5xl font-light text-stardust-300" style={{ transform: 'rotate(12deg)' }}>♓</div>
        </div>

        {/* Purple nebula glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.12) 0%, transparent 60%)' }} />

        {/* Gold glow accent */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 70%, rgba(234,179,8,0.08) 0%, transparent 40%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl relative z-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-loose tracking-tight mb-6 drop-shadow-lg">
              ดูดวงออนไลน์
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-stardust-400 to-stardust-500 text-glow">20ปี ประสบการณ์</span>
            </h1>
            <p className="text-lg text-cosmic-200 leading-relaxed max-w-xl mb-10 text-shadow">
              บริการดูดวงไพ่ทาโรต์ ดูดวงรายวันตามราศี และโหราศาสตร์ยูเรเนียน
              ทำนายชะตาชีวิตด้วยประสบการณ์ 20 ปี ที่ผสมผสานองค์ความรู้โหราศาสตร์โบราณ ท่ามกลางหมู่ดาว
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tarot"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-full shadow-lg shadow-stardust-500/30 border border-stardust-400/30 transition-all hover:scale-105 active:scale-95 text-sm uppercase tracking-wide"
              >
                เปิดไพ่ทาโรต์
                <Sparkles className="w-4 h-4" />
              </Link>
              <Link
                to="/horoscope"
                className="inline-flex items-center gap-2 px-8 py-4 glass-card hover:bg-cosmic-800/80 hover:border-stardust-500/30 text-cosmic-100 hover:text-stardust-300 font-medium rounded-full transition-all text-sm uppercase tracking-wide"
              >
                ดูดวงรายวัน
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES — Glass Section ═══ */}
      <section className="relative py-20 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 drop-shadow-md">บริการดูดวงออนไลน์</h2>
            <p className="text-cosmic-300 max-w-2xl mx-auto text-lg leading-relaxed">
              เลือกรูปแบบการดูดวงที่เหมาะกับคุณ ไม่ว่าจะเป็นไพ่ทาโรต์ ดูดวงรายวัน หรือโหราศาสตร์ยูเรเนียน ท่ามกลางพลังงานจากจักรวาล
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={service.link}
                  className="group block h-full p-8 rounded-3xl glass-card hover:bg-cosmic-800/60 hover:border-stardust-400/40 hover:shadow-2xl hover:shadow-stardust-500/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-stardust-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-cosmic-800/80 border border-cosmic-600 shadow-inner text-stardust-400 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-stardust-500 group-hover:to-stardust-600 group-hover:text-deep-950 group-hover:border-stardust-400 transition-all">
                      {service.icon}
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-cosmic-950 border border-stardust-700/50 text-stardust-400 tracking-wide uppercase">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-stardust-300 transition-colors relative z-10">
                    {service.title}
                  </h3>
                  <p className="text-sm text-cosmic-300 leading-relaxed mb-6 relative z-10">
                    {service.desc}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-stardust-400 group-hover:gap-3 group-hover:text-stardust-300 transition-all relative z-10">
                    เริ่มใช้งาน <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT / WHY TRUST — Dark Glass Section ═══ */}
      <section className="bg-cosmic-950/40 border-y border-cosmic-800 backdrop-blur-sm py-20 lg:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6 drop-shadow">ทำไมต้องรุทสะกิดดาว?</h2>
            <p className="text-cosmic-300 leading-relaxed text-lg mb-16">
              เราผสมผสานองค์ความรู้โหราศาสตร์ดั้งเดิมกับประสบการณ์ 20 ปี
              เพื่อการทำนายที่แม่นยำ ลึกล้ำ และเข้าถึงง่ายสำหรับทุกคน
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-cosmic-900/30 border border-cosmic-700/50">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-stardust-400 to-cosmic-500 mb-4 drop-shadow">20+</div>
                <h3 className="font-semibold text-white text-lg mb-2">20ปี ประสบการณ์</h3>
                <p className="text-sm text-cosmic-300">ไพ่ทาโรต์และโหราศาสตร์ยูเรเนียนแม่นยำ</p>
              </div>
              <div className="p-6 rounded-2xl bg-cosmic-900/30 border border-cosmic-700/50">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-stardust-400 to-cosmic-500 mb-4 drop-shadow">5+</div>
                <h3 className="font-semibold text-white text-lg mb-2">ศาสตร์พยากรณ์</h3>
                <p className="text-sm text-cosmic-300">ไพ่ทาโรต์ Celtic Cross ดูดวงรายวัน ยูเรเนียน</p>
              </div>
              <div className="p-6 rounded-2xl bg-cosmic-900/30 border border-cosmic-700/50">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-stardust-400 to-cosmic-500 mb-4 drop-shadow">24/7</div>
                <h3 className="font-semibold text-white text-lg mb-2">เชื่อมต่อดวงดาวตลอดเวลา</h3>
                <p className="text-sm text-cosmic-300">เปิดรับพลังงานและคำทำนายได้ 24 ชั่วโมง</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA IMAGE — Before Articles ═══ */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stardust-500/20 border border-cosmic-700/50">
            <img
              src="https://scontent.fbkk23-1.fna.fbcdn.net/v/t39.30808-6/481981646_122204305784220970_4827353594584458304_n.png?_nc_cat=108&ccb=1-7&_nc_sid=2a1932&_nc_ohc=DTaoI8kf_0AQ7kNvwEFLMEg&_nc_oc=AdrFeJ7ABlZMwSqJU-0VrlRH7D4-PbL2KDJy5K1CPuGy9DVFXIyFxZhAaSeQh53i8ag&_nc_zt=23&_nc_ht=scontent.fbkk23-1.fna&_nc_gid=uPj774V_SqUqDBR7mngWeg&_nc_ss=7a3a8&oh=00_Afwxljy75y7Zp80ANCap83Cdgd2z_Dw4KBJJjFv4DpRjIw&oe=69D03733"
              alt="รุทสะกิดดาว - ดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/90 via-cosmic-950/40 to-transparent flex items-end">
              <div className="p-6 sm:p-10 text-left">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-3 drop-shadow-lg">
                  20ปี ประสบการณ์ ไพ่ทาโรต์ และโหราศาสตร์ยูเรเนียน
                </h3>
                <p className="text-cosmic-200 text-base sm:text-lg max-w-xl">
                  ดูดวงออนไลน์ ไพ่ทาโรต์ ดูดวงรายวัน และโหราศาสตร์ยูเรเนียน ทำนายชะตาชีวิตแม่นยำ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ARTICLES — Transparent Cosmic Section ═══ */}
      <section className="py-20 lg:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3 drop-shadow">คลังความรู้แห่งดวงดาว</h2>
              <p className="text-cosmic-300 text-lg">บทความ เทคนิค และเกร็ดน่ารู้เกี่ยวกับไพ่ทาโรต์และดวงชะตา</p>
            </div>
            <Link to="/articles" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-stardust-400 hover:text-stardust-300 transition-colors uppercase tracking-wide">
              อ่านทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Suspense fallback={<div className="h-64 flex items-center justify-center text-cosmic-400 animate-pulse">กำลังโหลดบทความ...</div>}>
            <ArticleList />
          </Suspense>
          <div className="mt-10 text-center sm:hidden">
            <Link to="/articles" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cosmic-600 bg-cosmic-900/50 text-sm font-medium text-white hover:bg-cosmic-800 transition-colors">
              อ่านบทความทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA — Dark Section ═══ */}
      <section className="bg-cosmic-950/80 backdrop-blur-md py-24 border-t border-cosmic-800 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stardust-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto px-4 text-center z-10">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6 drop-shadow-lg">พร้อมเปิดรับคำทำนาย?</h2>
          <p className="text-cosmic-200 mb-10 text-xl font-light">เริ่มต้นเส้นทางของคุณกับหน้าไพ่ทาโรต์วันนี้ — ไม่จำเป็นต้องสมัครสมาชิก</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tarot"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-full transition-all shadow-lg shadow-stardust-500/30 font-display tracking-wider hover:scale-105 active:scale-95"
            >
              เปิดไพ่ทาโรต์
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link
              to="/horoscope"
              className="inline-flex items-center gap-2 px-10 py-4 glass-card hover:bg-cosmic-800/80 border hover:border-stardust-400/30 text-white font-medium rounded-full transition-all font-display tracking-wider"
            >
              ดูดวงรายวัน
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
