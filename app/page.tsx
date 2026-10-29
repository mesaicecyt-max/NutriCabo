"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  FileText,
  UserCheck,
} from "lucide-react";

export default function Home() {
  const [especialidadActiva, setEspecialidadActiva] = useState(0);
  const [slotSeleccionado, setSlotSeleccionado] = useState("09:35 - 10:10");

  const especialidades = [
    {
      titulo: "Nutrición Clínica Integral",
      descripcion: "Tratamiento personalizado para manejo de patologías metabólicas (diabetes, hipertensión, resistencia a la insulina, tiroides y salud gastrointestinal).",
      etiqueta: "ENFOQUE MÉDICO",
      duracion: "35 min",
    },
    {
      titulo: "Composición Corporal y Control de Peso",
      descripcion: "Evaluación antropométrica completa, porcentaje de grasa, masa muscular y diseño de déficit calórico sin restricciones extremas.",
      etiqueta: "SALUD & BIENESTAR",
      duracion: "35 min",
    },
    {
      titulo: "Nutrición Deportiva",
      descripcion: "Estrategias de nutrición enfocadas en rendimiento atlético, hidratación, recuperación y suplementación basada en evidencia.",
      etiqueta: "RENDIMIENTO",
      duracion: "35 min",
    },
    {
      titulo: "Reeducación Nutricional y Hábitos",
      descripcion: "Acompañamiento cercano para construir una relación sana y sostenible con la comida a largo plazo.",
      etiqueta: "HÁBITOS DURADEROS",
      duracion: "35 min",
    },
  ];

  const slotsEjemplo = [
    { hora: "09:00 - 09:35", disponible: true },
    { hora: "09:35 - 10:10", disponible: true },
    { hora: "10:10 - 10:45", disponible: false },
    { hora: "11:00 - 11:35", disponible: true },
    { hora: "16:00 - 16:35", disponible: true },
    { hora: "16:35 - 17:10", disponible: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* 1. HERO SECTION EDITORIAL CON TARJETA DE PRESENTACIÓN */}
      <section className="grid lg:grid-cols-12 gap-10 items-center mb-20">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border-2 border-[#0E3346] text-[#0E3346] text-xs font-mono-tag font-bold hard-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D96B43]" />
            <span>SAN JOSÉ DEL CABO · ATENCIÓN MÉDICO-NUTRICIONAL</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl font-extrabold text-[#0E3346] leading-[1.08] tracking-tight">
            Nutrición clínica con rigor científico y trato humano.
          </h1>

          <p className="text-base sm:text-lg text-[#0E3346]/80 leading-relaxed font-normal max-w-xl">
            Bienvenido a <strong>ISOS Nutrición Clínica</strong>. Cada consulta está estructurada en bloques de <strong>35 minutos</strong> dedicados exclusivamente a tu diagnóstico, análisis antropométrico y plan nutricional personalizado.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/agendar"
              className="px-8 py-4 bg-[#D96B43] hover:bg-[#c45a33] text-white font-extrabold rounded-2xl border-2 border-[#0E3346] hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3 text-sm uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              Agendar Consulta (35 min)
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/526241220715?text=Hola%20Nutrióloga%20Claudia,%20me%20gustaría%20solicitar%20información%20para%20una%20consulta%20nutricional"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white hover:bg-[#FAF7F2] text-[#0E3346] font-bold rounded-2xl border-2 border-[#0E3346] hard-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2.5 text-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp: 624-122-0715
            </a>
          </div>

          {/* Medidores de Confianza */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-[#0E3346]/10 text-xs font-mono-tag">
            <div>
              <span className="block text-2xl font-black text-[#0E3346]">35 min</span>
              <span className="text-[#0E3346]/70">Duración por cita</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-[#0E3346]">15781954</span>
              <span className="text-[#0E3346]/70">Cédula Profesional</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-[#0E3346]">100%</span>
              <span className="text-[#0E3346]/70">Planes a medida</span>
            </div>
          </div>
        </div>

        {/* 2. REPLICA DIGITAL DE LA TARJETA DE PRESENTACIÓN (Lado Derecho) */}
        <div className="lg:col-span-5">
          <div className="bg-[#0E3346] text-[#FAF7F2] rounded-3xl p-8 border-2 border-[#0E3346] hard-shadow-lg relative overflow-hidden">
            {/* Adorno de fondo estilo isotipo */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold font-serif text-sm">
                  IS
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight block leading-none">ISOS</span>
                  <span className="text-[9px] font-mono-tag uppercase tracking-widest text-slate-300">Nutrición Clínica</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-mono-tag text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> AGENDA ACTIVA
              </span>
            </div>

            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider font-mono-tag text-[#D96B43] font-bold block mb-1">
                Especialista Titular
              </span>
              <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold leading-tight text-white mb-1">
                Claudia Itzel Chávez García
              </h2>
              <p className="text-xs font-mono-tag text-slate-300">
                Licenciada en Nutrición · Cédula Profesional: <strong>15781954</strong>
              </p>
            </div>

            {/* Datos de contacto idénticos a la tarjeta */}
            <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs font-mono-tag mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
                <span>624-122-0715</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
                <span className="truncate">isosnutricion@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D96B43] flex-shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed text-slate-200">
                  s/n esquina Alta Tensión frente Cerro de la Chiva, Yate.<br />
                  Col. El Chamizal, C.P. 23405, San José del Cabo, B.C.S.
                </span>
              </div>
            </div>

            <Link
              href="/agendar"
              className="w-full py-3.5 bg-white text-[#0E3346] hover:bg-[#FAF7F2] font-black rounded-xl text-center text-xs uppercase tracking-wider block border-2 border-white transition-all hard-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              Seleccionar horario en vivo →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SELECTOR INTERACTIVO DE ESPECIALIDADES */}
      <section id="servicios" className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
              Áreas de Enfoque
            </span>
            <h3 className="font-serif-title text-3xl font-bold text-[#0E3346] mt-1">
              Especialidades Clínicas
            </h3>
          </div>
          <p className="text-xs font-mono-tag text-[#0E3346]/70 mt-2 md:mt-0">
            Cada sesión cuenta con evaluación de 35 minutos y seguimiento continuo
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {especialidades.map((esp, idx) => (
            <button
              key={idx}
              onClick={() => setEspecialidadActiva(idx)}
              className={`p-4 rounded-2xl border-2 border-[#0E3346] text-left transition-all ${
                especialidadActiva === idx
                  ? "bg-[#0E3346] text-white hard-shadow"
                  : "bg-white text-[#0E3346] hover:bg-[#FAF7F2] hard-shadow-sm"
              }`}
            >
              <span className={`text-[10px] font-mono-tag font-bold px-2 py-0.5 rounded-full inline-block mb-2 ${
                especialidadActiva === idx ? "bg-[#D96B43] text-white" : "bg-[#0E3346]/10 text-[#0E3346]"
              }`}>
                {esp.etiqueta}
              </span>
              <h4 className="font-bold text-sm leading-snug">{esp.titulo}</h4>
            </button>
          ))}
        </div>

        {/* Tarjeta de Detalle de Especialidad Activa */}
        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D96B43]"></span>
              <h4 className="font-serif-title text-xl font-bold text-[#0E3346]">
                {especialidades[especialidadActiva].titulo}
              </h4>
            </div>
            <p className="text-sm text-[#0E3346]/80 leading-relaxed max-w-2xl">
              {especialidades[especialidadActiva].descripcion}
            </p>
          </div>
          <Link
            href="/agendar"
            className="px-6 py-3 bg-[#0E3346] hover:bg-[#15465e] text-white text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#0E3346] hard-shadow-sm transition-all whitespace-nowrap"
          >
            Reservar para esta área (35 min) →
          </Link>
        </div>
      </section>

      {/* 4. DEMO INTERACTIVA DE BLOQUES DE 35 MINUTOS */}
      <section className="bg-white border-2 border-[#0E3346] rounded-3xl p-6 sm:p-10 hard-shadow-lg mb-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="text-xs font-mono-tag uppercase tracking-widest text-[#D96B43] font-bold">
            Simulador de Agenda
          </span>
          <h3 className="font-serif-title text-3xl font-bold text-[#0E3346] mt-1 mb-2">
            ¿Cómo funciona el agendamiento de 35 minutos?
          </h3>
          <p className="text-xs sm:text-sm text-[#0E3346]/80">
            El sistema calcula automáticamente bloques continuos de 35 min sin traslapes. Elige un horario de muestra para ver cómo responde el sistema:
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slotsEjemplo.map((s, i) => (
              <button
                key={i}
                disabled={!s.disponible}
                onClick={() => setSlotSeleccionado(s.hora)}
                className={`py-3 px-3 rounded-xl border-2 border-[#0E3346] font-mono-tag text-xs font-bold transition-all text-center ${
                  !s.disponible
                    ? "bg-slate-100 text-slate-400 line-through cursor-not-allowed opacity-60 border-slate-300"
                    : slotSeleccionado === s.hora
                    ? "bg-[#D96B43] text-white hard-shadow"
                    : "bg-[#FAF7F2] text-[#0E3346] hover:bg-[#0E3346] hover:text-white hard-shadow-sm"
                }`}
              >
                <span>{s.hora}</span>
                <span className="block text-[10px] font-normal mt-0.5 opacity-80">
                  {s.disponible ? (slotSeleccionado === s.hora ? "✓ Seleccionado" : "Libre") : "Ocupado"}
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#FAF7F2] border-2 border-[#0E3346] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-tag">
            <div>
              <span className="text-[#0E3346]/70">Horario de prueba:</span>{" "}
              <strong className="text-[#0E3346]">{slotSeleccionado}</strong> (35 minutos exactos)
            </div>
            <Link
              href="/agendar"
              className="px-4 py-2 bg-[#0E3346] text-white rounded-lg hover:bg-[#15465e] font-bold text-xs"
            >
              Ir a la Agenda en Vivo →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE UBICACIÓN Y CONTACTO CLÍNICO */}
      <section id="contacto" className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-[#FAF7F2] border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow space-y-4">
          <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
            Consultorio Físico
          </span>
          <h4 className="font-serif-title text-2xl font-bold text-[#0E3346]">
            Visítanos en San José del Cabo
          </h4>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
            Estamos ubicados frente al Cerro de la Chiva en la Colonia El Chamizal. Contamos con estacionamiento y acceso cómodo para tus consultas presenciales.
          </p>

          <div className="space-y-2 text-xs font-mono-tag text-[#0E3346] pt-2">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D96B43] flex-shrink-0 mt-0.5" />
              <span>s/n esquina Alta Tensión, frente Cerro de la Chiva, Yate. Col. El Chamizal, C.P. 23405.</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
              <span>Teléfono / Citas: <strong>624-122-0715</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
              <span>Correo: <strong>isosnutricion@gmail.com</strong></span>
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow space-y-4">
          <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
            Atención Rápida
          </span>
          <h4 className="font-serif-title text-2xl font-bold text-[#0E3346]">
            ¿Tienes dudas o preguntas?
          </h4>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
            Escríbenos directamente por WhatsApp para conocer más detalles sobre los planes alimenticios, preparación antes de tu consulta o agendamiento manual.
          </p>
          <a
            href="https://wa.me/526241220715?text=Hola%20Claudia,%20tengo%20una%20duda%20sobre%20las%20consultas%20de%20nutrición"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar mensaje por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
