import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-cosmic-950/50 backdrop-blur-md border-t border-cosmic-800 text-cosmic-300 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-stardust-500/10 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-skiddao.jpg"
                alt="รุทสะกิดดาว"
                className="w-9 h-9 rounded-lg object-cover border border-stardust-400/30 shadow-lg"
              />
              <span className="text-lg font-bold text-gradient-gold">รุทสะกิดดาว</span>
            </div>
            <p className="text-sm leading-relaxed text-cosmic-200">
              บริการดูดวงออนไลน์ ไพ่ทาโรต์ ดูดวงรายวัน และโหราศาสตร์ยูเรเนียน 
              ทำนายชะตาชีวิตแม่นยำ
            </p>
          </div>

          {/* ไพ่ทาโรต์ */}
          <div>
            <h3 className="text-xs font-semibold text-stardust-400 uppercase tracking-wider mb-4">ไพ่ทาโรต์</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/tarot" className="hover:text-stardust-300 transition-colors">ไพ่เสี่ยงทาย</Link></li>
              <li><Link to="/tarot#specialized" className="hover:text-stardust-300 transition-colors">ไพ่เฉพาะด้าน</Link></li>
              <li><Link to="/tarot#celtic-cross" className="hover:text-stardust-300 transition-colors">Celtic Cross</Link></li>
            </ul>
          </div>

          {/* ดูดวง */}
          <div>
            <h3 className="text-xs font-semibold text-stardust-400 uppercase tracking-wider mb-4">ดูดวง</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/horoscope" className="hover:text-stardust-300 transition-colors">ดูดวงรายวัน</Link></li>
              <li><Link to="/uranian" className="hover:text-stardust-300 transition-colors">โหราศาสตร์ยูเรเนียน</Link></li>
              <li><Link to="/articles" className="hover:text-stardust-300 transition-colors">บทความ</Link></li>
              <li><Link to="/pricing" className="hover:text-stardust-300 transition-colors">ค่าบริการ</Link></li>
            </ul>
          </div>

          {/* ติดต่อ */}
          <div>
            <h3 className="text-xs font-semibold text-stardust-400 uppercase tracking-wider mb-4">ติดต่อ</h3>
            <ul className="space-y-2.5 text-sm">
              <li>📧 rujskiddao@gmail.com</li>
              <li>📱 Line: 0942511969</li>
              <li>👤 Facebook: รุท สะกิดดาว</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cosmic-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} รุทสะกิดดาว — โหราศาสตร์ &amp; ไพ่ทาโรต์ออนไลน์
          </p>
          <div className="flex gap-6 text-xs">
            <Link to="/articles" className="hover:text-stardust-300 transition-colors">บทความ</Link>
            <Link to="/pricing" className="hover:text-stardust-300 transition-colors">ค่าบริการ</Link>
            <Link to="/history" className="hover:text-stardust-300 transition-colors">ประวัติ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}