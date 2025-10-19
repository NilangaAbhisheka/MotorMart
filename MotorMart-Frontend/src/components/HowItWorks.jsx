export default function HowItWorks() {
  const steps = [
    { title: 'Registration and Account', text: 'Create your account and verify your details.' },
    { title: 'Browse and Select a Vehicle', text: 'Filter and compare vehicles that fit your needs.' },
    { title: 'Place Bids and Monitor', text: 'Bid confidently and track auctions in real time.' },
  ]
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mb-3">{i+1}</div>
              <div className="font-semibold mb-1">{s.title}</div>
              <div className="text-sm text-muted">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


