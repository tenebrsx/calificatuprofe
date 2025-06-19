import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { intecCienciasSocialesHumanidadesProfessors } from '@/data/intec-ciencias-sociales-humanidades-professors';

export async function POST(request: NextRequest) {
  try {
    const batch = db.batch();
    
    for (const professor of intecCienciasSocialesHumanidadesProfessors) {
      const professorRef = db.collection('professors').doc(professor.id);
      batch.set(professorRef, {
        ...professor,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: true,
        averageRating: 0,
        totalRatings: 0
      });
    }
    
    await batch.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully added ${intecCienciasSocialesHumanidadesProfessors.length} INTEC Ciencias Sociales y Humanidades professors` 
    });
  } catch (error) {
    console.error('Error adding INTEC CSH professors:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add professors' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    professors: intecCienciasSocialesHumanidadesProfessors,
    count: intecCienciasSocialesHumanidadesProfessors.length 
  });
} 