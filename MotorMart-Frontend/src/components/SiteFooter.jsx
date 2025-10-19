export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="font-semibold mb-2">AutoBid</div>
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
          <div className="font-semibold mb-2">AutoBid</div>
          <ul className="space-y-1 text-white/70 text-sm">
            <li>About</li>
            <li>Contact</li>
            <li>Terms</li>
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


