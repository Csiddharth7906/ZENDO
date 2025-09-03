import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckIcon,
  StarIcon,
  PlayIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Zendo</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
                <span className="text-sm font-medium">Made For</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer">
                <span className="text-sm font-medium">Resources</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <Link to="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Pricing
              </Link>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Start for free
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="space-y-4">
                <div className="text-gray-700 font-medium">Made For</div>
                <div className="text-gray-700 font-medium">Resources</div>
                <Link to="/pricing" className="block text-gray-700 font-medium">
                  Pricing
                </Link>
                <Link to="/login" className="block text-gray-700 font-medium">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
                >
                  Start for free
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Clarity, finally.
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Join 50+ million professionals who simplify work and life with the world's #1 to-do list app.
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">314K+ ★★★★★ reviews</span>
              </div>

              {/* CTA Button */}
              <div>
                <Link
                  to="/register"
                  className="inline-block bg-red-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Start for free
                </Link>
              </div>
            </div>

            {/* Right Content - App Screenshots */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main App Screenshot */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Today</h3>
                        <span className="text-sm text-gray-500">My Projects</span>
                      </div>
                      
                      {/* Sample Tasks */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="text-gray-900">Review Q4 budget</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="text-gray-900">Call marketing team</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="text-gray-900">Finalize presentation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-green-500 border-2 border-green-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-500 line-through">Morning workout</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="text-gray-900">Plan weekend trip</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile App Preview */}
                <div className="absolute -bottom-4 -right-4 w-32 h-56 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-red-500 h-2 w-full"></div>
                  <div className="p-3 space-y-2">
                    <div className="text-xs font-semibold text-gray-900">Tasks</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                        <div className="text-xs text-gray-700">Buy groceries</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                        <div className="text-xs text-gray-700">Team meeting</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 border border-green-500 rounded-full"></div>
                        <div className="text-xs text-gray-500 line-through">Exercise</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Decorations */}
              <div className="absolute top-8 -left-8 w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-8 left-12 w-12 h-12 bg-blue-200 rounded-full opacity-60"></div>
              <div className="absolute top-16 -right-12 w-8 h-8 bg-pink-200 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="text-center">
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Simple, straightforward, and super powerful"
                </blockquote>
                <div className="flex justify-center">
                  <div className="bg-gray-300 rounded-full px-4 py-1">
                    <span className="text-sm font-medium text-gray-700">THE VERGE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="text-center">
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "The best to-do list app on the market"
                </blockquote>
                <div className="flex justify-center">
                  <div className="bg-gray-300 rounded-full px-4 py-1">
                    <span className="text-sm font-medium text-gray-700">PC MAG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="text-center">
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-current" />
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Nothing short of stellar"
                </blockquote>
                <div className="flex justify-center">
                  <div className="bg-gray-300 rounded-full px-4 py-1">
                    <span className="text-sm font-medium text-gray-700">TECHRADAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Zendo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
