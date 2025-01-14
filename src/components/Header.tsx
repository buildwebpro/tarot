import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-purple-500/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-purple-600 p-3 rounded-full">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-purple-400 bg-clip-text text-transparent">
                รุทสะกิดดาว
              </h1>
              <p className="text-purple-300 text-sm">
                ทำนายชะตาชีวิตด้วยไพ่ทาโรต์และดูดวงรายวัน
              </p>
            </div>
          </motion.div>

          <nav>
            <ul className="flex gap-6">
              <li>
                <a href="#tarot" className="text-purple-200 hover:text-white transition-colors">
                  ไพ่ทาโรต์
                </a>
              </li>
              <li>
                <a href="#celtic-cross" className="text-purple-200 hover:text-white transition-colors">
                  ดูไพ่10ใบ
                </a>
              </li>
              <li>
                <a href="#horoscope" className="text-purple-200 hover:text-white transition-colors">
                  ดูดวงรายวัน
                </a>
              </li>
              <li>
                <a href="#history" className="text-purple-200 hover:text-white transition-colors">
                  ประวัติการดูดวง
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 