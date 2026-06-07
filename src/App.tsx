import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Lazy load pages — each page loads only when visited
const HomePage         = lazy(() => import('./pages/HomePage'));
const TarotPage        = lazy(() => import('./pages/TarotPage'));
const HoroscopePage    = lazy(() => import('./pages/HoroscopePage'));
const UranianPage      = lazy(() => import('./pages/UranianPage'));
const ArticlesPage     = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage= lazy(() => import('./pages/ArticleDetailPage'));
const HistoryPage        = lazy(() => import('./pages/HistoryPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const AdminPage        = lazy(() => import('./pages/AdminPage'));
const PricingPage      = lazy(() => import('./pages/PricingPage'));
const OrekurumPage      = lazy(() => import('./pages/OrekurumPage'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-stardust-500/30 border-t-stardust-400 animate-spin" />
        <p className="text-cosmic-300 text-sm animate-pulse">กำลังโหลด...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div role="main" aria-label="รุทสะกิดดาว — ดูดวงออนไลน์">
      <Helmet>
        <title>รุทสะกิดดาว — ดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน ดูดวงรายวัน</title>
        <meta name="description" content="บริการดูดวงออนไลน์ ไพ่ทาโรต์ ไพ่เสี่ยงทาย Celtic Cross ดูดวงรายวันตามราศี โหราศาสตร์ยูเรเนียน ทำนายดวงชะตาแม่นยำ 20ปี ประสบการณ์" />
        <meta name="keywords" content="ดูดวง, ไพ่ทาโรต์, ดูดวงรายวัน, ราศี, ทำนาย, ดูดวงฟรี, ดูดวงแม่นๆ, Celtic Cross, ไพ่เสี่ยงทาย, โหราศาสตร์ยูเรเนียน, 20ปี ประสบการณ์" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="รุทสะกิดดาว" />
        <meta property="og:title" content="รุทสะกิดดาว — ดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน ดูดวงรายวัน" />
        <meta property="og:description" content="บริการดูดวงออนไลน์ ไพ่ทาโรต์ ไพ่เสี่ยงทาย Celtic Cross ดูดวงรายวันตามราศี โหราศาสตร์ยูเรเนียน ทำนายดวงชะตาแม่นยำ 20ปี ประสบการณ์" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:locale" content="th_TH" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="รุทสะกิดดาว — ดูดวงไพ่ทาโรต์ โหราศาสตร์ยูเรเนียน ดูดวงรายวัน" />
        <meta name="twitter:description" content="บริการดูดวงออนไลน์ ไพ่ทาโรต์ ดูดวงรายวันตามราศี ทำนายดวงชะตาแม่นยำ 20ปี ประสบการณ์" />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* SEO */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="author" content="รุทสะกิดดาว" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <html lang="th" />
        <link rel="canonical" href="https://rujskiddao-tarot.web.app" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>

      {/* Global CSS Stars Background */}
      <div className="fixed inset-0 bg-stars opacity-50 pointer-events-none -z-10 animate-twinkle"></div>

      <div className="min-h-screen flex flex-col bg-transparent text-cosmic-100">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tarot" element={<TarotPage />} />
              <Route path="/horoscope" element={<HoroscopePage />} />
              <Route path="/uranian" element={<UranianPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/orekurum" element={<OrekurumPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;