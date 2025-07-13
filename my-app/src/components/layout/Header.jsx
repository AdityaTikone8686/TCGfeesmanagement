import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Trophy, Menu, X, LogOut, User, Home, Shield, GraduationCap, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const isHomePage = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Tikone Cricket
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                    isHomePage ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                <div className="flex items-center space-x-3">
                  <Link to="/admin/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Portal</span>
                    </Button>
                  </Link>
                  <Link to="/student/login">
                    <Button 
                      size="sm" 
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Student Portal</span>
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'Student'}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                        Account Actions
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4 pt-4">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/" 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-muted/50 ${
                      isHomePage ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  
                  <div className="px-4 space-y-3">
                    <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin Portal</span>
                      </Button>
                    </Link>
                    <Link to="/student/login" onClick={() => setIsMenuOpen(false)}>
                      <Button 
                        size="sm" 
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span>Student Portal</span>
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-4 px-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {user?.name || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isAdmin ? 'Administrator' : 'Student'}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center space-x-2 hover:bg-red-50 hover:border-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
} 