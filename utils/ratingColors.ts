export function getRatingColor(rating: number): string {
  if (rating >= 0 && rating <= 2.9) {
    return 'rating-poor'  // Red
  } else if (rating >= 3.0 && rating <= 4.0) {
    return 'rating-average'  // Yellow
  } else if (rating >= 4.1) {
    return 'rating-good'  // Green
  }
  return 'rating-average'  // Default fallback
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 0 && rating <= 2.9) {
    return 'bg-red-500 text-white'
  } else if (rating >= 3.0 && rating <= 4.0) {
    return 'bg-yellow-500 text-gray-900'
  } else if (rating >= 4.1) {
    return 'bg-green-500 text-white'
  }
  return 'bg-yellow-500 text-gray-900'  // Default fallback
}

export function getRatingTextColor(rating: number): string {
  if (rating >= 0 && rating <= 2.9) {
    return 'text-red-600'
  } else if (rating >= 3.0 && rating <= 4.0) {
    return 'text-yellow-600'
  } else if (rating >= 4.1) {
    return 'text-green-600'
  }
  return 'text-yellow-600'  // Default fallback
} 