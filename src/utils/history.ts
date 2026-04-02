import { collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ReadingHistory {
  id: string;
  userId?: string;
  timestamp: string;
  type: 'tarot' | 'zodiac';
  reading: string;
  details: {
    cards?: {
      name: string;
      isReversed: boolean;
      position?: string;
    }[];
    sign?: string;
    specializedType?: string;
    [key: string]: any;
  };
}

export const saveReading = (reading: ReadingHistory) => {
  try {
    const history = getHistory();
    localStorage.setItem('readings', JSON.stringify([...history, reading]));
  } catch (error) {
    console.error('Error saving reading:', error);
  }
};

export const saveReadingToFirestore = async (reading: ReadingHistory, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'history'), {
      ...reading,
      userId,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving reading to Firestore:', error);
    throw error;
  }
};

export const getHistory = (): ReadingHistory[] => {
  try {
    return JSON.parse(localStorage.getItem('readings') || '[]');
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};