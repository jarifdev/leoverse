'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css'
import ProtectedRoute from '@/components/ProtectedRoute'
import AIAssistant from '@/components/AIAssistant'
import Sidebar from '@/components/Sidebar'
import StatsHeader from '@/components/StatsHeader'
import GameStateIndicator from '@/components/GameStateIndicator'

export default function RootLayout({ children }) {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show header/sidebar on landing, login, and signup pages
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
      <body className="min-h-screen bg-space-gradient star-field">
        <ProtectedRoute>
          {!isPublicPage && (
            <>
              {/* Left Sidebar */}
              <Sidebar onOpenAI={() => setIsAIOpen(true)} />
              
              {/* Top Stats Header */}
              <StatsHeader />
              
              {/* Game State Indicator */}
              <GameStateIndicator />
            </>
          )}
          
          {/* Main Content - with padding for sidebar and header only on non-public pages */}
          <div className={isPublicPage ? '' : 'pl-20 pt-24'}>
            {children}
          </div>
          
          {/* AI Assistant Modal */}
          {!isPublicPage && <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />}
        </ProtectedRoute>
      </body>
    </html>
  )
}
