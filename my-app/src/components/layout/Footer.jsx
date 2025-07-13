import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">Tikone Cricket</span>
                <span className="text-sm text-muted-foreground font-medium">Academy</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional cricket coaching with state-of-the-art facilities in Pimpri. 
              Join hundreds of students who have transformed their game with our expert coaching.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"></div>
            </div>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/login" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>Admin Portal</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/student/login" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>Student Portal</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/student/register" 
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-all duration-200 group"
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <span>Register</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Our Services</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"></div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Batting Training</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Bowling Practice</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fielding Skills</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Match Practice</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fitness Training</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mental Conditioning</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cricket Ground, Sports Complex<br />
                    Pimpri, Maharashtra 411018
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    +91 98765 43210<br />
                    +91 98765 43211
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">
                    info@tikonecricket.com<br />
                    support@tikonecricket.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Timings</p>
                  <p className="text-sm text-muted-foreground">
                    Mon - Sat: 6:00 AM - 9:00 PM<br />
                    Sunday: 7:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">
                © 2024 Tikone Cricket Academy. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live Status: Academy Open</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 