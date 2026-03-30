import { 
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ReadingHistory, Article } from '../types/firebase';

export const historyService = {
  async saveReading(reading: Omit<ReadingHistory, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'history'), {
      ...reading,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  },

  async getUserHistory(userId: string, type?: string): Promise<ReadingHistory[]> {
    let q;
    if (type) {
      q = query(
        collection(db, 'history'),
        where('userId', '==', userId),
        where('type', '==', type),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    } else {
      q = query(
        collection(db, 'history'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ReadingHistory));
  },

  async getReading(readingId: string): Promise<ReadingHistory | null> {
    const docSnap = await getDoc(doc(db, 'history', readingId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ReadingHistory;
    }
    return null;
  },

  async deleteReading(readingId: string) {
    await deleteDoc(doc(db, 'history', readingId));
  },

  async getAllReadings(): Promise<ReadingHistory[]> {
    const q = query(
      collection(db, 'history'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ReadingHistory));
  },
};

export const articleService = {
  async getArticles(category?: string, isPremiumOnly = false): Promise<Article[]> {
    let q;
    const constraints = [];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (isPremiumOnly) {
      constraints.push(where('isPremium', '==', true));
    }
    
    constraints.push(orderBy('publishedAt', 'desc'));
    
    q = query(collection(db, 'articles'), ...constraints);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Article));
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const q = query(
      collection(db, 'articles'),
      where('slug', '==', slug),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Article;
  },

  async getArticle(articleId: string): Promise<Article | null> {
    const docSnap = await getDoc(doc(db, 'articles', articleId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Article;
    }
    return null;
  },

  // Admin function to create article (should be protected)
  async createArticle(article: Omit<Article, 'id' | 'publishedAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, 'articles'), {
      ...article,
      publishedAt: now,
      updatedAt: now,
      // Default SEO values if not provided
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt,
      seoKeywords: article.seoKeywords || article.tags.join(', '),
    });
    return docRef.id;
  },

  async updateArticle(articleId: string, updates: Partial<Article>) {
    await updateDoc(doc(db, 'articles', articleId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteArticle(articleId: string) {
    await deleteDoc(doc(db, 'articles', articleId));
  },
};
