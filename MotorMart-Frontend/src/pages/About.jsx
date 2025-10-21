export default function About() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-semibold text-sm mb-6">
            <span>About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About MotorMart</h1>
          <div className="flex justify-center mb-6">
            <span className="h-1 w-24 bg-white/60 rounded-full"></span>
          </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in automotive auctions, connecting buyers and sellers through innovative technology and transparent processes.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-4">
                <span>Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Revolutionizing Automotive Auctions</h2>
              <div className="flex mb-4">
                <span className="h-1 w-16 bg-gradient-primary rounded-full"></span>
              </div>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6">
                At MotorMart, we're revolutionizing the automotive auction industry by providing a seamless, 
                transparent, and secure platform for buying and selling vehicles. Our mission is to make 
                automotive auctions accessible to everyone while maintaining the highest standards of trust and quality.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We believe that every vehicle has a story, and every buyer deserves a fair, honest, 
                and exciting auction experience. That's why we've built MotorMart with cutting-edge 
                technology and a commitment to excellence.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur opacity-20"></div>
              <img 
                src="assets/5.png" 
                alt="Our Mission" 
                className="relative w-full h-96 object-cover rounded-2xl shadow-large"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-4">
              <span>Core Values</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Core Values</h2>
            <div className="flex justify-center mb-6">
              <span className="h-1 w-20 bg-gradient-primary rounded-full"></span>
            </div>
            <p className="text-lg text-neutral-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Transparency</h3>
              <p className="text-neutral-600 leading-relaxed">
                Complete visibility into vehicle history, auction processes, and pricing ensures you make informed decisions.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Security</h3>
              <p className="text-neutral-600 leading-relaxed">
                Advanced encryption and secure payment processing protect your transactions and personal information.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Innovation</h3>
              <p className="text-neutral-600 leading-relaxed">
                Cutting-edge technology and user-friendly interfaces make automotive auctions accessible and exciting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-4">
              <span>Our Team</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
            <div className="flex justify-center mb-6">
              <span className="h-1 w-20 bg-gradient-primary rounded-full"></span>
            </div>
            <p className="text-lg text-neutral-600">The passionate professionals behind MotorMart</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-soft border border-blue-100 hover:shadow-medium transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">John Doe</h3>
              <p className="text-blue-600 font-semibold mb-4">CEO & Founder</p>
              <p className="text-neutral-600 leading-relaxed">
                Automotive industry veteran with 15+ years of experience in auction management and technology innovation.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-soft border border-blue-100 hover:shadow-medium transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft">
                <span className="text-2xl font-bold text-white">SM</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Sarah Miller</h3>
              <p className="text-blue-600 font-semibold mb-4">CTO</p>
              <p className="text-neutral-600 leading-relaxed">
                Technology leader specializing in scalable platforms and user experience design for automotive applications.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-soft border border-blue-100 hover:shadow-medium transition-all duration-300">
              <div className="w-24 h-24 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft">
                <span className="text-2xl font-bold text-white">MJ</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Mike Johnson</h3>
              <p className="text-blue-600 font-semibold mb-4">Head of Operations</p>
              <p className="text-neutral-600 leading-relaxed">
                Operations expert ensuring smooth auction processes and exceptional customer service experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs mb-4">
              <span>By the Numbers</span>
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">MotorMart by the Numbers</h2>
            <div className="flex justify-center mb-6">
              <span className="h-1 w-20 bg-gradient-primary rounded-full"></span>
            </div>
            <p className="text-lg text-neutral-600">Our impact in the automotive auction industry</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="text-5xl font-bold text-blue-600 mb-3">40K+</div>
              <div className="text-neutral-600 font-medium">Registered Users</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="text-5xl font-bold text-blue-600 mb-3">150M+</div>
              <div className="text-neutral-600 font-medium">Inventory Value</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="text-5xl font-bold text-blue-600 mb-3">100%</div>
              <div className="text-neutral-600 font-medium">Secure Transactions</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-soft border border-neutral-100 hover:shadow-medium transition-all duration-300">
              <div className="text-5xl font-bold text-blue-600 mb-3">6K+</div>
              <div className="text-neutral-600 font-medium">Verified Sellers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers who trust MotorMart for their automotive auction needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-soft hover:bg-slate-100 transition-colors">
              Create Account
            </a>
            <a href="/contact" className="px-8 py-4 border border-white/70 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
