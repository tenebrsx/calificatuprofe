'use client'

import { useEffect, useState } from 'react'

interface TestResult {
  name: string
  status: 'testing' | 'success' | 'error'
  message: string
  duration?: number
}

export default function DebugPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Firebase Connection', status: 'testing', message: 'Initializing...' },
    { name: 'API Routes - Recent Reviews', status: 'testing', message: 'Initializing...' },
    { name: 'API Routes - Featured Professors', status: 'testing', message: 'Initializing...' },
    { name: 'Scraper API', status: 'testing', message: 'Initializing...' }
  ])

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    // Test 1: Firebase Connection
    await testFirebase()
    
    // Test 2: API Routes
    await testRecentReviews()
    await testFeaturedProfessors()
    
    // Test 3: Scraper API
    await testScraperAPI()
  }

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ))
  }

  const testFirebase = async () => {
    const startTime = Date.now()
    try {
      // Test Firebase initialization
      const { db } = await import('@/lib/firebase')
      if (db) {
        updateTest(0, {
          status: 'success',
          message: 'Firebase initialized successfully',
          duration: Date.now() - startTime
        })
      } else {
        throw new Error('Firebase db is undefined')
      }
    } catch (error: unknown) {
      updateTest(0, {
        status: 'error',
        message: `Firebase error: ${error instanceof Error ? error.message : "Unknown error"}`,
        duration: Date.now() - startTime
      })
    }
  }

  const testRecentReviews = async () => {
    const startTime = Date.now()
    try {
      const response = await fetch('/api/reviews/recent', {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        updateTest(1, {
          status: 'success',
          message: `API working - ${data.length} reviews fetched`,
          duration: Date.now() - startTime
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: unknown) {
      updateTest(1, {
        status: 'error',
        message: `Recent Reviews API error: ${error instanceof Error ? error.message : "Unknown error"}`,
        duration: Date.now() - startTime
      })
    }
  }

  const testFeaturedProfessors = async () => {
    const startTime = Date.now()
    try {
      const response = await fetch('/api/professors/featured', {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        updateTest(2, {
          status: 'success',
          message: `API working - ${data.length} professors fetched`,
          duration: Date.now() - startTime
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: unknown) {
      updateTest(2, {
        status: 'error',
        message: `Featured Professors API error: ${error instanceof Error ? error.message : "Unknown error"}`,
        duration: Date.now() - startTime
      })
    }
  }

  const testScraperAPI = async () => {
    const startTime = Date.now()
    try {
      const response = await fetch('/api/admin/scrape?action=universities', {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      if (response.ok) {
        const data = await response.json()
        updateTest(3, {
          status: 'success',
          message: `Scraper API working - ${data.data?.length || 0} universities`,
          duration: Date.now() - startTime
        })
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: unknown) {
      updateTest(3, {
        status: 'error',
        message: `Scraper API error: ${error instanceof Error ? error.message : "Unknown error"}`,
        duration: Date.now() - startTime
      })
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'testing': return '🔄'
      case 'success': return '✅'
      case 'error': return '❌'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'testing': return 'text-blue-600'
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔧 CalificaTuProfe - System Diagnostics
          </h1>
          
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(test.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className={`text-sm ${getStatusColor(test.status)}`}>
                      {test.message}
                    </p>
                  </div>
                </div>
                {test.duration && (
                  <div className="text-sm text-gray-500">
                    {test.duration}ms
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• If all tests pass ✅, your system is working correctly</li>
              <li>• If Firebase fails ❌, check your .env.local configuration</li>
              <li>• If APIs timeout, there might be network issues</li>
              <li>• If scraper fails, the new scraper system needs setup</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              🔄 Run Tests Again
            </button>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 