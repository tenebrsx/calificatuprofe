import { NextResponse } from 'next/server';
import { pucmmProfessors } from '@/data/pucmm-professors';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: pucmmProfessors,
      total: pucmmProfessors.length,
      university: 'PUCMM',
      campuses: {
        Santiago: pucmmProfessors.filter(p => p.campus === 'Santiago').length,
        'Santo Domingo': pucmmProfessors.filter(p => p.campus === 'Santo Domingo').length
      }
    });
  } catch (error) {
    console.error('Error fetching PUCMM professors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch PUCMM professors' },
      { status: 500 }
    );
  }
} 