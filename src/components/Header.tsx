import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: '#tarot', label: 'ไพ่เสี่ยงทาย' },
    { href: '#specialized-reading', label: 'ไพ่เฉพาะด้าน' },
    { href: '#celtic-cross', label: 'Celtic Cross' },
    { href: '#horoscope', label: 'ดูดวงรายวัน' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-purple-900/80 backdrop-blur-sm border-b border-gray-500/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-purple-600 p-2 rounded-full">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-200 to-purple-400 bg-clip-text text-transparent">
                <a href="/">รุทสะกิดดาว</a>
              </h1>
              <p className="text-purple-300 text-xs hidden sm:block">
                ทำนายชะตาชีวิตด้วยไพ่ทาโรต์และดูดวงรายวัน
              </p>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex gap-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-purple-200 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-purple-200 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-500/30"
          >
            <ul className="flex flex-col px-4 py-4 gap-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-purple-200 hover:text-white transition-colors block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
