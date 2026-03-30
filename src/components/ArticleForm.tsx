import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Image, Save, Sparkles } from 'lucide-react';
import type { Article } from '../types/firebase';
import { articleService } from '../services/firestore';

interface ArticleFormProps {
  article?: Article | null;
  onSave: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'general', label: 'ทั่วไป' },
  { value: 'uranian', label: 'โหราศาสตร์ยูเรเนียน' },
  { value: 'tarot', label: 'ไพ่ทาโรต์' },
  { value: 'zodiac', label: 'ดูดวงรายวัน' },
  { value: 'premium', label: 'Premium' },
];

export function ArticleForm({ article, onSave, onCancel }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    author: article?.author || 'รุทสะกิดดาว',
    category: article?.category || 'general',
    isPremium: article?.isPremium || false,
    imageUrl: article?.imageUrl || '',
    tags: article?.tags?.join(', ') || '',
    seoTitle: article?.seoTitle || '',
    seoDescription: article?.seoDescription || '',
    seoKeywords: article?.seoKeywords || '',
    canonicalUrl: article?.canonicalUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^ก-๙a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      setError('กรุณากรอกข้อมูลที่จำเป็น');
      return;
    }

    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    setSaving(true);
    try {
      const articleData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category as Article['category'],
        isPremium: formData.isPremium,
        imageUrl: formData.imageUrl || undefined,
        tags,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        seoKeywords: formData.seoKeywords || tags.join(', '),
        canonicalUrl: formData.canonicalUrl || undefined,
      };

      if (article?.id) {
        await articleService.updateArticle(article.id, articleData);
      } else {
        await articleService.createArticle(articleData);
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-deep-950/95 backdrop-blur-xl rounded-2xl w-full max-w-4xl shadow-2xl border border-cosmic-700/50 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-deep-950/90 backdrop-blur-sm border-b border-cosmic-800/50 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-xl font-bold text-white">
            {article ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
          </h3>
          <button onClick={onCancel} className="text-cosmic-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-stardust-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              ข้อมูลพื้นฐาน
            </h4>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">หัวข้อบทความ *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                placeholder="หัวข้อบทความ"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cosmic-200 mb-1.5">Slug (URL) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                    placeholder="article-slug"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-3 bg-cosmic-800 hover:bg-cosmic-700 border border-cosmic-600/50 rounded-xl text-cosmic-300 text-sm transition-colors"
                  >
                    สร้าง
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cosmic-200 mb-1.5">หมวดหมู่</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-stardust-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-cosmic-200 mb-1.5">ผู้เขียน</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                  placeholder="ชื่อผู้เขียน"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cosmic-200 mb-1.5">Tags (คั่นด้วย comma)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                  placeholder="โหราศาสตร์, ยูเรเนียน, ดูดวง"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPremium"
                  checked={formData.isPremium}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-cosmic-900 border-cosmic-700 text-stardust-500 focus:ring-stardust-500"
                />
                <span className="text-cosmic-200">บทความ Premium</span>
              </label>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-stardust-400 flex items-center gap-2">
              <Image className="w-5 h-5" />
              รูปภาพ
            </h4>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">URL รูปภาพ</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-stardust-400">เนื้อหา</h4>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">คำอธิบายย่อ *</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 resize-none"
                placeholder="คำอธิบายย่อสำหรับแสดงในรายการบทความ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">เนื้อหาบทความ *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={12}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 resize-y font-mono text-sm"
                placeholder="เนื้อหาบทความ... (รองรับ emoji และข้อความธรรมดา)"
                required
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4 bg-cosmic-900/30 rounded-2xl p-6 border border-cosmic-800/50">
            <h4 className="text-lg font-semibold text-stardust-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              SEO (Search Engine Optimization)
            </h4>
            <p className="text-sm text-cosmic-400">ข้อมูลเหล่านี้จะช่วยให้บทความติด Google หรือ Search Engine อื่นๆ ได้ง่ายขึ้น</p>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                maxLength={60}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                placeholder="Title สำหรับ SEO (ไม่เกิน 60 ตัวอักษร)"
              />
              <p className="text-xs text-cosmic-500 mt-1">{formData.seoTitle.length}/60 ตัวอักษร</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">SEO Description</label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500 resize-none"
                placeholder="Description สำหรับ SEO (ไม่เกิน 160 ตัวอักษร)"
              />
              <p className="text-xs text-cosmic-500 mt-1">{formData.seoDescription.length}/160 ตัวอักษร</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">SEO Keywords</label>
              <input
                type="text"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                placeholder="คำค้นหาสำหรับ SEO (คั่นด้วย comma)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cosmic-200 mb-1.5">Canonical URL</label>
              <input
                type="url"
                name="canonicalUrl"
                value={formData.canonicalUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cosmic-900/50 border border-cosmic-700/50 rounded-xl text-white placeholder-cosmic-400 focus:outline-none focus:ring-2 focus:ring-stardust-500"
                placeholder="https://rujskiddao-tarot.web.app/articles/slug"
              />
              <p className="text-xs text-cosmic-500 mt-1">URL หลักของบทความ (ถ้ามีเวอร์ชันอื่น)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-cosmic-800/50">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-cosmic-300 hover:text-white transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 disabled:from-cosmic-700 disabled:to-cosmic-600 disabled:cursor-not-allowed text-deep-950 font-semibold rounded-xl transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
