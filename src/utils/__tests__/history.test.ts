import { saveReading, getHistory } from '../history';

describe('Reading History', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve reading history', () => {
    const reading = {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'tarot' as const,
      reading: 'Test reading',
      details: {
        cards: [
          { name: 'The Fool', isReversed: false }
        ]
      }
    };
    
    saveReading(reading);
    const history = getHistory();
    
    expect(history).toHaveLength(1);
    expect(history[0]).toEqual(reading);
  });

  it('should handle empty history', () => {
    const history = getHistory();
    expect(history).toEqual([]);
  });

  it('should append new readings to existing history', () => {
    const reading1 = {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'tarot' as const,
      reading: 'First reading',
      details: {
        cards: [
          { name: 'The Fool', isReversed: false }
        ]
      }
    };

    const reading2 = {
      id: '2',
      timestamp: new Date().toISOString(),
      type: 'zodiac' as const,
      reading: 'Second reading',
      details: {
        sign: 'Aries'
      }
    };

    saveReading(reading1);
    saveReading(reading2);
    
    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]).toEqual(reading1);
    expect(history[1]).toEqual(reading2);
  });

  it('should handle invalid localStorage data', () => {
    localStorage.setItem('readings', 'invalid json');
    const history = getHistory();
    expect(history).toEqual([]);
  });

  it('should handle saving invalid data', () => {
    const invalidReading = {
      id: '1',
      // @ts-expect-error testing invalid data
      type: 'invalid',
      reading: 'Test'
    };

    // Should not throw error
    expect(() => saveReading(invalidReading)).not.toThrow();
  });
}); 