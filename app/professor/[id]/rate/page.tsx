'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useSession } from 'next-auth/react'

interface RatingFormData {
  courseName: string
  rating: number
  difficulty: number
  wouldTakeAgain: boolean
  comment: string
}

export default function RateProfessorPage() {
  const params = useParams()
  const professorId = params?.id as string
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RatingFormData>({
    courseName: '',
    rating: 0,
    difficulty: 0,
    wouldTakeAgain: true,
    comment: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      // Redirect to sign in if not authenticated
      router.push('/api/auth/signin')
      return
    }

    setLoading(true)
    try {
      // Get current professor data
      const professorDoc = await getDoc(doc(db, 'professors', professorId))
      if (!professorDoc.exists()) {
        throw new Error('Professor not found')
      }

      const professorData = professorDoc.data()
      const currentTotalRatings = professorData.totalRatings || 0
      const currentAverageRating = professorData.averageRating || 0

      // Add new rating
      const ratingRef = await addDoc(collection(db, 'ratings'), {
        professorId,
        userId: session.user?.email || 'anonymous',
        courseName: formData.courseName,
        rating: formData.rating,
        difficulty: formData.difficulty,
        wouldTakeAgain: formData.wouldTakeAgain,
        comment: formData.comment,
        createdAt: new Date()
      })

      // Update professor's average rating
      const newTotalRatings = currentTotalRatings + 1
      const newAverageRating = (
        (currentAverageRating * currentTotalRatings + formData.rating) /
        newTotalRatings
      )

      await updateDoc(doc(db, 'professors', professorId), {
        totalRatings: newTotalRatings,
        averageRating: newAverageRating
      })

      // Redirect back to professor page
      router.push(`/professor/${professorId}`)
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Failed to submit rating. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (value: number, field: 'rating' | 'difficulty') => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold mb-4">Sign in Required</h1>
        <p className="mb-4">Please sign in to rate this professor.</p>
        <button
          onClick={() => router.push('/api/auth/signin')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Rate Your Professor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div>
          <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            required
            value={formData.courseName}
            onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value, 'rating')}
                className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                  formData.rating === value
                    ? 'bg-yellow-400 border-yellow-500 text-white'
                    : 'border-gray-300 hover:border-yellow-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingChange(value, 'difficulty')}
                className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                  formData.difficulty === value
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Would Take Again */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would Take Again?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, wouldTakeAgain: true }))}
              className={`px-4 py-2 rounded-md ${
                formData.wouldTakeAgain
                  ? 'bg-green-500 text-white'
                  : 'border border-gray-300 hover:border-green-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, wouldTakeAgain: false }))}
              className={`px-4 py-2 rounded-md ${
                !formData.wouldTakeAgain
                  ? 'bg-red-500 text-white'
                  : 'border border-gray-300 hover:border-red-400'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comments
          </label>
          <textarea
            id="comment"
            required
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your experience with this professor..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.rating || !formData.difficulty}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  )
} 