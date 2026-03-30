import { useState, useEffect } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { articleService } from '../services/firestore';
import type { Article } from '../types/firebase';
import { ArticleModal } from './ArticleModal';
import { getAllDemoArticles } from '../data/articles';

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [filter, setFilter] = useState<'all' | 'free'>('all');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const fetchedArticles = await articleService.getArticles();
      if (fetchedArticles && fetchedArticles.length > 0) {
        setArticles(fetchedArticles);
      } else {
        // Use demo articles if Firestore is empty or unavailable
        setArticles(getAllDemoArticles() as Article[]);
      }
    } catch (error) {
      console.error('Error loading articles, using demo:', error);
      // Fallback to demo articles
      setArticles(getAllDemoArticles() as Article[]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    if (filter === 'free') return !article.isPremium;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-stardust-500 rounded-full animate-bounce" />
          <div className="w-2.5 h-2.5 bg-stardust-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2.5 h-2.5 bg-stardust-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8">
        {(['all', 'free'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-stardust-600 text-deep-950'
                : 'bg-cosmic-900/50 text-cosmic-300 hover:bg-cosmic-800/50 border border-cosmic-700/50'
            }`}
          >
            {f === 'all' ? 'ทั้งหมด' : 'ฟรี'}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, i) => (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => setSelectedArticle(article)}
            delay={i * 0.05}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-cosmic-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>ยังไม่มีบทความในหมวดหมู่นี้</p>
        </div>
      )}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

interface ArticleCardProps {
  article: Article;
  isPremium: boolean;
  onClick: () => void;
  delay?: number;
}

function ArticleCard({ article, onClick, delay = 0 }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group rounded-2xl border border-cosmic-700/50 overflow-hidden cursor-pointer hover:border-stardust-500/50 hover:shadow-lg hover:shadow-stardust-500/10 transition-all duration-200 glass-card"
      onClick={onClick}
    >
      <div className="relative h-44 bg-cosmic-900/50">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cosmic-900 to-cosmic-800">
            <BookOpen className="w-12 h-12 text-cosmic-500" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium text-stardust-400 bg-cosmic-900/50 border border-stardust-700/30 px-2 py-0.5 rounded-full">
            {article.category}
          </span>
          <span className="text-[11px] text-cosmic-400">
            {new Date(article.publishedAt).toLocaleDateString('th-TH')}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white mb-2 group-hover:text-stardust-300 transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-cosmic-300 mb-4 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {article.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-[11px] text-cosmic-400 bg-cosmic-900/50 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <ArrowRight className="w-4 h-4 text-cosmic-500 group-hover:text-stardust-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

export default ArticleList;
