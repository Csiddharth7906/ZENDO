import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, StarIcon, CodeBracketIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const About = () => {
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
              <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
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
            About the Developer
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Meet Siddharth Chauhan, the creator behind Zendo
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">SC</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Siddharth Chauhan</h2>
                <p className="text-gray-600 mb-4">Full-stack Developer & Student</p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://github.com/Csiddharth7906" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com/in/siddharth-chauhan0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About Me</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  I'm Siddharth Chauhan, a passionate Full-stack Developer and Computer Science student with a strong focus on the MERN stack. 
                  Currently working as a Full-stack Intern at ModelSuite.ai, I'm dedicated to building innovative web applications and solving complex problems through code.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  My journey in tech spans across multiple domains including web development, data structures & algorithms, and emerging technologies like Web3 and Blockchain. 
                  I believe in continuous learning and applying knowledge to create meaningful projects that solve real-world problems.
                </p>
              </div>

              {/* Experience & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BriefcaseIcon className="w-5 h-5 mr-2 text-red-500" />
                    Experience
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Full-stack Intern at ModelSuite.ai</li>
                    <li>• Multiple real-world projects deployed</li>
                    <li>• Focus on MERN stack development</li>
                    <li>• DSA problem solving in Java</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <AcademicCapIcon className="w-5 h-5 mr-2 text-red-500" />
                    Certifications
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• React + Redux Certification</li>
                    <li>• Java Programming</li>
                    <li>• SQL Database Management</li>
                    <li>• Linux System Administration</li>
                    <li>• Python for Data Science</li>
                  </ul>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CodeBracketIcon className="w-5 h-5 mr-2 text-red-500" />
                  Notable Projects
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">DevMatch</h5>
                    <p className="text-sm text-gray-600">Developer matching platform</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">MVXC Movie App</h5>
                    <p className="text-sm text-gray-600">Movie discovery application</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">Simon Says Game</h5>
                    <p className="text-sm text-gray-600">Interactive memory game</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">Portfolio Website</h5>
                    <p className="text-sm text-gray-600">Personal showcase site</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2 text-red-500" />
                  Achievements
                </h4>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    5★ in C++
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    5★ in SQL
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    MERN Stack Expert
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Web3 Enthusiast
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Organized?</h3>
          <p className="text-gray-600 mb-8">Try Zendo and experience productivity like never before.</p>
          <Link
            to="/register"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
