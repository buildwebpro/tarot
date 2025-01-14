export interface Card {
  name: string;
  image: string;
  meaning: {
    love: {
      upright: string;
      reversed: string;
    };
    career: {
      upright: string;
      reversed: string;
    };
    finance: {
      upright: string;
      reversed: string;
    };
    health: {
      upright: string;
      reversed: string;
    };
  };
}

export interface Reading {
  cards: Card[];
  isReversed: boolean[];
  interpretation: string;
}