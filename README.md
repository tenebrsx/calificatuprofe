# CalificaTuProfe 🎓

**La plataforma de confianza para evaluar profesores universitarios en República Dominicana**

CalificaTuProfe es una plataforma web moderna que permite a los estudiantes universitarios dominicanos buscar, evaluar y compartir experiencias sobre sus profesores, ayudando a la comunidad estudiantil a tomar mejores decisiones académicas.

## 🌟 Características Principales

- **🔍 Búsqueda Avanzada**: Encuentra profesores por nombre, universidad, departamento o materia
- **⭐ Sistema de Calificaciones**: Evalúa profesores en múltiples criterios
- **🏫 Cobertura Universitaria**: Incluye las principales universidades de RD (INTEC, PUCMM, UASD, UNPHU, etc.)
- **📱 Diseño Responsivo**: Optimizado para móviles y escritorio
- **🔒 Moderación Automática**: Sistema de detección de toxicidad para mantener un ambiente respetuoso
- **👥 Comunidad Activa**: Los estudiantes pueden agregar profesores faltantes

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: Firebase Firestore
- **Autenticación**: NextAuth.js
- **Deployment**: Vercel
- **Moderación**: Perspective API (Google)

## 📊 Estado Actual de la Base de Datos

- **INTEC**: 187 profesores
- **UNPHU**: 116 profesores (Arquitectura y Psicología)
- **PUCMM**: 70 profesores
- **BARNA**: 16 profesores
- **UTESA**: 10 profesores
- **UASD**: 5 profesores
- **UNIBE**: 5 profesores

**Total**: 409+ profesores verificados

## 🛠️ Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- API Key de Google Perspective (opcional, para moderación)

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/calificatuprofe.git
cd calificatuprofe
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=tu_secret_super_seguro

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Perspective API (opcional)
PERSPECTIVE_API_KEY=tu_perspective_api_key
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar con GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno

2. **Configurar dominio personalizado**
   - En el dashboard de Vercel, ve a Settings > Domains
   - Agrega `calificatuprofe.com`
   - Configura los DNS según las instrucciones

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de entorno en Vercel:
- Todas las variables de Firebase
- NEXTAUTH_URL (tu dominio de producción)
- NEXTAUTH_SECRET
- Credenciales de Google OAuth
- PERSPECTIVE_API_KEY

## 📁 Estructura del Proyecto

```
calificatuprofe/
├── app/                    # App Router de Next.js 14
│   ├── api/               # API Routes
│   ├── profesor/          # Páginas de profesores
│   ├── institucion/       # Páginas de universidades
│   └── ...
├── components/            # Componentes React reutilizables
├── lib/                   # Utilidades y configuraciones
├── data/                  # Datos estáticos y archivos de profesores
├── public/                # Archivos estáticos
└── scripts/               # Scripts de utilidad
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces

- **Sitio Web**: [calificatuprofe.com](https://calificatuprofe.com)
- **Repositorio**: [GitHub](https://github.com/tu-usuario/calificatuprofe)

## 📞 Contacto

Para preguntas, sugerencias o reportar problemas, puedes:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Hecho con ❤️ para la comunidad estudiantil dominicana** 