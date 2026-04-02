import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, CreditCard, History, Shield, Search, ChevronLeft, ChevronRight, Crown, Trash2, Edit2, FileText, Plus, Eye, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/users';
import { historyService, articleService } from '../services/firestore';
import type { UserProfile } from '../types/firebase';
import type { ReadingHistory, Article } from '../types/firebase';
import { ArticleForm } from '../components/ArticleForm';

export default function AdminPage() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userReadings, setUserReadings] = useState<ReadingHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'readings' | 'articles'>('users');
  const [allReadings, setAllReadings] = useState<ReadingHistory[]>([]);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [editingCredits, setEditingCredits] = useState(false);
  const [editCreditsValue, setEditCreditsValue] = useState('');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');

  useEffect(() => {
    if (userProfile?.isAdmin) {
      loadData();
    }
  }, [userProfile?.isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allUsers = await usersService.getAllUsers();
      setUsers(allUsers);

      const readings = await historyService.getAllReadings();
      setAllReadings(readings);

      // Load articles
      setArticlesLoading(true);
      const allArticles = await articleService.getArticles();
      setArticles(allArticles);
      setArticlesLoading(false);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReadings = async (userId: string) => {
    try {
      const readings = await historyService.getUserHistory(userId);
      setUserReadings(readings);
    } catch (error) {
      console.error('Error loading user readings:', error);
    }
  };

  const handleTopUp = async (targetUser: UserProfile) => {
    const amount = parseInt(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    setTopUpLoading(true);
    try {
      await usersService.topUpCredits(targetUser.uid, amount);
      await loadData();
      if (selectedUser) {
        const updated = users.find(u => u.uid === targetUser.uid);
        if (updated) setSelectedUser(updated);
      }
      setTopUpAmount('');
    } catch (error) {
      console.error('Error topping up:', error);
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleUpdateCredits = async (targetUser: UserProfile) => {
    const newCredits = parseInt(editCreditsValue);
    if (isNaN(newCredits) || newCredits < 0) return;

    setTopUpLoading(true);
    try {
      const { updateUserCredits } = await import('../services/users');
      await updateUserCredits(targetUser.uid, newCredits);
      await loadData();
      if (selectedUser) {
        const updated = users.find(u => u.uid === targetUser.uid);
        if (updated) setSelectedUser(updated);
      }
      setEditingCredits(false);
      setEditCreditsValue('');
    } catch (error) {
      console.error('Error updating credits:', error);
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('ต้องการลบสมาชิกนี้?')) return;
    try {
      await usersService.deleteUser(userId);
      await loadData();
      if (selectedUser?.uid === userId) {
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('ต้องการลบบทความนี้?')) return;
    try {
      await articleService.deleteArticle(articleId);
      await loadData();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSaveArticle = () => {
    setShowArticleForm(false);
    setSelectedArticle(null);
    loadData();
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setShowArticleForm(true);
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setShowArticleForm(true);
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
    a.tags.some(tag => tag.toLowerCase().includes(articleSearchQuery.toLowerCase()))
  );

  const categoryLabels: Record<string, string> = {
    general: 'ทั่วไป',
    uranian: 'ยูเรเนียน',
    tarot: 'ทาโรต์',
    zodiac: 'ดูดวงรายวัน',
    premium: 'Premium',
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (!user || !userProfile?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>จัดการระบบ | รุทสะกิดดาว</title>
      </Helmet>

      <section className="py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-full mb-6">
            <Shield className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">จัดการระบบ</h1>
          <p className="text-lg text-purple-200">ผู้ดูแลระบบ</p>
        </header>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <p className="text-3xl font-bold text-white">{users.length}</p>
              <p className="text-purple-300 text-sm">สมาชิกทั้งหมด</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <Crown className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <p className="text-3xl font-bold text-white">{users.filter(u => u.isPremium).length}</p>
              <p className="text-purple-300 text-sm">Premium</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <History className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-3xl font-bold text-white">{allReadings.length}</p>
              <p className="text-purple-300 text-sm">คำทำนายทั้งหมด</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
            >
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-stardust-400" />
              <p className="text-3xl font-bold text-white">
                {users.reduce((sum, u) => sum + (u.credits || 0), 0)}
              </p>
              <p className="text-purple-300 text-sm">เครดิตรวม</p>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex gap-4 border-b border-purple-800">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              สมาชิก
            </button>
            <button
              onClick={() => setActiveTab('readings')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'readings'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <History className="w-4 h-4 inline-block mr-2" />
              ประวัติการทำนาย
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`pb-4 px-4 font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              บทความ
            </button>
          </div>
        </div>

        {activeTab === 'users' ? (
          <div className="max-w-6xl mx-auto px-4">
            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                placeholder="ค้นหาสมาชิก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">สมาชิก</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">สถานะ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">เครดิต</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">ทำนายแล้ว</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">วันที่สมัคร</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-purple-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-white">{u.displayName || 'ไม่มีชื่อ'}</p>
                            <p className="text-sm text-purple-300">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {u.isPremium ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm">
                              <Crown className="w-3 h-3" /> Premium
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-purple-700/50 text-purple-300 rounded-full text-sm">สมาชิก</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-stardust-400 font-medium">{u.credits || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-purple-300">{u.freeReadingsCount || 0} ครั้ง</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-purple-300 text-sm">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('th-TH') : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setSelectedUser(u); loadUserReadings(u.uid); }}
                              className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg transition-colors"
                              title="ดูประวัติ"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.uid)}
                              className="p-2 text-purple-300 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'articles' ? (
          <div className="max-w-6xl mx-auto px-4">
            {/* Articles Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="ค้นหาบทความ..."
                  value={articleSearchQuery}
                  onChange={(e) => setArticleSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-purple-700/50 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <button
                onClick={handleCreateArticle}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 text-deep-950 font-semibold rounded-xl transition-all ml-4"
              >
                <Plus className="w-4 h-4" />
                สร้างบทความ
              </button>
            </div>

            {/* Articles Table */}
            {articlesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-purple-900/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">บทความ</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">หมวดหมู่</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Tags</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">SEO</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">วันที่เผยแพร่</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-purple-200">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-800/50">
                      {filteredArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-purple-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {article.imageUrl ? (
                                <img src={article.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-cosmic-800 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-cosmic-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white line-clamp-1">{article.title}</p>
                                <p className="text-sm text-purple-300 line-clamp-1">/{article.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              article.category === 'premium' ? 'bg-amber-500/20 text-amber-300' :
                              article.category === 'uranian' ? 'bg-blue-500/20 text-blue-300' :
                              article.category === 'tarot' ? 'bg-purple-500/20 text-purple-300' :
                              article.category === 'zodiac' ? 'bg-green-500/20 text-green-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {categoryLabels[article.category] || article.category}
                            </span>
                            {article.isPremium && (
                              <Crown className="w-3 h-3 text-amber-400 ml-1 inline" />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-xs bg-cosmic-800 text-cosmic-300 px-2 py-0.5 rounded">
                                  #{tag}
                                </span>
                              ))}
                              {article.tags.length > 2 && (
                                <span className="text-xs text-cosmic-400">+{article.tags.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {article.seoTitle && <Globe className="w-4 h-4 text-green-400" title="มี SEO" />}
                              <span className="text-xs text-cosmic-400">
                                {article.seoTitle?.length || 0}/60
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-purple-300 text-sm">
                              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('th-TH') : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg transition-colors"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                className="p-2 text-purple-300 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredArticles.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-cosmic-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>ยังไม่มีบทความ</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <div className="space-y-4">
                {allReadings.slice(0, 50).map((reading) => (
                  <div key={reading.id} className="bg-purple-900/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {reading.type === 'tarot' ? '🃏' : reading.type === 'uranian' ? '🔮' : '⭐'}
                        </span>
                        <div>
                          <span className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">
                            {reading.type}
                          </span>
                          <p className="text-purple-300 text-xs mt-1">
                            {new Date(reading.timestamp).toLocaleString('th-TH')}
                          </p>
                        </div>
                      </div>
                      <p className="text-purple-300 text-sm truncate max-w-xs">{reading.reading?.slice(0, 50)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-deep-950/95 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-purple-700/50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">รายละเอียดสมาชิก</h3>
              <button onClick={() => setSelectedUser(null)} className="text-purple-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-6">
              <div className="bg-purple-900/30 rounded-xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-purple-800 flex items-center justify-center text-2xl">
                    {selectedUser.displayName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{selectedUser.displayName || 'ไม่มีชื่อ'}</p>
                    <p className="text-purple-300">{selectedUser.email}</p>
                    {selectedUser.isPremium && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs mt-1">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-800/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-stardust-400">{selectedUser.credits || 0}</p>
                    <p className="text-purple-300 text-sm">เครดิต</p>
                  </div>
                  <div className="bg-purple-800/30 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-300">{selectedUser.freeReadingsCount || 0}</p>
                    <p className="text-purple-300 text-sm">ครั้งที่ทำนาย</p>
                  </div>
                </div>
              </div>

              {/* Credits Info */}
              <div className="bg-purple-900/30 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-stardust-400" />
                  เครดิต
                </h4>
                <div className="flex gap-3">
                  {editingCredits ? (
                    <>
                      <input
                        type="number"
                        value={editCreditsValue}
                        onChange={(e) => setEditCreditsValue(e.target.value)}
                        placeholder="จำนวนเครดิตใหม่"
                        className="flex-1 px-4 py-2 bg-purple-800/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        onClick={() => handleUpdateCredits(selectedUser)}
                        disabled={topUpLoading || !editCreditsValue}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:from-purple-700 disabled:to-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                      >
                        {topUpLoading ? 'กำลัง...' : 'บันทึก'}
                      </button>
                      <button
                        onClick={() => { setEditingCredits(false); setEditCreditsValue(''); }}
                        className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      >
                        ยกเลิก
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 bg-purple-800/30 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-stardust-400">{selectedUser.credits || 0}</p>
                        <p className="text-purple-300 text-sm">เครดิต</p>
                      </div>
                      <button
                        onClick={() => { setEditingCredits(true); setEditCreditsValue(String(selectedUser.credits || 0)); }}
                        className="p-2 text-purple-300 hover:text-white hover:bg-purple-700/50 rounded-lg transition-colors"
                        title="แก้ไขเครดิต"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <div className="flex gap-2 ml-2">
                        <input
                          type="number"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          placeholder="+เครดิต"
                          className="w-24 px-3 py-2 bg-purple-800/50 border border-purple-600/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <button
                          onClick={() => handleTopUp(selectedUser)}
                          disabled={topUpLoading || !topUpAmount}
                          className="px-4 py-2 bg-gradient-to-r from-stardust-500 to-stardust-600 hover:from-stardust-400 hover:to-stardust-500 disabled:from-purple-700 disabled:to-purple-800 disabled:cursor-not-allowed text-deep-950 font-semibold rounded-lg transition-colors"
                        >
                          {topUpLoading ? '...' : '+'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Reading History */}
              <div className="bg-purple-900/30 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-3">ประวัติการทำนาย ({userReadings.length})</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {userReadings.map((r) => (
                    <div key={r.id} className="bg-purple-800/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {r.type === 'tarot' ? '🃏' : r.type === 'uranian' ? '🔮' : '⭐'}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-700/50 rounded text-xs">{r.type}</span>
                        <span className="text-purple-300 text-xs ml-auto">
                          {new Date(r.timestamp).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm truncate">{r.reading}</p>
                    </div>
                  ))}
                  {userReadings.length === 0 && (
                    <p className="text-purple-400 text-sm text-center py-4">ยังไม่มีประวัติการทำนาย</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Article Form Modal */}
      {showArticleForm && (
        <ArticleForm
          article={selectedArticle}
          onSave={handleSaveArticle}
          onCancel={() => {
            setShowArticleForm(false);
            setSelectedArticle(null);
          }}
        />
      )}
    </>
  );
}
