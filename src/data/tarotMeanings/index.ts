import { majorArcanaMeanings } from './majorArcana';
import { minorArcanaMeanings } from './minorArcana';

// รวมความหมายไพ่ทั้งหมด
export const tarotMeanings = {
  ...majorArcanaMeanings,
  ...minorArcanaMeanings
};

// export แยกประเภทสำหรับการใช้งานเฉพาะ
export { majorArcanaMeanings } from './majorArcana';
export { minorArcanaMeanings } from './minorArcana';

// type สำหรับความหมายไพ่
export type TarotMeaning = {
  upright: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
  reversed: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
};

export type TarotMeanings = {
  [key: string]: TarotMeaning;
}; 