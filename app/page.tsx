'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import HomePage from '@/components/pages/HomePage'
import ReadingCell from '@/components/cells/ReadingCell'
import FoodCell from '@/components/cells/FoodCell'
import LearningCell from '@/components/cells/LearningCell'
import AICell from '@/components/cells/AICell'
import HealthCell from '@/components/cells/HealthCell'


export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'reading':
        return <ReadingCell onNavigate={setCurrentPage} />
      case 'food':
        return <FoodCell onNavigate={setCurrentPage} />
      case 'learning':
        return <LearningCell onNavigate={setCurrentPage} />
      case 'ai':
        return <AICell onNavigate={setCurrentPage} />
      case 'health':
        return <HealthCell onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  )
}
