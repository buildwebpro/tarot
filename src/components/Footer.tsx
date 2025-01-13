export function Footer() {
  return (
    <footer className="border-t border-purple-500/30 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">เกี่ยวกับเรา</h3>
            <p className="text-purple-200">
              รุทสะกิดดาว โหราศาสตร์ออนไลน์  ให้บริการดูดวงออนไลน์ด้วยไพ่ทาโรต์และดูดวงรายวันตามราศี และทำนายดวงชะตาแบบส่วนตัว ด้วยโหราศาสตร์ยูเรเนียน
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">บริการของเรา</h3>
            <ul className="space-y-2 text-purple-200">
              <li>ดูดวงด้วยไพ่ทาโรต์</li>
              <li>ดูดวงรายวันตามราศี</li>
              <li>ทำนายดวงชะตา</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-purple-200">
              <li>Email: rujskiddao@gmail.com</li>
              <li>Line: 0942511969</li>
              <li>Facebook: รุท สะกิดดาว</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-purple-300 text-sm mt-8">
          © {new Date().getFullYear()} รุทสะกิดดาว. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 