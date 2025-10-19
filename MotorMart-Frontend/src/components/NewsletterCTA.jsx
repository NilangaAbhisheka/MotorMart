export default function NewsletterCTA() {
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl bg-secondary text-secondary-foreground p-8">
          <div className="grid grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-lg font-semibold">Get the news by subscribing to our newsletter. Tips directly!</div>
              <div className="mt-3 flex gap-2">
                <input placeholder="Your e-mail" className="input bg-white" />
                <button className="px-4 py-2 rounded-md bg-slate-900 text-white">Submit</button>
              </div>
            </div>
            <img src="assets/1.jpg" alt="Car" className="w-full h-48 object-cover rounded-lg shadow" />
          </div>
        </div>
      </div>
    </section>
  )
}


