import { Helmet } from 'react-helmet';
import { ArticleList } from '../components/ArticleList';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArticlesPage() {
  return (
    <>
      <Helmet>
        <title>บทความโหราศาสตร์ - เกร็ดความรู้ไพ่ทาโรต์และยูเรเนียน | รุทสะกิดดาว</title>
        <meta name="description" content="รวมบทความโหราศาสตร์ ไพ่ทาโรต์ ยูเรเนียน ดวงรายวัน ราศี ความรู้และเกร็ดน่ารู้สำหรับผู้สนใจโหราศาสตร์ อัปเดตใหม่ทุกสัปดาห์" />
        <meta name="keywords" content="บทความโหราศาสตร์, ไพ่ทาโรต์, ยูเรเนียน, ดูดวง, ราศี, ดวงชะตา, ความรู้โหราศาสตร์" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="บทความโหราศาสตร์ - รุทสะกิดดาว" />
        <meta property="og:description" content="รวมบทความโหราศาสตร์ ไพ่ทาโรต์ ยูเรเนียน และดูดวงรายวัน" />
        <meta property="og:site_name" content="รุทสะกิดดาว" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="บทความโหราศาสตร์ - รุทสะกิดดาว" />
        <meta name="twitter:description" content="รวมบทความโหราศาสตร์ ไพ่ทาโรต์ ยูเรเนียน และดูดวงรายวัน" />
      </Helmet>

      <section className="py-8 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-stardust-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-stardust-500/20 to-stardust-600/10 rounded-full mb-6 border border-stardust-500/20"
          >
            <BookOpen className="w-10 h-10 text-stardust-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-stardust-400 to-stardust-500"
          >
            บทความโหราศาสตร์
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-cosmic-200 max-w-2xl mx-auto"
          >
            ความรู้และเกร็ดความรู้เกี่ยวกับโหราศาสตร์ ไพ่ทาโรต์ และยูเรเนียน
            <br />
            <span className="text-cosmic-400 text-sm mt-2 block">
              <Sparkles className="w-4 h-4 inline mr-1" />
              อัปเดตใหม่ทุกสัปดาห์
            </span>
          </motion.p>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ArticleList />
        </div>
      </section>
    </>
  );
}