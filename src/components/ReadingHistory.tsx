import { motion } from 'framer-motion';
import { getHistory } from '../utils/history';

export function ReadingHistory() {
  const history = getHistory();
  
  return (
    <section className="mt-16 border-t border-purple-500/30 pt-16">
      <header className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">ประวัติการดูดวง</h2>
        <p className="text-lg text-purple-200">ประวัติการดูดวงทั้งหมดของคุณ</p>
      </header>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {history.length === 0 ? (
          <div className="text-center text-purple-300">
            ยังไม่มีประวัติการดูดวง
          </div>
        ) : (
          history.map((reading) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-200">
                  {new Date(reading.timestamp).toLocaleString('th-TH')}
                </span>
                <span className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">
                  {reading.type === 'tarot' ? 'ไพ่ทาโรต์' : 'ดูดวงราศี'}
                </span>
              </div>
              
              {reading.type === 'tarot' && reading.details.cards && (
                <div className="flex gap-4 mb-4">
                  {reading.details.cards.map((card, index) => (
                    <div key={index} className="text-sm text-purple-200">
                      {card.name} {card.isReversed ? '(กลับหัว)' : ''}
                    </div>
                  ))}
                </div>
              )}
              
              {reading.type === 'zodiac' && reading.details.sign && (
                <div className="mb-4 text-purple-200">
                  {reading.details.sign}
                </div>
              )}
              
              <p className="text-lg whitespace-pre-line">{reading.reading}</p>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
} 