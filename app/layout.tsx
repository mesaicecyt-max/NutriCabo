import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISOS Nutrición Clínica | L.N. Claudia Itzel Chávez García",
  description: "Consultorio de nutrición clínica en San José del Cabo, B.C.S. Evaluación metabólica, control de peso y planes de salud personalizados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0E3346] antialiased">
        {/* Barra superior de anuncios (Pública para Pacientes) */}
        <div className="bg-[#0E3346] text-[#FAF7F2] py-2 px-4 text-xs font-mono-tag border-b-2 border-[#0E3346]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="tracking-wide">CONSULTORIO MÉDICO EN SAN JOSÉ DEL CABO, B.C.S.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] opacity-90">
              <span className="hidden md:inline">📍 Col. El Chamizal · C.P. 23405</span>
              <span>📞 624-122-0715</span>
              <span className="text-emerald-300 font-bold">AGENDA ABIERTA</span>
            </div>
          </div>
        </div>

        {/* Cabecera Principal con Logo Oficial */}
        <header className="bg-[#FAF7F2]/95 backdrop-blur-sm border-b-2 border-[#0E3346] sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            {/* Logo Oficial ISOS */}
            <a href="/" className="flex items-center gap-3 group">
              <img
                src="/logo-isos.png"
                alt="ISOS Nutrición Clínica"
                className="h-12 w-auto object-contain rounded-xl border-2 border-[#0E3346] hard-shadow-sm group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all"
              />
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[#0E3346] leading-none">ISOS</span>
                  <span className="text-[10px] font-mono-tag bg-[#0E3346]/10 text-[#0E3346] font-bold px-1.5 py-0.5 rounded">B.C.S.</span>
                </div>
                <span className="text-[10px] font-mono-tag tracking-wider uppercase text-[#0E3346]/70 block mt-0.5">
                  San José del Cabo
                </span>
              </div>
            </a>

            {/* Navegación Desktop de Pacientes */}
            <nav className="hidden md:flex items-center gap-7">
              <a href="/#servicios" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Especialidades
              </a>
              <a href="/#filosofia" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Nosotros
              </a>
              <a href="/#testimonios" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Pacientes
              </a>
              <a href="/#contacto" className="text-xs uppercase font-bold tracking-wider hover:text-[#D96B43] transition">
                Ubicación
              </a>
              <a
                href="/agendar"
                className="px-5 py-2.5 rounded-xl border-2 border-[#0E3346] bg-[#D96B43] hover:bg-[#c65a34] text-white text-xs font-bold uppercase tracking-wider hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
              >
                Agendar Cita →
              </a>
            </nav>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1">{children}</main>

        {/* Footer Editorial con Logo */}
        <footer className="border-t-2 border-[#0E3346] bg-white mt-24 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-[#0E3346]/10">
              <div>
                <img
                  src="/logo-isos.png"
                  alt="ISOS Nutrición Clínica"
                  className="h-12 w-auto object-contain rounded-xl border-2 border-[#0E3346] hard-shadow-sm mb-3"
                />
                <p className="text-xs font-mono-tag text-[#0E3346]/80 leading-relaxed mb-3">
                  L.N. Claudia Itzel Chávez García<br />
                  Cédula Profesional: 15781954
                </p>
                <p className="text-xs text-[#0E3346]/70 leading-relaxed">
                  Comprometidos con la salud metabólica, prevención y bienestar de las familias en Los Cabos.
                </p>
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
                <h5 className="font-mono-tag text-xs uppercase tracking-wider font-bold mb-3">Atención al Paciente</h5>
                <div className="flex flex-col gap-2 text-xs font-semibold">
                  <a href="/agendar" className="hover:text-[#D96B43] flex items-center gap-1">
                    → Reservar Cita en Línea
                  </a>
                  <a href="/#filosofia" className="hover:text-[#D96B43] flex items-center gap-1">
                    → Misión, Visión y Valores
                  </a>
                  <a
                    href="https://wa.me/526241220715"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold flex items-center gap-1"
                  >
                    → Chat Directo por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#0E3346]/60 font-mono-tag gap-2">
              <p>© {new Date().getFullYear()} ISOS Nutrición Clínica · San José del Cabo, B.C.S.</p>
              <p>Atención previa cita</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
