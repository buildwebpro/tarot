import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// 32 คำถามโอเรกุรัม
const questions = [
  'สิ่งที่ฉันมุ่งมาดปรารถนาอยู่ขณะนี้ จะได้สมความปรารถนาหรือไม่ ?',
  'สิ่งที่ฉันเตรียมการ คิดจะทำในอนาคตอันใกล้นี้ ควรจะดำเนินการต่อหรือไม่ ?',
  'ในช่วงนี้ ฉันจะมีเคราะห์ดี เคราะห์ร้ายประการใดหรือไม่อย่างไร ?',
  'บุคคลที่ฉันพบเจอนั้น ฉันควรจะคบหากับเขาหรือไม่ ?',
  'เหตุการณ์ที่เกิดขึ้น หรือสิ่งที่ฉันเห็นนี้เป็นลางบอกเหตุดีร้ายอย่างไรแก่ฉัน ?',
  'คนที่ฉันตกหลุมรัก หรือแอบหมายปองอยู่นี้ จะได้สมหวังครองคู่กันหรือไม่ ?',
  'ถ้าฉันรักคนคนนี้ จะก่อผลดีหรือร้ายอย่างไรแก่ตัวฉัน ?',
  'ความฝัน ที่ฉันหลับฝันไปนั้น จะตีความได้ว่าอย่างไร ?',
  'คนแบบไหนที่ฉันควรคบ หรือไม่ควรคบอย่างไร ?',
  'การเดินทางครั้งนี้ จะมีอุปสรรคอย่างไรแก่ฉันหรือไม่ ?',
  'ฉันจะมีเรื่องบาดหมางใจกับภรรยาหรือไม่ ?',
  'ฉันจะมีเรื่องบาดหมางใจกับสามีหรือไม่ ?',
  'ในอนาคต ชีวิตฉันจะเป็นอย่างไร ?',
  'เพื่อนสนิทของฉันคนนี้ เขาจริงใจต่อฉันหรือไม่ ?',
  'คนที่พลัดพรากจากกันนั้น จะได้กลับมาพบกันอีกหรือไม่ ?',
  'คนที่อยู่ห่างไกลกันนั้น บัดนี้เขาสุขหรือทุกข์ประการใด ?',
  'ทรัพย์สินของฉันที่หายไปนั้นจะได้คืนมาหรือไม่ ?',
  'ฉันสมควรจะร่วมทำธุรกิจการค้ากับบุคคลนั้นดีหรือไม่ ?',
  'ธุรกิจที่ฉันคิดหรือเตรียมจะลงทุนครั้งนี้ สมควรจะดำเนินการดีหรือไม่ ประการใด ?',
  'คนที่ฉันร่วมลงทุนด้วย จะซื่อตรงต่อฉันตลอดไปหรือไม่ ?',
  'ฉันควรรับคนคนนี้ มาอยู่ด้วยหรือทำงานด้วยได้หรือไม่ ?',
  'จะมีคนมายืมเงินหรือข้าวของ ฉันควรจะให้เขายืมหรือไม่ ?',
  'การให้เขากู้ยืมเงิน-สิ่งของ ฉันจะได้เงินหรือของนั้นคืนหรือไม่ ?',
  'บุคคลที่ฉันร่วมงานด้วย หรือที่กำลังคบหาอยู่นี้ ฉันพอจะพึ่งพาอะไรเขาได้บ้างหรือไม่ ?',
  'บุตรของฉัน จะเป็นที่พึ่งของฉันในอนาคตได้หรือไม่ ?',
  'ฉันควรเชื่อข่าวที่ฉันได้รับมานี้ ว่าเป็นความจริงได้หรือไม่ ?',
  'ในช่วงนี้ฉันจะมีโชคลาภทางใดบ้างหรือไม่ ?',
  'ธุรกิจหรืองานที่ฉันทำอยู่นี้ จะเป็นหนทางหาเลี้ยงชีพที่ยั่งยืน มั่นคง หรือไม่ ?',
  'ในระยะนี้จะมีผู้ใดคิดร้ายต่อฉันหรือไม่ ?',
  'คนผู้นั้นกำลังวางแผนการ คิดหรือดำเนินการอย่างไรกับฉัน ?',
  'หญิงที่ฉันรัก เขารักฉันตอบหรือไม่ ?',
  'ชายที่ฉันรัก เขารักฉันตอบหรือไม่ ?',
];

// คำทำนาย 32 แบบสำหรับแต่ละตำแหน่ง (ตัวอย่างคำทำนาย)
const predictions = [
  'ผลที่ได้รับจะเป็นไปตามที่คาดหวัง จงมีความหวังและพยายามต่อไป',
  'ควรระมัดระวังในการตัดสินใจ มีโอกาสที่จะเกิดปัญหาได้',
  'จะได้รับข่าวดีจากคนใกล้ชิด ความสำเร็จอยู่ไม่ไกล',
  'ควรรอเวลาที่เหมาะสม ยังไม่ใช่เวลาที่ดีที่สุด',
  'จะมีการเปลี่ยนแปลงในชีวิต แต่เป็นการเปลี่ยนแปลงที่ดี',
  'ความรักจะมีความสดใส จงเปิดใจรับความสุข',
  'ควรระวังเรื่องการเงิน มีความเสี่ยงที่จะสูญเสีย',
  'จะได้รับการช่วยเหลือจากผู้ใหญ่',
  'ควรมีความอดทน ผลลัพธ์จะดีในที่สุด',
  'การเดินทางจะประสบความสำเร็จ',
  'จะมีเรื่องทะเลาะเบาะแว้ง ควรหลีกเลี่ยง',
  'ความสัมพันธ์จะแน่นแฟ้นมากขึ้น',
  'ควรระมัดระวังคำพูด อาจทำให้เสียความสัมพันธ์',
  'จะได้รับโอกาสใหม่ๆ ในชีวิต',
  'ควรตัดสินใจอย่างรอบคอบ มีทางเลือกมาก',
  'จะพบกับคนสำคัญที่จะเปลี่ยนชีวิต',
  'สิ่งที่หายจะกลับมา แต่อาจไม่ครบถ้วน',
  'การร่วมงานจะประสบผลสำเร็จ',
  'ควรลงทุนด้วยความระมัดระวัง มีความเสี่ยง',
  'คู่ครองจะซื่อสัตย์และอยู่เคียงข้างเสมอ',
  'ควรรับคนใหม่เข้ามาในชีวิตด้วยความระมัดระวัง',
  'จะมีคนมาขอยืม ควรให้ตามกำลัง',
  'การให้ยืมจะได้รับคืนในเวลาอันใกล้',
  'สามารถไว้ใจและพึ่งพาได้',
  'บุตรจะประสบความสำเร็จในอนาคต',
  'ข่าวที่ได้รับเป็นความจริง',
  'จะมีโชคลาภจากทิศทางที่ไม่คาดคิด',
  'ธุรกิจจะเจริญเติบโตอย่างต่อเนื่อง',
  'มีคนคิดร้าย แต่จะไม่สำเร็จ',
  'คนๆ นั้นกำลังคิดถึงคุณ',
  'เขารักคุณและต้องการอยู่ด้วย',
  'เขารักคุณและมองเห็นอนาคตร่วมกัน',
];

interface LineData {
  count: number;
  isEven: boolean;
}

export default function OrekurumPage() {
  const { user } = useAuth();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [step, setStep] = useState<'select' | 'draw' | 'result'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // ขีดเส้น (ไม่นับจำนวน)
  const handleDrawLine = () => {
    if (lines.length >= 5) return;
    
    // สุ่มจำนวนขีด 3-15 (แบบสุ่มจริงๆ ต้องให้ user คลิกเอง)
    // ที่นี่ใช้การคลิกเพิ่มขีด
    setLines([...lines, { count: 0, isEven: false }]);
  };

  // เพิ่มขีดในแถวปัจจุบัน
  const handleClick = () => {
    if (lines.length === 0 || isDrawing) return;
    
    const newLines = [...lines];
    newLines[newLines.length - 1].count += 1;
    setLines(newLines);
  };

  // จบการขีดแถวปัจจุบัน ไปแถวถัดไป
  const nextLine = () => {
    if (lines.length === 0 || lines[lines.length - 1].count === 0) return;
    
    if (lines.length < 5) {
      // ไปแถวถัดไป
      const newLines = [...lines];
      newLines[newLines.length - 1].isEven = newLines[newLines.length - 1].count % 2 === 0;
      setLines(newLines);
    }
  };

  // ทำนาย
  const getPrediction = () => {
    if (lines.length !== 5) return '';
    
    // คำนวณรหัสจากจำนวนขีดที่เหลือ (ไม่นับ)
    const codes = lines.map(line => {
      const even = line.count % 2 === 0;
      return even ? '00' : 'X';
    });
    
    // หาคำทำนายจากรหัส
    const codeIndex = codes.join('') === 'XXXXX' ? 0 : 
                     codes.join('') === '00000' ? 1 :
                     parseInt(codes.map(c => c === '00' ? '1' : '0').join(''), 2) % 32;
    
    if (!selectedQuestion) return '';
    
    return predictions[codeIndex % 32];
  };

  const handleStartDrawing = () => {
    if (selectedQuestion === null) return;
    setStep('draw');
    setLines([]);
    setIsDrawing(true);
    setShowWarning(true);
  };

  const handlePredict = () => {
    if (lines.length < 5) return;
    setStep('result');
    setIsDrawing(false);
  };

  const handleReset = () => {
    setSelectedQuestion(null);
    setLines([]);
    setStep('select');
    setIsDrawing(false);
    setShowWarning(false);
  };

  return (
    <>
      <Helmet>
        <title>ดูดวงโอเรกุรัม — ศาสตร์การทำนายแบบยิปซี | รุทสะกิดดาว</title>
        <meta name="description" content="ดูดวงโอเรกุรัม ศาสตร์การทำนายเก่าแก่ของชาวยิปซี ตอบคำถามได้ 32 ข้อ ครอบคลุมทุกเรื่องในชีวิต" />
      </Helmet>

      <div className="min-h-screen bg-cosmic-950 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-stardust-300 via-stardust-400 to-stardust-500 mb-4">
              โอเรกุรัม
            </h1>
            <p className="text-cosmic-200 text-lg max-w-2xl mx-auto">
              ศาสตร์การทำนายเก่าแก่ของชาวยิปซี ตอบคำถามได้ 32 ข้อ ครอบคลุมทุกแง่มุมของชีวิต
            </p>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel rounded-2xl p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-stardust-400" />
              วิธีใช้
            </h2>
            <ol className="space-y-2 text-cosmic-200">
              <li className="flex items-start gap-2">
                <span className="text-stardust-400 font-bold">1.</span>
                เลือกคำถามที่ต้องการทราบคำตอบ
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stardust-400 font-bold">2.</span>
                ตั้งจิตให้สงบ อธิษฐานถึงสิ่งศักดิ์สิทธิ์
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stardust-400 font-bold">3.</span>
                คลิกขีดเส้น 5 แถว โดยไม่นับจำนวน (แถวละกี่ขีดก็ได้)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stardust-400 font-bold">4.</span>
                คลิก "ทำนาย" เพื่อดูคำตอบ
              </li>
            </ol>
            
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-200 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ห้ามถามคำถามเดิมซ้ำในช่วง 7 วัน เพราะอาจกำหนดชีวิตได้
              </p>
            </div>
          </motion.div>

          {/* Step 1: Select Question */}
          <AnimatePresence>
            {step === 'select' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">เลือกคำถาม</h2>
                <div className="grid gap-3">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQuestion(idx)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedQuestion === idx
                          ? 'bg-purple-600 border-2 border-purple-400'
                          : 'bg-cosmic-900/50 hover:bg-cosmic-800/50 border-2 border-cosmic-800 hover:border-cosmic-700'
                      }`}
                    >
                      <span className="text-stardust-400 font-medium mr-2">{idx + 1}.</span>
                      <span className="text-white">{q}</span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleStartDrawing}
                  disabled={selectedQuestion === null}
                  className="w-full py-4 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ถัดไป: ขีดเส้นทำนาย
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: Draw Lines */}
          <AnimatePresence>
            {step === 'draw' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="glass-panel rounded-xl p-4">
                  <p className="text-stardust-300 font-medium mb-2">คำถามของคุณ:</p>
                  <p className="text-white text-lg">
                    {selectedQuestion !== null ? questions[selectedQuestion] : ''}
                  </p>
                </div>

                {showWarning && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      💡 ขณะขีดเส้น ห้ามนับจำนวนขีด ขีดไปเรื่อยๆ จนพอใจแล้วค่อยไปแถวถัดไป
                    </p>
                  </div>
                )}

                {/* Drawing Area */}
                <div className="flex flex-col items-center gap-4">
                  {/* 5 rows */}
                  {[0, 1, 2, 3, 4].map((rowIdx) => (
                    <div key={rowIdx} className="w-full max-w-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cosmic-300 text-sm">แถวที่ {rowIdx + 1}</span>
                        {lines[rowIdx] && (
                          <span className={`text-sm ${lines[rowIdx].isEven ? 'text-green-400' : 'text-orange-400'}`}>
                            {lines[rowIdx].isEven ? '00' : 'X'}
                          </span>
                        )}
                      </div>
                      <div 
                        className="bg-cosmic-900/80 rounded-lg p-4 min-h-[60px] cursor-pointer hover:bg-cosmic-800/80 transition-colors border border-cosmic-700"
                        onClick={() => {
                          if (rowIdx === lines.length - 1) {
                            handleClick();
                          }
                        }}
                      >
                        {lines[rowIdx] && (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({ length: lines[rowIdx].count }).map((_, i) => (
                              <span key={i} className="text-2xl text-white">|</span>
                            ))}
                          </div>
                        )}
                        {lines[rowIdx]?.count === 0 && rowIdx < lines.length && (
                          <p className="text-cosmic-500 text-center">คลิกเพื่อขีด</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Controls */}
                  <div className="flex gap-4 mt-4">
                    {lines.length < 5 && (
                      <button
                        onClick={() => {
                          if (lines[lines.length - 1]?.count > 0) {
                            nextLine();
                          }
                        }}
                        disabled={lines.length === 0 || lines[lines.length - 1]?.count === 0}
                        className="px-6 py-3 bg-cosmic-700 text-white rounded-lg hover:bg-cosmic-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        แถวถัดไป
                      </button>
                    )}
                    
                    {lines.length === 5 && lines[4]?.count > 0 && (
                      <button
                        onClick={handlePredict}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700"
                      >
                        ทำนาย
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Result */}
          <AnimatePresence>
            {step === 'result' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="glass-panel rounded-2xl p-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  
                  <h3 className="text-xl font-semibold text-white mb-2">คำถามของคุณ:</h3>
                  <p className="text-cosmic-200 mb-6">
                    {selectedQuestion !== null ? questions[selectedQuestion] : ''}
                  </p>
                  
                  <div className="bg-purple-900/30 rounded-xl p-6 mb-6">
                    <h4 className="text-lg font-semibold text-stardust-300 mb-3">คำทำนาย:</h4>
                    <p className="text-white text-lg whitespace-pre-line">{getPrediction()}</p>
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-700 text-white rounded-lg hover:bg-cosmic-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                    ทำใหม่
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}