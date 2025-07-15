import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Trophy, Users, Target, Award, ArrowRight, Star, Clock, CheckCircle, Play, Shield, GraduationCap, Zap, Heart, TrendingUp } from 'lucide-react'
import Layout from '../components/layout/Layout'

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-muted/20 to-muted/10 section-padding overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge variant="success" className="mb-6 inline-flex items-center space-x-2 px-4 py-2 text-sm">
                  <Star className="h-4 w-4" />
                  <span>Thergoan's Premier Cricket Academy</span>
                </Badge>
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
                  Welcome to
                  <span className="text-primary block bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent"> Tikone Cricket Gurukul</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Elevate your cricket journey at Tikone Cricket Gurukul, Thergoan. World-class coaching, modern facilities, and a legacy of producing champions. Join us and become the next cricket star!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/student/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto group hover:bg-green-50 hover:border-green-200 transition-all duration-200">
                    <Users className="mr-2 h-5 w-5" />
                    Student Login
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto group hover:bg-blue-50 hover:border-blue-200 transition-all duration-200">
                    <Shield className="mr-2 h-5 w-5" />
                    Admin Portal
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span>300+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <span>35+ Champions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1205&q=80"
                  alt="Tikone Cricket Academy, Pimpri"
                  className="rounded-2xl shadow-2xl w-full h-auto hover:shadow-3xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-card p-6 rounded-xl shadow-soft border border-border animate-scale-in">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Watch Training</p>
                    <p className="text-xs text-muted-foreground">See our facilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-6">
              Why Choose Tikone Cricket Gurukul?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We provide comprehensive cricket training with modern facilities and expert coaching to help you excel in your cricket journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Expert Coaches</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn from certified professionals with years of experience and a passion for cricket.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Modern Facilities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  State-of-the-art equipment, well-maintained grounds, and professional training facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Proven Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track record of students excelling in competitions and reaching professional levels.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Flexible Plans</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Various training packages to suit your needs, schedule, and budget requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              Our Programs
            </Badge>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-6">
              Our Training Programs
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive programs designed for all skill levels, from beginners to advanced players.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Beginner Program</h3>
                  <Badge variant="info" className="px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Perfect for those starting their cricket journey. Learn basic techniques and fundamentals.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Basic batting techniques</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Bowling fundamentals</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Fielding basics</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹2,999/month</span>
                    <p className="text-xs text-muted-foreground">Basic Training</p>
                  </div>
                  <Button size="sm" className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="success" className="px-4 py-1">
                  <Heart className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Intermediate Program</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced techniques and match practice for players with basic cricket knowledge.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Advanced batting skills</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Specialized bowling</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Match strategies</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹4,999/month</span>
                    <p className="text-xs text-muted-foreground">Advanced Training</p>
                  </div>
                  <Button size="sm" className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 group">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Advanced Program</h3>
                  <Badge variant="warning" className="px-3 py-1">
                    <Trophy className="h-3 w-3 mr-1" />
                    Elite
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Professional-level training for serious players aiming for competitive cricket.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Professional coaching</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Competition preparation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-muted-foreground">Performance analysis</span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-6">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹6,999/month</span>
                    <p className="text-xs text-muted-foreground">Elite Training</p>
                  </div>
                  <Button size="sm" className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-white/20 text-white border-white/30">
              <Zap className="h-4 w-4 mr-2" />
              Ready to Start?
            </Badge>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
              Ready to Start Your Cricket Journey?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
              Join our academy today and take the first step towards becoming a professional cricketer. 
              Our expert coaches are ready to guide you to success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student/register">
                <Button size="lg" variant="secondary" className="group bg-white text-green-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Join as Student
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 bg-transparent group"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
} 