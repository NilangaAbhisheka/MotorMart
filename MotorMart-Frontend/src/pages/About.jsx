export default function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">About MotorMart</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Your trusted partner in automotive auctions, connecting buyers and sellers through innovative technology and transparent processes.
        </p>
      </div>

      {/* Mission Section */}
      <section className="py-12 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                At MotorMart, we're revolutionizing the automotive auction industry by providing a seamless, 
                transparent, and secure platform for buying and selling vehicles. Our mission is to make 
                automotive auctions accessible to everyone while maintaining the highest standards of trust and quality.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                We believe that every vehicle has a story, and every buyer deserves a fair, honest, 
                and exciting auction experience. That's why we've built MotorMart with cutting-edge 
                technology and a commitment to excellence.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Our Mission" 
                className="w-full h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
          <p className="text-lg text-slate-600">The principles that guide everything we do</p>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Transparency</h3>
            <p className="text-slate-600">
              Complete visibility into vehicle history, auction processes, and pricing ensures you make informed decisions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Security</h3>
            <p className="text-slate-600">
              Advanced encryption and secure payment processing protect your transactions and personal information.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Innovation</h3>
            <p className="text-slate-600">
              Cutting-edge technology and user-friendly interfaces make automotive auctions accessible and exciting.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-gray-50 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-slate-600">The passionate professionals behind MotorMart</p>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">JD</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">John Doe</h3>
            <p className="text-primary font-medium mb-2">CEO & Founder</p>
            <p className="text-sm text-slate-600">
              Automotive industry veteran with 15+ years of experience in auction management and technology innovation.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">SM</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sarah Miller</h3>
            <p className="text-primary font-medium mb-2">CTO</p>
            <p className="text-sm text-slate-600">
              Technology leader specializing in scalable platforms and user experience design for automotive applications.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">MJ</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Mike Johnson</h3>
            <p className="text-primary font-medium mb-2">Head of Operations</p>
            <p className="text-sm text-slate-600">
              Operations expert ensuring smooth auction processes and exceptional customer service experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">MotorMart by the Numbers</h2>
          <p className="text-lg text-slate-600">Our impact in the automotive auction industry</p>
        </div>
        
        <div className="grid grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">40K+</div>
            <div className="text-slate-600">Registered Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">150M+</div>
            <div className="text-slate-600">Inventory Value</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-slate-600">Secure Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">6K+</div>
            <div className="text-slate-600">Verified Sellers</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary text-white rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied customers who trust MotorMart for their automotive auction needs.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="btn bg-white text-primary hover:bg-gray-100">
            Create Account
          </a>
          <a href="/contact" className="btn border border-white text-white hover:bg-white hover:text-primary">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
