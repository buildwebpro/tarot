interface ReadingHistory {
  id: string;
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

export const getHistory = (): ReadingHistory[] => {
  try {
    return JSON.parse(localStorage.getItem('readings') || '[]');
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}; 