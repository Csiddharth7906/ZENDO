import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  ClockIcon, 
  StarIcon, 
  DevicePhoneMobileIcon,
  CloudIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: CheckIcon,
      title: "Smart Task Management",
      description: "Create, organize, and prioritize tasks with our intuitive interface. Set due dates, add descriptions, and track progress effortlessly.",
      color: "bg-green-500"
    },
    {
      icon: ClockIcon,
      title: "Time Tracking",
      description: "Built-in time tracking helps you understand how long tasks take and improve your productivity over time.",
      color: "bg-blue-500"
    },
    {
      icon: StarIcon,
      title: "Priority System",
      description: "Mark tasks as high, medium, or low priority to focus on what matters most and never miss important deadlines.",
      color: "bg-yellow-500"
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Cross-Platform Sync",
      description: "Access your tasks anywhere, anytime. Seamless synchronization across all your devices keeps you organized on the go.",
      color: "bg-purple-500"
    },
    {
      icon: CloudIcon,
      title: "Cloud Storage",
      description: "Your data is safely stored in the cloud with automatic backups. Never lose your important tasks and projects again.",
      color: "bg-indigo-500"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We respect your privacy and never share your personal information.",
      color: "bg-red-500"
    },
    {
      icon: BoltIcon,
      title: "Fast Performance",
      description: "Lightning-fast performance ensures smooth user experience. No lag, no delays - just pure productivity.",
      color: "bg-orange-500"
    },
    {
      icon: ChartBarIcon,
      title: "Progress Analytics",
      description: "Track your productivity with detailed analytics. See your completion rates, streaks, and improvement over time.",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Zendo</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/login" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to stay organized and boost your productivity
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Zendo Works</h2>
            <p className="text-lg text-gray-600">Get organized in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Tasks</h3>
              <p className="text-gray-600">Add your tasks with descriptions, due dates, and priority levels</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Organize & Prioritize</h3>
              <p className="text-gray-600">Sort tasks by priority, category, or due date to stay focused</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete & Track</h3>
              <p className="text-gray-600">Mark tasks as complete and track your productivity progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Zendo?</h2>
            <p className="text-lg text-gray-600">Built by developers, for everyone who wants to get things done</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Technology Stack</h3>
                  <p className="text-gray-600">Built with React, Node.js, and MongoDB for reliability and performance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User-Centric Design</h3>
                  <p className="text-gray-600">Clean, intuitive interface designed for maximum productivity</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Updates</h3>
                  <p className="text-gray-600">Regular updates with new features based on user feedback</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Free to Use</h3>
                  <p className="text-gray-600">Core features are completely free with optional premium upgrades</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to boost your productivity?</h3>
              <p className="text-red-100 mb-6">Join thousands of users who have transformed their workflow with Zendo</p>
              <Link
                to="/register"
                className="inline-block bg-white text-red-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
