import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriCitas | Consultorio de Nutrición y Salud",
  description: "Agenda tu consulta nutricional de 35 minutos de manera fácil y rápida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                NutriCitas
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                Consultorio
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <a href="/agendar" className="text-slate-600 hover:text-emerald-600 transition">
                Agendar Cita
              </a>
              <a
                href="/admin"
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-emerald-600 hover:text-emerald-600 transition text-slate-700"
              >
                Panel Nutrióloga (ABC)
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-8 mt-20 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} NutriCitas · Sistema Integral de Gestión Nutricional y Asistente WhatsApp
        </footer>
      </body>
    </html>
  );
}
