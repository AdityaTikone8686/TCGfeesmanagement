import React from 'react'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, showHeader = true, showFooter = true }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
} 