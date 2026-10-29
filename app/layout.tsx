import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISOS Nutrición Clínica | L.N. Claudia Itzel Chávez García",
  description: "Consultas de nutrición clínica en San José del Cabo, B.C.S. Citas de 35 minutos con evaluación y seguimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0E3346] antialiased">
        {/* Barra superior de anuncios */}
        <div className="bg-[#0E3346] text-[#FAF7F2] py-2 px-4 text-xs font-mono-tag border-b-2 border-[#0E3346]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="tracking-wide">CONSULTORIO EN SAN JOSÉ DEL CABO, B.C.S. · C.P. 23405</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] opacity-90">
              <span className="hidden md:inline">📍 Col. El Chamizal</span>
              <span>📞 624-122-0715</span>
              <span className="bg-[#D96B43] text-white px-2 py-0.5 rounded font-bold">CITAS: 35 MIN</span>
            </div>
          </div>
        </div>

        {/* Cabecera Principal */}
        <header className="bg-[#FAF7F2]/95 backdrop-blur-sm border-b-2 border-[#0E3346] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* Logo ISOS */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#0E3346] text-[#FAF7F2] rounded-2xl border-2 border-[#0E3346] flex items-center justify-center hard-shadow-sm group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
                {/* Isotipo estilizado similar al de la tarjeta */}
                <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5ZM20 9C23.5 9 26.5 11 28 14C25 15 22 17 20 20C18 23 15 25 12 26C13.5 29 16.5 31 20 31C26.075 31 31 26.075 31 20C31 18.5 30.7 17.1 30.1 15.8C28.2 13 24.5 10.5 20 9Z" opacity="0.9"/>
                  <circle cx="20" cy="20" r="3" fill="#D96B43" />
                </svg>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-[#0E3346] leading-none">ISOS</span>
                  <span className="text-[10px] font-mono-tag bg-[#0E3346]/10 text-[#0E3346] font-bold px-1.5 py-0.5 rounded">B.C.S.</span>
                </div>
                <span className="text-[11px] font-mono-tag tracking-wider uppercase text-[#0E3346]/70 block -mt-0.5">
                  Nutrición Clínica
                </span>
              </div>
            </a>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/#servicios" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Especialidades
              </a>
              <a href="/#contacto" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Ubicación
              </a>
              <a
                href="/admin"
                className="px-3.5 py-2 rounded-xl border-2 border-[#0E3346] bg-white text-xs font-mono-tag font-bold hard-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Panel Doctora (ABC)
              </a>
              <a
                href="/agendar"
                className="px-5 py-2.5 rounded-xl border-2 border-[#0E3346] bg-[#D96B43] hover:bg-[#c65a34] text-white text-xs font-bold uppercase tracking-wider hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
              >
                Agendar Cita (35 min) →
              </a>
            </nav>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1">{children}</main>

        {/* Footer Editorial */}
        <footer className="border-t-2 border-[#0E3346] bg-white mt-24 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#0E3346]/10">
              <div>
                <h4 className="font-serif-title text-xl font-bold mb-2">ISOS Nutrición Clínica</h4>
                <p className="text-xs font-mono-tag text-[#0E3346]/80 leading-relaxed mb-3">
                  L.N. Claudia Itzel Chávez García<br />
                  Cédula Profesional: 15781954
                </p>
                <span className="inline-block text-[11px] font-mono-tag bg-[#FAF7F2] border border-[#0E3346] px-2.5 py-1 rounded-lg">
                  Consultas de 35 minutos
                </span>
              </div>

              <div>
                <h5 className="font-mono-tag text-xs uppercase tracking-wider font-bold mb-3">Ubicación y Contacto</h5>
                <p className="text-xs leading-relaxed text-[#0E3346]/80 mb-2">
                  s/n esquina Alta Tensión, frente al Cerro de la Chiva, Yate.<br />
                  Col. El Chamizal, C.P. 23405.<br />
                  San José del Cabo, B.C.S.
                </p>
                <p className="text-xs font-mono-tag font-bold text-[#0E3346]">
                  📞 624-122-0715 · ✉️ isosnutricion@gmail.com
                </p>
              </div>

              <div>
                <h5 className="font-mono-tag text-xs uppercase tracking-wider font-bold mb-3">Acceso Rápido</h5>
                <div className="flex flex-col gap-2 text-xs font-semibold">
                  <a href="/agendar" className="hover:text-[#D96B43] flex items-center gap-1">
                    → Reservar Consulta Online
                  </a>
                  <a href="/admin" className="hover:text-[#D96B43] flex items-center gap-1">
                    → Panel Administrativo (ABC Citas)
                  </a>
                  <a
                    href="https://wa.me/526241220715"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold flex items-center gap-1"
                  >
                    → Chat en Directo por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#0E3346]/60 font-mono-tag gap-2">
              <p>© {new Date().getFullYear()} ISOS Nutrición Clínica · San José del Cabo, B.C.S.</p>
              <p>Desarrollado con plataforma NutriCabo / MESAI</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
