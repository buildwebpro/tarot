import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Crown, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, isPremium, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-all duration-300 ${
      isActive(path)
        ? 'text-stardust-400 text-glow-soft'
        : 'text-cosmic-200 hover:text-stardust-300'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-cosmic-950/80 backdrop-blur-md border-b border-cosmic-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo-skiddao.jpg"
              alt="รุทสะกิดดาว"
              className="w-10 h-10 rounded-lg object-cover border border-stardust-400/30 shadow-lg"
            />
            <span className="text-lg font-bold text-gradient-gold tracking-tight">
              รุทสะกิดดาว
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
            {/* Tarot Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'tarot' ? null : 'tarot')}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                  openDropdown === 'tarot' || isActive('/tarot')
                    ? 'text-stardust-400 text-glow-soft'
                    : 'text-cosmic-200 hover:text-stardust-300'
                }`}
              >
                ไพ่ทาโรต์
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'tarot' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'tarot' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 mt-3 w-64 glass-panel rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="py-2">
                      <Link to="/tarot" className="block px-4 py-2.5 hover:bg-cosmic-800/50 transition-colors" onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-medium text-white">ไพ่เสี่ยงทาย</p>
                        <p className="text-xs text-cosmic-300 mt-0.5">เปิดไพ่ 3 ใบ ทำนายดวง</p>
                      </Link>
                      <Link to="/tarot#specialized" className="block px-4 py-2.5 hover:bg-cosmic-800/50 transition-colors" onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-medium text-white">ไพ่เฉพาะด้าน</p>
                        <p className="text-xs text-cosmic-300 mt-0.5">ความรัก การงาน การเงิน สุขภาพ</p>
                      </Link>
                      <Link to="/tarot#celtic-cross" className="block px-4 py-2.5 hover:bg-cosmic-800/50 transition-colors" onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-medium text-white">Celtic Cross</p>
                        <p className="text-xs text-cosmic-300 mt-0.5">ไพ่ 10 ใบ วิเคราะห์เชิงลึก</p>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Horoscope Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'horoscope' ? null : 'horoscope')}
                className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                  openDropdown === 'horoscope' || isActive('/horoscope') || isActive('/uranian')
                    ? 'text-stardust-400 text-glow-soft'
                    : 'text-cosmic-200 hover:text-stardust-300'
                }`}
              >
                ดูดวง
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'horoscope' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openDropdown === 'horoscope' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-full left-0 mt-3 w-64 glass-panel rounded-xl shadow-2xl overflow-hidden"
                  >
                    <div className="py-2">
                      <Link to="/horoscope" className="block px-4 py-2.5 hover:bg-cosmic-800/50 transition-colors" onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-medium text-white">ดูดวงรายวัน</p>
                        <p className="text-xs text-cosmic-300 mt-0.5">ทำนายดวงรายวันตามราศี</p>
                      </Link>
                      <Link to="/uranian" className="block px-4 py-2.5 hover:bg-cosmic-800/50 transition-colors" onClick={() => setOpenDropdown(null)}>
                        <p className="text-sm font-medium text-white">โหราศาสตร์ยูเรเนียน</p>
                        <p className="text-xs text-cosmic-300 mt-0.5">ระบบโหราศาสตร์ขั้นสูง</p>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/articles" className={navLinkClass('/articles')}>บทความ</Link>
            <Link to="/history" className={navLinkClass('/history')}>ประวัติ</Link>

            {/* CTA + Auth */}
            <div className="flex items-center gap-3 ml-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-sm text-cosmic-200 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-cosmic-800 border border-cosmic-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-stardust-400" />
                    </div>
                    <span className="max-w-[100px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
                    {isPremium && <Crown className="w-3.5 h-3.5 text-stardust-400" />}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-cosmic-400 hover:text-white transition-colors"
                    title="ออกจากระบบ"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 border border-stardust-400/50 shadow-lg shadow-stardust-500/30 text-deep-950 text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-cosmic-300 hover:text-stardust-400 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-cosmic-800/50 bg-deep-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-1">
              <Link to="/" className="block px-3 py-2.5 rounded-lg text-cosmic-100 hover:bg-cosmic-800/50 hover:text-stardust-300 font-medium text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                หน้าหลัก
              </Link>

              {/* Tarot group */}
              <p className="px-3 pt-3 pb-1 text-xs font-semibold text-stardust-500 uppercase tracking-wider">ไพ่ทาโรต์</p>
              <Link to="/tarot" className="block px-3 py-2 rounded-lg text-cosmic-300 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                ไพ่เสี่ยงทาย
              </Link>
              <Link to="/tarot#specialized" className="block px-3 py-2 rounded-lg text-cosmic-300 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                ไพ่เฉพาะด้าน
              </Link>
              <Link to="/tarot#celtic-cross" className="block px-3 py-2 rounded-lg text-cosmic-300 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                Celtic Cross
              </Link>

              {/* Horoscope group */}
              <p className="px-3 pt-3 pb-1 text-xs font-semibold text-stardust-500 uppercase tracking-wider">ดูดวง</p>
              <Link to="/horoscope" className="block px-3 py-2 rounded-lg text-cosmic-300 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                ดูดวงรายวัน
              </Link>
              <Link to="/uranian" className="block px-3 py-2 rounded-lg text-cosmic-300 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                โหราศาสตร์ยูเรเนียน
              </Link>

              <div className="border-t border-cosmic-800/50 mt-3 pt-3">
                <Link to="/articles" className="block px-3 py-2.5 rounded-lg text-cosmic-100 hover:bg-cosmic-800/50 hover:text-stardust-300 font-medium text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                  📚 บทความ
                </Link>
                <Link to="/history" className="block px-3 py-2.5 rounded-lg text-cosmic-100 hover:bg-cosmic-800/50 hover:text-stardust-300 font-medium text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                  📋 ประวัติ
                </Link>
              </div>

              <div className="border-t border-cosmic-800/50 mt-3 pt-3">
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-cosmic-100 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4" /> โปรไฟล์
                      {isPremium && <Crown className="w-3.5 h-3.5 text-stardust-400" />}
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-cosmic-400 hover:bg-cosmic-800/50 hover:text-stardust-300 text-sm transition-colors w-full">
                      <LogOut className="w-4 h-4" /> ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-2.5 bg-gradient-to-r from-stardust-500 to-stardust-600 text-deep-950 text-sm font-semibold rounded-lg transition-colors border border-stardust-400/50 shadow-lg shadow-stardust-500/30">
                    เข้าสู่ระบบ
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
