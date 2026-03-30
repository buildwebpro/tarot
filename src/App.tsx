import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import HoroscopePage from './pages/HoroscopePage';
import UranianPage from './pages/UranianPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

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
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;