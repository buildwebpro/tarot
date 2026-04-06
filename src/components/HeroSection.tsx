// หมายเหตุ: สามารถเปลี่ยนเป็น local image ได้ที่ src/assets/hero-bg.jpg
// URL ด้านล่างเป็น placeholder สำหรับทดสอบ
import heroBg from "/hero-bg.webp";

const zodiacSigns = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="ไพ่ทาโรต์และจักรราศี"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer orbit */}
        <div
          className="absolute w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] rounded-full border border-primary/10"
          style={{ animation: "spin 120s linear infinite" }}
        >
          {zodiacSigns.map((sign, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const r = 50;
            return (
              <span
                key={i}
                className="absolute text-primary/30 text-lg sm:text-2xl animate-pulse-glow"
                style={{
                  top: `${50 - r * Math.cos(angle)}%`,
                  left: `${50 + r * Math.sin(angle)}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {sign}
              </span>
            );
          })}
        </div>

        {/* Inner orbit */}
        <div
          className="absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full border border-primary/5"
          style={{ animation: "spin 80s linear infinite reverse" }}
        >
          {["☉","☽","♂","♀","♃","♄"].map((planet, i) => {
            const angle = (i * 60) * (Math.PI / 180);
            const r = 50;
            return (
              <span
                key={i}
                className="absolute text-primary/20 text-xl sm:text-3xl animate-float-slow"
                style={{
                  top: `${50 - r * Math.cos(angle)}%`,
                  left: `${50 + r * Math.sin(angle)}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                {planet}
              </span>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-yellow-300 text-sm tracking-[0.3em] uppercase mb-4 font-display drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
          ✦ รุทสะกิดดาว ✦
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight">
          <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">ไพ่ทาโรต์ &</span>
          <br />
          <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">โหราศาสตร์จักรราศี</span>
        </h1>
        <p className="text-yellow-100/90 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_0_8px_rgba(253,224,71,0.3)]">
          เปิดไพ่ทาโรต์ทำนายชะตา ดูดวงจักรราศีตามวิถีดวงดาวโคจร
          <br className="hidden sm:block" />
          ด้วยประสบการณ์กว่า 20 ปี ท่ามกลางการเคลื่อนที่ของดาวเคราะห์
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.xn--72cza0f5d.online/tarot"
            className="px-8 py-3.5 rounded-full bg-yellow-400 text-gray-900 font-bold text-base glow-gold hover:scale-105 hover:bg-yellow-300 transition-all inline-flex items-center gap-2"
          >
            🃏 เปิดไพ่ทาโรต์
          </a>
          <a
            href="https://www.xn--72cza0f5d.online/horoscope"
            className="px-8 py-3.5 rounded-full border-2 border-yellow-400 text-yellow-400 font-bold text-base hover:bg-yellow-400 hover:text-gray-900 transition-all"
          >
            ☿ ดูดวงจักรราศี
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;