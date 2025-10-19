import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', form)
    alert('Thank you for your message! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Have questions about our auctions? Need help with your account? We're here to help you every step of the way.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <select
                className="input w-full"
                value={form.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="auction">Auction Information</option>
                <option value="seller">Seller Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea
                className="input w-full h-32 resize-none"
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Tell us how we can help you..."
                required
              />
            </div>
            
            <button type="submit" className="btn w-full">
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
            <p className="text-slate-600 mb-6">
              We're committed to providing excellent customer service. Reach out to us through any of the channels below, 
              and we'll respond as quickly as possible.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email Support</h3>
                <p className="text-slate-600">support@motormart.com</p>
                <p className="text-sm text-slate-500">We typically respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Phone Support</h3>
                <p className="text-slate-600">+94 71 234 5678</p>
                <p className="text-sm text-slate-500">Mon-Fri 9AM-6PM EST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Office Address</h3>
                <p className="text-slate-600">123 Auto Auction Drive</p>
                <p className="text-slate-600">Colombo</p>
                <p className="text-sm text-slate-500">Sri Lanka</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Live Chat</h3>
                <p className="text-slate-600">Available 24/7</p>
                <p className="text-sm text-slate-500">Instant support for urgent matters</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="pt-8 border-t">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900">How do I place a bid?</h4>
                <p className="text-sm text-slate-600">Simply create an account, browse our vehicles, and click "Place Bid" on any active auction.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">What payment methods do you accept?</h4>
                <p className="text-sm text-slate-600">We accept all major credit cards, bank transfers, and certified checks.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-900">How do I become a seller?</h4>
                <p className="text-sm text-slate-600">Register as a seller, verify your identity, and start listing your vehicles for auction.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-12 bg-gray-50 rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Visit Our Office</h2>
          <p className="text-slate-600">Come see us in person for a personalized experience</p>
        </div>
        
        <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80"
            alt="Office Location"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="text-center relative z-10">
            <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-neutral-700 font-medium">Interactive Map Coming Soon</p>
            <p className="text-sm text-neutral-600">123 Auto Auction Drive, Colombo, Sri Lanka</p>
          </div>
        </div>
      </div>
    </div>
  )
}
