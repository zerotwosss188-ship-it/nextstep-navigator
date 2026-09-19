import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const TEAM = [
  { name: 'Farhan Khan', role: 'Founder & Lead Developer', email: 'farhan@nextstep.dev', color: 'from-saffron to-saffron-dark' },
  { name: 'Asber Ali', role: 'Design Lead', email: 'asber@nextstep.dev', color: 'from-teal to-teal-dark' },
  { name: 'Bilal Ahmed', role: 'Frontend Engineer', email: 'bilal@nextstep.dev', color: 'from-navy to-navy-light' },
  { name: 'Ayesha Siddiqui', role: 'Content Strategist', email: 'ayesha@nextstep.dev', color: 'from-saffron to-teal' },
]

export default function Contact() {
  const [location, setLocation] = useState('Karachi, Pakistan')

  useEffect(() => {
    // Optional: replace with geolocation if you want dynamic
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-saffron font-semibold tracking-widest uppercase text-xs mb-2">
          Get in Touch
        </p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
          Contact Us
        </h1>
        <p className="text-navy/60 max-w-2xl mx-auto">
          Questions, collaborations, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: Mail, label: 'Email', value: 'hello@nextstep.dev', href: 'mailto:hello@nextstep.dev' },
          { icon: Phone, label: 'Phone', value: '+92 300 1234567', href: 'tel:+923001234567' },
          { icon: Clock, label: 'Response Time', value: 'Within 24 hours' },
        ].map((c, i) => {
          const Icon = c.icon
          const Wrapper = c.href ? 'a' : 'div'
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Wrapper
                {...(c.href ? { href: c.href } : {})}
                className="block bg-white rounded-2xl border border-navy/5 shadow-sm p-6 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-saffron" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy/50 mb-1">
                  {c.label}
                </p>
                <p className="font-heading font-bold text-navy">{c.value}</p>
              </Wrapper>
            </motion.div>
          )
        })}
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-navy mb-6">Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="bg-white rounded-2xl border border-navy/5 shadow-sm p-6 text-center hover:shadow-lg transition-all"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-heading font-bold text-2xl mx-auto mb-4`}
              >
                {m.name.charAt(0)}
              </div>
              <h3 className="font-heading font-bold text-navy">{m.name}</h3>
              <p className="text-xs text-navy/60 mb-3">{m.role}</p>
              <a
                href={`mailto:${m.email}`}
                className="text-xs text-saffron hover:underline break-all"
              >
                {m.email}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Location + Map */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm p-8">
          <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
            <MapPin size={22} className="text-teal" />
          </div>
          <h2 className="font-heading font-bold text-xl text-navy mb-3">Our Office</h2>
          <p className="text-navy/70 leading-relaxed mb-6">
            NextStep Navigator<br />
            4th Floor, Innovation Hub<br />
            I.I. Chundrigar Road, Karachi<br />
            Sindh 74000, Pakistan
          </p>

          <p className="text-xs font-bold uppercase tracking-widest text-navy/50 mb-3">
            Follow Us
          </p>
          <div className="flex gap-3">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-navy/5 hover:bg-saffron hover:text-white text-navy/60 flex items-center justify-center transition-all"
              aria-label="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-navy/5 hover:bg-saffron hover:text-white text-navy/60 flex items-center justify-center transition-all"
              aria-label="Twitter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-navy/5 hover:bg-saffron hover:text-white text-navy/60 flex items-center justify-center transition-all"
              aria-label="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-navy/5 shadow-sm overflow-hidden min-h-[340px]">
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.428!2d67.0099!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjUiTiA2N8KwMDAnMzYuMCJF!5e0!3m2!1sen!2s!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 340 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}