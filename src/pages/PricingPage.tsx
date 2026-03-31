import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, Sparkles, Clock, CheckCircle, ArrowRight, Heart, HelpCircle, Calendar, MessageCircle, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PricingPage() {
  const services = [
    {
      title: "พยากรณ์ดวงชะตารายบุคคล",
      subtitle: "Individual Reading",
      description: "เน้นการวิเคราะห์ดวงกำเนิด (Natal Chart) เจาะลึกพื้นดวง วาสนา และเหตุการณ์ล่วงหน้าในรอบปี ด้วยโหราศาสตร์ยูเรเนียนและไพ่ทาโรต์",
      icon: <Star className="w-5 h-5" />,
      featured: true,
      packages: [
        {
          name: "Standard",
          price: "500",
          duration: "30 นาที",
          idealFor: "สอบถามประเด็นร้อนใจ 1-2 เรื่อง หรือเช็กดวงรายปีแบบสรุปใจความสำคัญ"
        },
        {
          name: "Premium",
          price: "1,000",
          duration: "60 นาที",
          idealFor: "การวิเคราะห์พื้นดวงอย่างละเอียด เจาะลึกจุดแข็ง-จุดอ่อน วางแผนกลยุทธ์ชีวิตในรอบปี และถามตอบได้ไม่จำกัดคำถามในเวลา"
        }
      ]
    },
    {
      title: "ดวงสมพงษ์คู่ครอง",
      subtitle: "Relationship Matching",
      description: "วิเคราะห์โครงสร้างดาวระหว่างบุคคลสองคน เพื่อหาจุดส่งเสริมและจุดที่ต้องระวังในความสัมพันธ์",
      icon: <Heart className="w-5 h-5" />,
      featured: false,
      price: "1,200",
      features: [
        "การปรับตัวเข้าหากัน",
        "ดวงเกื้อหนุนด้านโชคลาภและการงาน",
        "เกณฑ์การสร้างครอบครัวหรือการร่วมหุ้นลงทุน"
      ]
    },
    {
      title: "ดวงกาลชะตา",
      subtitle: "Horary Astrology",
      description: "ศาสตร์แห่งการถาม-ตอบ ตามเวลาที่เกิดเหตุการณ์จริง",
      icon: <HelpCircle className="w-5 h-5" />,
      featured: false,
      price: "500",
      unit: "ต่อ 1 คำถาม",
      features: [
        "ตามหาของหาย: วิเคราะห์ทิศทางและลักษณะสถานที่ที่ของตกหล่น",
        "การตัดสินใจเร่งด่วน: \"ไปดีไหม?\" \"ทำแล้วรุ่งหรือเปล่า?\"",
        "ถามเหตุการณ์เฉพาะหน้า: เช่น ผลการสัมภาษณ์งาน หรือการสอบ"
      ]
    },
    {
      title: "ฤกษ์มงคล",
      subtitle: "Auspicious Timing",
      description: "การคำนวณหาจุดนัดพบที่ดีที่สุดระหว่างดวงชะตาคุณกับจังหวะของจักรวาล",
      icon: <Calendar className="w-5 h-5" />,
      featured: false,
      price: "1,500",
      features: [
        "ฤกษ์ออกรถใหม่ / ขึ้นบ้านใหม่",
        "ฤกษ์จดทะเบียนสมรส / มงคลสมรส",
        "ฤกษ์เปิดกิจการ / เซ็นสัญญาสำคัญ"
      ]
    },
    {
      title: "ดูดวงออนไลน์: โหราศาสตร์ยูเรเนียน",
      subtitle: "Online Uranian Astrology",
      description: "ทำนายดวงชะตาด้วยตัวคุณเองผ่านระบบออนไลน์ตลอด 24 ชั่วโมง ด้วยศาสตร์ยูเรเนียน",
      icon: <Sparkles className="w-5 h-5" />,
      featured: false,
      price: "200",
      unit: "ต่อ 1 ครั้ง",
      features: [
        "วิเคราะห์จุดสำคัญ 6 จุด (อาทิตย์ จันทร์ เมอริเดียน ลัคนา ราหู เมษ)",
        "รับผลคำทำนายและคำแนะนำเฉพาะตัวทันที",
        "สะดวก รวดเร็ว ชำระด้วยเครดิต (เติมเงินในระบบ)"
      ],
      linkTo: "/uranian",
      linkText: "เปิดดวงออนไลน์"
    }
  ];

  return (
    <>
      <Helmet>
        <title>อัตราค่าบริการพยากรณ์ — รุทสะกิดดาว</title>
        <meta name="description" content="อัตราค่าบริการพยากรณ์กับ รุท สะกิดดาว ไขรหัสฟ้า ส่องชะตาชีวิต ด้วยศาสตร์แห่งความแม่นยำ" />
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stardust-500/10 border border-stardust-500/20 text-stardust-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              รุท สะกิดดาว
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-stardust-400 to-stardust-500 text-glow">
                อัตราค่าบริการพยากรณ์
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-cosmic-200 leading-relaxed max-w-2xl mx-auto mb-4">
              ไขรหัสฟ้า ส่องชะตาชีวิต ด้วยศาสตร์แห่งความแม่นยำ
            </p>
            <p className="text-stardust-400/80 italic text-lg max-w-2xl mx-auto">
              "ผมไม่ได้แค่บอกอนาคต แต่ผมจะช่วยคุณวางแผนเพื่อให้คุณเป็นคนกำหนดอนาคตด้วยตัวเอง"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className={`relative rounded-3xl overflow-hidden ${service.featured
                    ? 'lg:col-span-2'
                    : ''
                  }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br border rounded-3xl ${service.featured
                    ? 'from-purple-900/40 via-deep-950/80 to-cosmic-950/90 border-stardust-500/30'
                    : 'from-cosmic-900/60 via-deep-950/80 to-cosmic-950/90 border-cosmic-700/50'
                  }`} />
                {service.featured && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-stardust-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                )}

                <div className={`relative p-8 lg:p-10 ${service.featured ? 'lg:flex lg:gap-12 lg:items-center' : ''}`}>
                  <div className={service.featured ? 'lg:flex-1' : ''}>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${service.featured ? 'bg-stardust-500/20 text-stardust-400' : 'bg-cosmic-800/80 text-cosmic-300'
                      }`}>
                      {service.icon}
                      {service.subtitle}
                    </div>

                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {index + 1}. {service.title}
                    </h2>
                    <p className="text-cosmic-300 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Non-featured price display */}
                    {!service.featured && service.price && (
                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-4xl lg:text-5xl font-bold text-white">{service.price}</span>
                          <span className="text-xl text-cosmic-300">บาท</span>
                          {service.unit && <span className="text-cosmic-400 text-sm ml-2">{service.unit}</span>}
                        </div>
                        <ul className="space-y-3">
                          {service.features?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-cosmic-200">
                              <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${service.featured ? 'text-stardust-400' : 'text-cosmic-400'}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        {(service as any).linkTo && (
                          <div className="mt-8">
                            <Link
                              to={(service as any).linkTo}
                              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-cosmic-800 hover:bg-cosmic-700 border border-cosmic-600 text-white font-medium rounded-xl transition-all"
                            >
                              {(service as any).linkText}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Featured Packages */}
                  {service.featured && service.packages && (
                    <div className="lg:flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 lg:mt-0">
                      {service.packages.map((pkg, i) => (
                        <div key={i} className="glass-panel p-6 rounded-2xl border border-cosmic-700/50 bg-cosmic-900/30">
                          <h3 className="text-xl font-bold text-stardust-300 mb-2">{pkg.name}</h3>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-bold text-white">{pkg.price}</span>
                            <span className="text-cosmic-300">บาท</span>
                          </div>
                          <div className="flex items-center gap-2 text-cosmic-400 text-sm mb-4">
                            <Clock className="w-4 h-4" />
                            {pkg.duration}
                          </div>
                          <div className="pt-4 border-t border-cosmic-800/50">
                            <p className="text-sm text-cosmic-200 leading-relaxed">
                              <span className="font-semibold text-stardust-400">เหมาะสำหรับ: </span>
                              {pkg.idealFor}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Steps & Tips */}
      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Booking Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-3xl p-8 lg:p-10 border border-cosmic-700/50 bg-gradient-to-br from-deep-950/80 to-cosmic-950/90"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-stardust-500/10 border border-stardust-500/20 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-stardust-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">ขั้นตอนการจองคิว</h2>
            </div>

            <div className="space-y-6">
              {[
                { title: "เลือกบริการ", desc: "แจ้งบริการที่สนใจ และเลือกแพ็กเกจที่คุณต้องการ" },
                { title: "ส่งข้อมูลส่วนตัว", desc: "แจ้งวัน/เดือน/ปีเกิด เวลาเกิดที่แน่นอนตามสูติบัตร และจังหวัดที่เกิด" },
                { title: "นัดหมายเวลา", desc: "แจ้งช่วงเวลาที่สะดวกเพื่อล็อคคิวพยากรณ์" },
                { title: "ยืนยันการจอง", desc: "ชำระค่าบริการและส่งหลักฐานการโอนเงินเพื่อยืนยัน" }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cosmic-800/80 text-cosmic-200 flex items-center justify-center font-bold shrink-0 border border-cosmic-700">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-cosmic-300 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel rounded-3xl p-8 lg:p-10 border border-stardust-500/20 bg-gradient-to-br from-purple-900/20 to-cosmic-950/90"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-stardust-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-stardust-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">คำแนะนำเพิ่มเติมจากรุท</h2>
            </div>

            <div className="space-y-6 text-cosmic-200 leading-relaxed">
              <div className="p-5 rounded-2xl bg-cosmic-900/50 border border-cosmic-800">
                <h3 className="font-semibold text-stardust-300 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" /> สำหรับดวงยูเรเนียน
                </h3>
                <p className="text-sm">
                  เวลาเกิด (ตกฟาก) สำคัญมากครับ หากไม่ทราบเวลาที่แน่นอน แนะนำให้ใช้การเปิดไพ่ทาโรต์แทน ซึ่งผมก็เตรียมพร้อมให้บริการในราคา Standard เช่นกันครับ
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-cosmic-900/50 border border-cosmic-800">
                <h3 className="font-semibold text-stardust-300 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> การเตรียมคำถาม
                </h3>
                <p className="text-sm">
                  การมีคำถามที่ชัดเจน จะช่วยให้คุณได้รับคำตอบที่คมชัดและคุ้มค่าเวลาที่สุดครับ
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            สนใจสะกิดดาว เช็กดวงชะตา?
          </h2>
          <p className="text-cosmic-300 text-lg mb-10 max-w-xl mx-auto">
            ทักแชทเพื่อปรึกษาและจองคิวกับเราได้เลยครับ
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://m.me/rut.skd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-full transition-all shadow-lg shadow-stardust-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              ติดต่อทาง Inbox
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
