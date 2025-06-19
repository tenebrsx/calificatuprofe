import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import { INTEC_CIENCIAS_SALUD_PROFESSORS, INTEC_SALUD_SUBJECTS } from '@/data/intec-ciencias-salud-professors'

export async function POST() {
  try {
    console.log('🔄 Starting INTEC Ciencias de la Salud professors upload...')
    
    const professorsRef = collection(db, 'professors')
    let addedCount = 0
    let skippedCount = 0
    const errors: string[] = []

    for (const prof of INTEC_CIENCIAS_SALUD_PROFESSORS) {
      try {
        // Check if professor already exists by email
        const existingQuery = query(professorsRef, where('email', '==', prof.email))
        const existingDocs = await getDocs(existingQuery)
        
        if (!existingDocs.empty) {
          console.log(`⏭️  Skipping ${prof.name} - already exists`)
          skippedCount++
          continue
        }

        // Map subjects to tags for better searchability
        const subjectTags = prof.subjects.map(subject => subject.toUpperCase())
        
        // Add medical specialty as additional tag
        if (prof.medicalSpecialty) {
          subjectTags.push(prof.medicalSpecialty.toUpperCase())
        }
        
        // Prepare professor data for Firebase
        const professorData = {
          name: prof.name,
          email: prof.email,
          university: prof.university,
          institution: prof.university,
          department: prof.department,
          position: prof.position || 'Profesor',
          specialization: prof.specialization,
          subjects: prof.subjects,
          medicalSpecialty: prof.medicalSpecialty,
          campus: prof.campus,
          credentials: prof.credentials,
          description: prof.description,
          
          // Initialize rating data
          averageRating: 0,
          totalRatings: 0,
          totalReviews: 0,
          difficultyRating: 0,
          wouldTakeAgainPercent: 0,
          
          // Tags for search and filtering
          tags: subjectTags,
          
          // Metadata
          isVerified: true,
          source: 'manual_upload_intec_salud_2024',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        const docRef = await addDoc(professorsRef, professorData)
        console.log(`✅ Added ${prof.name} with ID: ${docRef.id}`)
        addedCount++
        
      } catch (error) {
        const errorMsg = `Error adding ${prof.name}: ${error}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    console.log(`🎉 Upload complete! Added: ${addedCount}, Skipped: ${skippedCount}, Errors: ${errors.length}`)

    return NextResponse.json({
      success: true,
      results: {
        totalProfessors: INTEC_CIENCIAS_SALUD_PROFESSORS.length,
        added: addedCount,
        skipped: skippedCount,
        errors: errors.length,
        errorDetails: errors.slice(0, 5), // Only show first 5 errors
        subjects: INTEC_SALUD_SUBJECTS,
        department: 'Ciencias de la Salud'
      },
      message: `Successfully processed ${INTEC_CIENCIAS_SALUD_PROFESSORS.length} INTEC Salud professors. Added: ${addedCount}, Skipped: ${skippedCount}`
    })

  } catch (error) {
    console.error('❌ Failed to upload INTEC Salud professors:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload professors',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return information about the INTEC Salud department and professors
    return NextResponse.json({
      success: true,
      department: {
        name: 'Ciencias de la Salud',
        university: 'INTEC',
        description: 'Departamento dedicado a la formación de profesionales de la salud y la investigación médica, con especialistas en diversas áreas de la medicina y ciencias de la salud.',
        totalProfessors: INTEC_CIENCIAS_SALUD_PROFESSORS.length,
        subjects: INTEC_SALUD_SUBJECTS
      },
      professors: INTEC_CIENCIAS_SALUD_PROFESSORS.map(prof => ({
        name: prof.name,
        email: prof.email,
        position: prof.position,
        specialization: prof.specialization,
        subjects: prof.subjects,
        medicalSpecialty: prof.medicalSpecialty
      }))
    })
  } catch (error) {
    console.error('❌ Failed to get INTEC Salud data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get department data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 