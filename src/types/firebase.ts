export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  isPremium: boolean;
  isAdmin?: boolean;
  credits: number;
  freeReadingsCount: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  type: 'tarot' | 'uranian' | 'zodiac' | 'celtic_cross';
  timestamp: string;
  reading: string;
  details: {
    cards?: Array<{ name: string; isReversed: boolean }>;
    birthData?: {
      date: string;
      time: string;
      place: string;
    };
    sign?: string;
  };
  isPremium: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: 'general' | 'uranian' | 'tarot' | 'zodiac' | 'premium';
  isPremium: boolean;
  imageUrl?: string;
  tags: string[];
  // SEO Fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
}
