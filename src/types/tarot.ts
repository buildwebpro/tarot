export type Card = {
  name: string;
  image: string;
  meaning: {
    upright: string[];
    reversed: string[];
  };
};

export interface Reading {
  cards: Card[];
  isReversed: boolean[];
  interpretation: string;
}