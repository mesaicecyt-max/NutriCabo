# NutriCitas — Sistema SaaS de Control de Citas y Asistente WhatsApp

Plataforma desarrollada para consultorios de nutrición y profesionales de la salud. Permite el agendamiento público de citas en bloques exactos de **35 minutos**, cuenta con un panel administrativo para la nutrióloga con control **ABC (Altas, Bajas, Cambios)** y conexión para asistente virtual y recordatorios por WhatsApp.

---

## 🛠️ Stack Tecnológico
- **Frontend & Backend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS + Lucide Icons
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Automatización**: Webhooks para WhatsApp API / Chatbot

---

## 📁 Estructura del Proyecto

```
nutri-citas/
├── app/
│   ├── layout.tsx                # Layout principal con navegación
│   ├── page.tsx                  # Landing page informativa para pacientes
│   ├── agendar/page.tsx          # Portal de agendamiento público en bloques de 35 min
│   ├── admin/page.tsx            # Panel administrativo de la nutrióloga (ABC de citas)
│   └── api/
│       ├── citas/route.ts        # GET (cálculo de slots 35 min) y POST (crear cita)
│       ├── citas/[id]/route.ts   # PATCH (Bajas y Cambios) y DELETE
│       └── webhook/whatsapp/     # Webhook para asistente virtual de WhatsApp
├── lib/
│   ├── prisma.ts                 # Cliente singleton de Prisma
│   └── slots.ts                  # Algoritmo matemático para cálculo de slots de 35 min
├── prisma/
│   └── schema.prisma             # Modelado de datos en PostgreSQL (Paciente, Cita, Bloqueos, Notificaciones)
└── .env                          # Variables de entorno y conexión a PostgreSQL
```

---

## 🚀 Puesta en Marcha Rápida

### 1. Instalar Dependencias
Abre una terminal dentro de esta carpeta y ejecuta:
```bash
npm install
```

### 2. Configurar PostgreSQL en `.env`
Edita el archivo `.env` con la cadena de conexión de tu base de datos PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/nutricitas?schema=public"
```

### 3. Aplicar las Migraciones de Prisma
Crea las tablas en tu base de datos ejecutando:
```bash
npx prisma migrate dev --name init
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en:
- **Landing y Reserva de Pacientes:** [http://localhost:3000/agendar](http://localhost:3000/agendar)
- **Panel Administrativo ABC:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🐙 Subir este Proyecto a GitHub

1. Inicializa el repositorio Git:
   ```bash
   git init
   git add .
   git commit -m "feat: MVP inicial de NutriCitas con slots de 35 min, panel ABC y WhatsApp webhook"
   ```

2. Si tienes instalada la herramienta de GitHub CLI (`gh`):
   ```bash
   gh repo create nutri-citas --public --source=. --remote=origin --push
   ```
   *O crea el repositorio manualmente en tu cuenta de GitHub y ejecuta:*
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/nutri-citas.git
   git push -u origin main
   ```
