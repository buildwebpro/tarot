import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Article } from '../types/firebase';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  // Category display mapping
  const categoryLabels: Record<string, string> = {
    general: 'ทั่วไป',
    uranian: 'โหราศาสตร์ยูเรเนียน',
    tarot: 'ไพ่ทาโรต์',
    zodiac: 'ดูดวงรายวัน',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-deep-950/95 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-cosmic-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-deep-950/90 backdrop-blur-sm border-b border-cosmic-800/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-stardust-400 bg-cosmic-900/50 border border-stardust-700/30 px-2.5 py-1 rounded-full">
                {categoryLabels[article.category] || article.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-cosmic-400 hover:text-stardust-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <article className="p-6 md:p-8">
              <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-6 text-white leading-tight">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-cosmic-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-cosmic-300">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-cosmic-300">
                      {new Date(article.publishedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <p className="text-cosmic-200 text-lg leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 md:h-64 object-cover rounded-xl"
                  />
                )}
              </header>

              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-cosmic-100 leading-relaxed whitespace-pre-line text-base md:text-lg">
                  {article.content}
                </div>
              </div>

              <footer className="mt-8 pt-6 border-t border-cosmic-800/50">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm text-cosmic-300 bg-cosmic-900/50 border border-cosmic-700/30 px-3 py-1.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </footer>
            </article>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}