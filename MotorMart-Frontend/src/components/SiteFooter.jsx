export default function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-4 gap-6">
        <div>
          <div className="font-semibold mb-2">MotorMart</div>
          <div className="text-sm text-white/70">Customer support</div>
        </div>
        <div>
          <div className="font-semibold mb-2">Latest Cars</div>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>Mercedes</li>
            <li>BMW</li>
            <li>Audi</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-white/70 text-sm">
            <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            <li><a href="/shop" className="hover:text-white transition-colors">Shop</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Useful Information</div>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>Help Center</li>
            <li>Privacy</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/60">© 2025 MotorMart. All rights reserved.</div>
      </div>
    </footer>
  )
}


