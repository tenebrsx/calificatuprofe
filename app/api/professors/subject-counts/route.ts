import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, query } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    // Get all professors from Firebase
    const professorsRef = collection(db, 'professors')
    const professorsQuery = query(professorsRef)
    const professorsSnapshot = await getDocs(professorsQuery)
    
    // Count professors by subject/department
    const subjectCounts: Record<string, number> = {}
    
    professorsSnapshot.forEach((doc) => {
      const professor = doc.data()
      const department = professor.department?.toLowerCase() || 'otros'
      
      // Map departments to subjects
      let subject = 'otros'
      
      if (department.includes('ingenier') || department.includes('sistemas') || department.includes('computacion') || department.includes('software') || department.includes('diseño') || department.includes('arquitectura') || department.includes('energias') || department.includes('estructuras')) {
        subject = 'ingenieria'
      } else if (department.includes('medic') || department.includes('salud') || department.includes('enferm')) {
        subject = 'medicina'
      } else if (department.includes('derecho') || department.includes('legal') || department.includes('juridic')) {
        subject = 'derecho'
      } else if (department.includes('admin') || department.includes('negoc') || department.includes('empresa') || department.includes('mercad')) {
        subject = 'administracion'
      } else if (department.includes('matemat') || department.includes('estadist')) {
        subject = 'matematicas'
      } else if (department.includes('fisica') || department.includes('biofisica')) {
        subject = 'fisica'
      } else if (department.includes('quimica')) {
        subject = 'quimica'
      } else if (department.includes('biolog') || department.includes('biotecnol') || department.includes('biocienc')) {
        subject = 'biologia'
      } else if (department.includes('ambiental') || department.includes('ecolog') || department.includes('ciencias básicas y ambientales')) {
        subject = 'ciencias-ambientales'
      } else if (department.includes('marin') || department.includes('oceanograf')) {
        subject = 'ciencias-marinas'
      } else if (department.includes('educac') || department.includes('pedagog') || department.includes('enseñanza')) {
        subject = 'educacion'
      } else if (department.includes('medic') || department.includes('salud') || department.includes('cirugia') || department.includes('pediatr') || department.includes('cardiol') || department.includes('ginecol') || department.includes('psiquiatr')) {
        subject = 'medicina'
      } else if (department.includes('nutrici') || department.includes('dietet') || department.includes('obesolog') || department.includes('alimentac')) {
        subject = 'nutricion'
      } else if (department.includes('salud pública') || department.includes('epidemiolog') || department.includes('salud ocupacional') || department.includes('bioetic')) {
        subject = 'salud-publica'
      } else if (department.includes('liter') || department.includes('idioma') || department.includes('lengua') || department.includes('human')) {
        subject = 'literatura'
      } else if (department.includes('psicolog') || department.includes('neurocienc') || department.includes('intervencion') || department.includes('crisis')) {
        subject = 'psicologia'
      } else if (department.includes('sociolog') || department.includes('sociales') || department.includes('genero') || department.includes('desarrollo social') || department.includes('antropolog')) {
        subject = 'sociologia'
      } else if (department.includes('histor') || department.includes('contemporane')) {
        subject = 'historia'
      } else if (department.includes('linguist') || department.includes('frances') || department.includes('extranjera')) {
        subject = 'linguistica'
      } else if (department.includes('filosof') || department.includes('logic') || department.includes('bioetic')) {
        subject = 'filosofia'
      } else if (department.includes('comunicac') || department.includes('audiovisual') || department.includes('cine') || department.includes('documental')) {
        subject = 'comunicacion'
      } else if (department.includes('econom') || department.includes('financier') || department.includes('politica economica')) {
        subject = 'economia'
      } else if (department.includes('finanza') || department.includes('financier')) {
        subject = 'finanzas'
      } else if (department.includes('gerenc') || department.includes('liderazgo') || department.includes('productividad')) {
        subject = 'gerencia'
      } else if (department.includes('mercad') || department.includes('marketing')) {
        subject = 'mercadeo'
      } else if (department.includes('ciencia politica') || department.includes('politicas publicas') || department.includes('gobernabilidad')) {
        subject = 'ciencia-politica'
      } else if (department.includes('recursos humanos')) {
        subject = 'recursos-humanos'
      } else if (department.includes('odontolog') || department.includes('periodoncia') || department.includes('ortodoncia') || department.includes('maxilar') || department.includes('rehabilitacion bucal')) {
        subject = 'odontologia'
      } else if (department.includes('arquitectura') || department.includes('diseño de interiores') || department.includes('decoracion arquitectonica')) {
        subject = 'arquitectura'
      } else if (department.includes('artes plasticas') || department.includes('escultura') || department.includes('teatro') || department.includes('artes escenicas')) {
        subject = 'artes'
      } else if (department.includes('negocios internacionales') || department.includes('comercio internacional') || department.includes('relaciones internacionales')) {
        subject = 'negocios-internacionales'
      } else if (department.includes('comunicacion publicitaria') || department.includes('publicidad') || department.includes('marketing digital') || department.includes('medios interactivos')) {
        subject = 'comunicacion-publicitaria'
      }
      
      subjectCounts[subject] = (subjectCounts[subject] || 0) + 1
    })
    
    return NextResponse.json({
      success: true,
      counts: {
        ingenieria: subjectCounts.ingenieria || 0,
        medicina: subjectCounts.medicina || 0,
        derecho: subjectCounts.derecho || 0,
        administracion: subjectCounts.administracion || 0,
        matematicas: subjectCounts.matematicas || 0,
        fisica: subjectCounts.fisica || 0,
        quimica: subjectCounts.quimica || 0,
        biologia: subjectCounts.biologia || 0,
        'ciencias-ambientales': subjectCounts['ciencias-ambientales'] || 0,
        'ciencias-marinas': subjectCounts['ciencias-marinas'] || 0,
        educacion: subjectCounts.educacion || 0,
        nutricion: subjectCounts.nutricion || 0,
        'salud-publica': subjectCounts['salud-publica'] || 0,
        literatura: subjectCounts.literatura || 0,
        psicologia: subjectCounts.psicologia || 0,
        sociologia: subjectCounts.sociologia || 0,
        historia: subjectCounts.historia || 0,
        linguistica: subjectCounts.linguistica || 0,
        filosofia: subjectCounts.filosofia || 0,
        comunicacion: subjectCounts.comunicacion || 0,
        economia: subjectCounts.economia || 0,
        finanzas: subjectCounts.finanzas || 0,
        gerencia: subjectCounts.gerencia || 0,
        mercadeo: subjectCounts.mercadeo || 0,
        'ciencia-politica': subjectCounts['ciencia-politica'] || 0,
        'recursos-humanos': subjectCounts['recursos-humanos'] || 0,
        odontologia: subjectCounts.odontologia || 0,
        arquitectura: subjectCounts.arquitectura || 0,
        artes: subjectCounts.artes || 0,
        'negocios-internacionales': subjectCounts['negocios-internacionales'] || 0,
        'comunicacion-publicitaria': subjectCounts['comunicacion-publicitaria'] || 0
      }
    })
  } catch (error) {
    console.error('Error fetching subject counts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subject counts',
        counts: {
          ingenieria: 0,
          medicina: 0,
          derecho: 0,
          administracion: 0,
          matematicas: 0,
          fisica: 0,
          quimica: 0,
          biologia: 0,
          'ciencias-ambientales': 0,
          'ciencias-marinas': 0,
          educacion: 0,
          nutricion: 0,
          'salud-publica': 0,
          literatura: 0,
          psicologia: 0,
          sociologia: 0,
          historia: 0,
          linguistica: 0,
          filosofia: 0,
          comunicacion: 0,
          economia: 0,
          finanzas: 0,
          gerencia: 0,
          mercadeo: 0,
          'ciencia-politica': 0,
          'recursos-humanos': 0,
          odontologia: 0,
          arquitectura: 0,
          artes: 0,
          'negocios-internacionales': 0,
          'comunicacion-publicitaria': 0
        }
      },
      { status: 500 }
    )
  }
} 