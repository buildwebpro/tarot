import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, BookOpen, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { articleService } from '../services/firestore';
import { getDemoArticleBySlug } from '../data/articles';
import type { Article } from '../types/firebase';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      const fetched = await articleService.getArticleBySlug(articleSlug);
      if (fetched) {
        setArticle(fetched);
      } else {
        // Try demo articles
        const demoArticle = getDemoArticleBySlug(articleSlug);
        if (demoArticle) {
          setArticle(demoArticle as Article);
        } else {
          setError('ไม่พบบทความที่ต้องการ');
        }
      }
    } catch (err) {
      console.error('Error loading article:', err);
      // Fallback to demo
      const demoArticle = getDemoArticleBySlug(articleSlug);
      if (demoArticle) {
        setArticle(demoArticle as Article);
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดบทความ');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-stardust-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-stardust-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-stardust-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-24">
        <BookOpen className="w-20 h-20 mx-auto mb-6 text-cosmic-500/50" />
        <h2 className="text-2xl font-bold mb-4 text-white">{error || 'ไม่พบบทความ'}</h2>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าบทความ
        </Link>
      </div>
    );
  }

  const publishedDate = new Date(article.publishedAt);
  const updatedDate = new Date(article.updatedAt);

  // Category display mapping
  const categoryLabels: Record<string, string> = {
    general: 'ทั่วไป',
    uranian: 'โหราศาสตร์ยูเรเนียน',
    tarot: 'ไพ่ทาโรต์',
    zodiac: 'ดูดวงรายวัน',
  };

  return (
    <>
      <Helmet>
        <title>{article.title} | รุทสะกิดดาว - บทความดูดวงและโหราศาสตร์</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.tags.join(', ')} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.imageUrl || '/og-image.jpg'} />
        <meta property="og:site_name" content="รุทสะกิดดาว" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.imageUrl || '/og-image.jpg'} />

        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "datePublished": article.publishedAt,
            "dateModified": article.updatedAt,
            "image": article.imageUrl,
            "publisher": {
              "@type": "Organization",
              "name": "รุทสะกิดดาว",
              "logo": {
                "@type": "ImageObject",
                "url": "/favicon.png"
              }
            }
          })}
        </script>
      </Helmet>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-8 px-4"
      >
        {/* Back button */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-cosmic-300 hover:text-stardust-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          กลับไปหน้าบทความ
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="text-xs font-medium text-stardust-400 bg-cosmic-900/50 border border-stardust-700/30 px-3 py-1.5 rounded-full">
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-cosmic-200 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm text-cosmic-400 flex-wrap">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-cosmic-300">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-cosmic-300">
                {publishedDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {article.updatedAt !== article.publishedAt && (
              <div className="flex items-center gap-2 text-cosmic-500">
                <span>(อัปเดต: {updatedDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })})</span>
              </div>
            )}
          </div>

          {article.imageUrl && (
            <div className="mt-8 relative overflow-hidden rounded-2xl">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-950/60 to-transparent"></div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="glass-panel rounded-2xl p-6 md:p-10 border border-cosmic-700/50">
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-cosmic-100 leading-relaxed whitespace-pre-line text-lg">
              {article.content}
            </div>
          </div>
        </div>

        {/* Tags */}
        <footer className="mt-10 pt-8 border-t border-cosmic-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-4 h-4 text-cosmic-400" />
            <span className="text-sm text-cosmic-400">แท็ก:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm text-cosmic-300 bg-cosmic-900/50 border border-cosmic-700/30 px-3 py-1.5 rounded-full hover:border-stardust-500/30 hover:text-stardust-300 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>

        {/* Related Articles CTA */}
        <div className="mt-12 glass-card p-8 rounded-2xl border border-cosmic-700/50 text-center">
          <h3 className="text-xl font-bold text-white mb-3">อ่านบทความเพิ่มเติม</h3>
          <p className="text-cosmic-300 mb-6">ค้นพบความลับของดวงดาวและไพ่ทาโรต์ได้อีกมากมาย</p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
          >
            ดูบทความทั้งหมด
          </Link>
        </div>
      </motion.article>
    </>
  );
}