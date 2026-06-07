export interface Card {
  name: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  image: string;
}

export interface ZodiacSign {
  name: string;
  thaiName: string;
  period: string;
  element: string;
  image: string;
}

export type ReadingType = 'tarot' | 'zodiac'; 