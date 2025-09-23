import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white">
              <img
        src="/TikoneCricketGurukul1.png" // Replace with your actual filename
        alt="Logo"
        className="w-full h-full object-contain"
      />
      
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">Tikone Cricket Gurukul</span>
               
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Professional cricket coaching with state-of-the-art facilities. 
              Join hundreds of students who have transformed their game with our expert coaching.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href="" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/officialtikonecricketgurukul/" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
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
                  Boat Club, near Kazu Devi Temple, Sector No. 33, Thergaon, Pune,<br />
                  Pimpri-Chinchwad, Maharashtra 411033
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
                    +91 9881332092<br />
                    +91 9881998200
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
                   tikonecricketgurukul@gmail.com<br />
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
                    Mon - Sat: 4:00 PM - 7:00 PM<br />
                    Sunday - 7:30 AM - 9:30 AM 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-10 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-3 md:space-x-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 Tikone Cricket Gurukul | All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Privacy Policy</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Terms of Service</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">Cookie Policy</a>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2 text-center md:text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-muted-foreground">
                Developed by{' '}
                <a
                  href="https://www.linkedin.com/in/hariom0"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:text-foreground underline underline-offset-2"
                >
                  Hariom Singh
                </a>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 