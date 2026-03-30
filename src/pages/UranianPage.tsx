import { Helmet } from 'react-helmet-async';
import { UranianForm } from '../components/UranianForm';
import { Sparkles } from 'lucide-react';

export default function UranianPage() {
  return (
    <>
      <Helmet>
        <title>โหราศาสตร์ยูเรเนียน - ทำนายดวงชะตาแม่นยำ | รุทสะกิดดาว</title>
        <meta name="description" content="ทำนายดวงชะตาด้วยระบบโหราศาสตร์ยูเรเนียนโดยผู้เชี่ยวชาญ ใส่วันเกิด เวลาเกิด สถานที่เกิด เพื่อรับคำทำนายที่แม่นยำ" />
      </Helmet>

      <section className="py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-full mb-6">
            <span className="text-4xl text-amber-400">♆</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">โหราศาสตร์ยูเรเนียน</h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            ทำนายดวงชะตาด้วยระบบโหราศาสตร์ยูเรเนียนที่มีความแม่นยำสูง
            โดยใช้จุดเจ้าชะตาและดาวทิพย์ 8 ดวง
          </p>
        </header>
        
        <UranianForm />

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🌟</div>
            <h3 className="font-bold mb-2">จุดเจ้าชะตา</h3>
            <p className="text-purple-300 text-sm">
              วิเคราะห์จุดสำคัญ 6 จุด: อาทิตย์ จันทร์ เมอริเดียน ลัคนา ราหู เมษ
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🪐</div>
            <h3 className="font-bold mb-2">ดาวทิพย์ 8 ดวง</h3>
            <p className="text-purple-300 text-sm">
              คิวปิโด ฮาเดส เซอุส โครโนส อพอลลอน แอดเมตอส วุลคานุส โพไซดอน
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="font-bold mb-2">มุมดวงสำคัญ</h3>
            <p className="text-purple-300 text-sm">
              วิเคราะห์มุม 0° 60° 90° 120° 180° และเรือนชะตาทั้ง 12 เรือน
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
