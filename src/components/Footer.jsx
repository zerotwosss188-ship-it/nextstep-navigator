import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Users, Clock as ClockIcon, Heart, Mail } from 'lucide-react'
import Clock from './Clock'
import VisitorCounter from './VisitorCounter'

export default function Footer() {
  const [location, setLocation] = useState('Detecting...')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Unavailable')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          const city = data.city || data.locality || data.principalSubdivision
          const country = data.countryName
          setLocation(city ? `${city}, ${country}` : 'Unknown')
        } catch {
          setLocation('Unknown')
        }
      },
      () => setLocation('Permission denied'),
      { timeout: 5000 }
    )
  }, [])

  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-heading font-bold inline-block mb-4">
              NextStep <span className="text-saffron">Navigator</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
              Your guide to the future. Free, structured, and judgement-free
              career exploration for every learner.
            </p>
                        <div className="flex gap-3">
              {/* Email */}
              <a
                href="mailto:hello@nextstep.dev"
                aria-label="Email"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-saffron transition-colors flex items-center justify-center"
              >
                <Mail size={16} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-saffron transition-colors flex items-center justify-center"
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
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-saffron transition-colors flex items-center justify-center"
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
                aria-label="GitHub"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-saffron transition-colors flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-4">
              Explore
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/career-bank" className="hover:text-saffron transition">Career Bank</Link></li>
              <li><Link to="/quiz" className="hover:text-saffron transition">Interest Quiz</Link></li>
              <li><Link to="/success-stories" className="hover:text-saffron transition">Success Stories</Link></li>
              <li><Link to="/resources" className="hover:text-saffron transition">Resource Library</Link></li>
              <li><Link to="/admission" className="hover:text-saffron transition">Admission & Coaching</Link></li>
            </ul>
          </div>

          {/* Live */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-4">
              Live
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <ClockIcon size={14} className="text-teal shrink-0" />
                <Clock className="text-white" />
              </li>
              <li className="flex items-center gap-2">
                <Users size={14} className="text-teal shrink-0" />
                <span><VisitorCounter /> visitors</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-teal shrink-0" />
                <span className="truncate">{location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
          <p className="flex items-center gap-1.5">
            © 2026 NextStep Navigator. Built with
            <Heart size={11} className="text-saffron fill-saffron" />
            for students everywhere.
          </p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-saffron transition">About</Link>
            <Link to="/contact" className="hover:text-saffron transition">Contact</Link>
            <Link to="/feedback" className="hover:text-saffron transition">Feedback</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}