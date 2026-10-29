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
  Award,
  HeartHandshake,
  Compass,
  Star,
  Quote,
} from "lucide-react";

export default function Home() {
  const [especialidadActiva, setEspecialidadActiva] = useState(0);

  const especialidades = [
    {
      titulo: "Nutrición Clínica (Patologías)",
      descripcion: "Tratamiento nutricional especializado para pacientes con diabetes, resistencia a la insulina, hipertensión, hipotiroidismo, hígado graso y trastornos gastrointestinales.",
      etiqueta: "ENFOQUE MÉDICO",
    },
    {
      titulo: "Control de Peso y Composición Corporal",
      descripcion: "Evaluación antropométrica detallada, análisis de masa muscular y porcentaje de grasa. Planes sostenibles sin pasar hambre ni dietas de rebote.",
      etiqueta: "SALUD & BIENESTAR",
    },
    {
      titulo: "Nutrición Deportiva",
      descripcion: "Optimización de rendimiento atlético, timing de nutrientes, composición corporal para fuerza/resistencia y recomendaciones de suplementación con evidencia científica.",
      etiqueta: "RENDIMIENTO",
    },
    {
      titulo: "Consulta de Seguimiento",
      descripcion: "Monitoreo continuo de avances, ajustes calóricos, análisis de composición corporal periódica y educación nutricional para consolidar hábitos de por vida.",
      etiqueta: "SEGUIMIENTO",
    },
  ];

  // Comentarios reales y positivos de pacientes (solo se muestra el nombre del paciente)
  const testimonios = [
    {
      nombre: "Mariana R.",
      comentario: "Excelente trato y profesionalismo de la Nutrióloga Claudia. Me ayudó a regular mis niveles de glucosa sin sentir que estaba a dieta restrictiva. La atención es de primer nivel.",
      tiempo: "Paciente desde hace 6 meses",
    },
    {
      nombre: "Carlos M.",
      comentario: "El enfoque es muy científico y personalizado. Aprendí a entender mis porciones y mi energía en el trabajo mejoró radicalmente. El consultorio en San José está muy accesible.",
      tiempo: "Paciente en control de peso",
    },
    {
      nombre: "Sofía G.",
      comentario: "Llegué por un problema de tiroides y el cambio en mis síntomas ha sido increíble. Muy empática, dedicada y siempre atenta a resolver cualquier duda por WhatsApp.",
      tiempo: "Paciente de nutrición clínica",
    },
    {
      nombre: "Alejandro V.",
      comentario: "Increíble acompañamiento para nutrición deportiva. Logré bajar porcentaje de grasa manteniendo mi rendimiento en entrenamientos. 100% recomendada en Los Cabos.",
      tiempo: "Paciente de nutrición deportiva",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* 1. HERO SECTION EDITORIAL CON TARJETA DE PRESENTACIÓN */}
      <section className="grid lg:grid-cols-12 gap-10 items-center mb-24">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border-2 border-[#0E3346] text-[#0E3346] text-xs font-mono-tag font-bold hard-shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D96B43]" />
            <span>SAN JOSÉ DEL CABO, B.C.S. · CONSULTA MÉDICO-NUTRICIONAL</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl font-extrabold text-[#0E3346] leading-[1.08] tracking-tight">
            Nutrición clínica con rigor científico y trato humano.
          </h1>

          <p className="text-base sm:text-lg text-[#0E3346]/80 leading-relaxed font-normal max-w-xl">
            Bienvenido a <strong>ISOS Nutrición Clínica</strong>. Planes alimenticios personalizados diseñados a partir de tu diagnóstico clínico, metas y estilo de vida, guiados por la <strong>L.N. Claudia Itzel Chávez García</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/agendar"
              className="px-8 py-4 bg-[#D96B43] hover:bg-[#c45a33] text-white font-extrabold rounded-2xl border-2 border-[#0E3346] hard-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3 text-sm uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              Agendar mi Cita en Línea
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/526241220715?text=Hola%20Nutrióloga%20Claudia,%20me%20gustaría%20solicitar%20información%20para%20una%20consulta%20nutricional"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white hover:bg-[#FAF7F2] text-[#0E3346] font-bold rounded-2xl border-2 border-[#0E3346] hard-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2.5 text-sm font-mono-tag"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              WhatsApp: 624-122-0715
            </a>
          </div>

          {/* Horarios Oficiales en Hero */}
          <div className="p-4 bg-white border-2 border-[#0E3346] rounded-2xl hard-shadow-sm text-xs font-mono-tag flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-[#0E3346]/70 block font-bold">Lunes a Viernes:</span>
              <span className="text-[#0E3346]">09:00 - 14:00 hrs y 16:00 - 20:00 hrs</span>
            </div>
            <div className="sm:border-l-2 sm:border-[#0E3346]/10 sm:pl-4">
              <span className="text-[#0E3346]/70 block font-bold">Sábados:</span>
              <span className="text-[#0E3346]">10:00 - 14:00 hrs</span>
            </div>
          </div>
        </div>

        {/* 2. REPLICA DIGITAL DE LA TARJETA DE PRESENTACIÓN */}
        <div className="lg:col-span-5">
          <div className="bg-[#0E3346] text-[#FAF7F2] rounded-3xl p-8 border-2 border-[#0E3346] hard-shadow-lg relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold font-serif text-sm">
                  IS
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight block leading-none">ISOS</span>
                  <span className="text-[9px] font-mono-tag uppercase tracking-widest text-slate-300">Nutrición Clínica</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-[10px] font-mono-tag text-emerald-300 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> AGENDA DISPONIBLE
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
              Consultar Horarios Disponibles →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MISIÓN, VISIÓN Y VALORES */}
      <section id="filosofia" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono-tag uppercase tracking-widest text-[#D96B43] font-bold">
            Compromiso Clínico
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#0E3346] mt-1">
            Nuestra Filosofía de Atención
          </h2>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 mt-2">
            Entendemos la nutrición como la base de la medicina preventiva y la calidad de vida.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Misión */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center mb-6 text-[#0E3346]">
                <Compass className="w-6 h-6 text-[#D96B43]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-3">
                Nuestra Misión
              </h3>
              <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
                Brindar atención nutricional clínica de la más alta calidad a cada paciente, combinando evaluación basada en evidencia científica con planes individualizados y sostenibles que promuevan la salud integral y la prevención de enfermedades en nuestra comunidad.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0E3346]/10 text-[11px] font-mono-tag text-[#D96B43] font-bold">
              CIENCIA + EMPATÍA
            </div>
          </div>

          {/* Visión */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center mb-6 text-[#0E3346]">
                <Award className="w-6 h-6 text-[#D96B43]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-3">
                Nuestra Visión
              </h3>
              <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
                Ser el consultorio de nutrición clínica de referencia en San José del Cabo y Los Cabos, reconocido por transformar vidas mediante la reeducación alimentaria, el control metabólico efectivo y una atención cálida y personalizada.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0E3346]/10 text-[11px] font-mono-tag text-[#D96B43] font-bold">
              REFERENTE EN SALUD B.C.S.
            </div>
          </div>

          {/* Valores */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center mb-6 text-[#0E3346]">
                <HeartHandshake className="w-6 h-6 text-[#D96B43]" />
              </div>
              <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-3">
                Nuestros Valores
              </h3>
              <ul className="text-xs sm:text-sm text-[#0E3346]/80 space-y-2 leading-relaxed">
                <li>• <strong>Ética y Rigor:</strong> Protocolos fundamentados en evidencia científica.</li>
                <li>• <strong>Empatía:</strong> Escucha activa y comprensión del contexto de cada persona.</li>
                <li>• <strong>Sostenibilidad:</strong> Planes reales que se adapten a tu vida cotidiana.</li>
                <li>• <strong>Compromiso:</strong> Seguimiento cercano a tus metas de salud.</li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-[#0E3346]/10 text-[11px] font-mono-tag text-[#D96B43] font-bold">
              PRINCIPIOS CLÍNICOS
            </div>
          </div>
        </div>
      </section>

      {/* 4. ESPECIALIDADES Y ÁREAS DE ENFOQUE */}
      <section id="servicios" className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
              Áreas de Consulta
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#0E3346] mt-1">
              Especialidades Clínicas
            </h2>
          </div>
          <p className="text-xs font-mono-tag text-[#0E3346]/70 mt-2 md:mt-0">
            Consultas individuales con diagnóstico, plan nutricional y resolución de dudas
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

        {/* Detalle de Especialidad Activa */}
        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D96B43]"></span>
              <h4 className="font-serif-title text-xl font-bold text-[#0E3346]">
                {especialidades[especialidadActiva].titulo}
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed max-w-2xl">
              {especialidades[especialidadActiva].descripcion}
            </p>
          </div>
          <Link
            href="/agendar"
            className="px-6 py-3 bg-[#0E3346] hover:bg-[#15465e] text-white text-xs font-bold uppercase tracking-wider rounded-xl border-2 border-[#0E3346] hard-shadow-sm transition-all whitespace-nowrap"
          >
            Agendar para esta área →
          </Link>
        </div>
      </section>

      {/* 5. COMENTARIOS Y TESTIMONIOS DE PACIENTES (SOLO POSITIVOS Y SOLO NOMBRE) */}
      <section id="testimonios" className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono-tag uppercase tracking-widest text-[#D96B43] font-bold">
            Testimonios
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#0E3346] mt-1">
            Experiencias de Nuestros Pacientes
          </h2>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 mt-2">
            La satisfacción y salud de quienes confían en ISOS Nutrición Clínica son nuestra mejor carta de presentación.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonios.map((testimonio, i) => (
            <div
              key={i}
              className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#0E3346]/20" />
                </div>
                <p className="text-xs sm:text-sm text-[#0E3346]/80 italic leading-relaxed mb-6">
                  "{testimonio.comentario}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#0E3346]/10 flex items-center justify-between">
                <div>
                  {/* SOLO SE MUESTRA EL NOMBRE DEL PACIENTE */}
                  <h4 className="font-serif-title font-bold text-sm text-[#0E3346]">
                    {testimonio.nombre}
                  </h4>
                  <span className="text-[11px] font-mono-tag text-[#0E3346]/60">
                    {testimonio.tiempo}
                  </span>
                </div>
                <span className="text-[10px] font-mono-tag bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  ✓ Verificado
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. UBICACIÓN FÍSICA Y CONTACTO */}
      <section id="contacto" className="grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-[#FAF7F2] border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow space-y-4">
          <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
            Consultorio en San José del Cabo
          </span>
          <h3 className="font-serif-title text-2xl font-bold text-[#0E3346]">
            Visítanos en Col. El Chamizal
          </h3>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
            Nuestro consultorio está ubicado estratégicamente frente al Cerro de la Chiva. Espacio privado, cómodo y con estacionamiento disponible para tus consultas.
          </p>

          <div className="space-y-2.5 text-xs font-mono-tag text-[#0E3346] pt-2">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D96B43] flex-shrink-0 mt-0.5" />
              <span>s/n esquina Alta Tensión, frente Cerro de la Chiva, Yate.<br />Col. El Chamizal, C.P. 23405, San José del Cabo, B.C.S.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
              <span>Teléfono / Citas: <strong>624-122-0715</strong></span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
              <span>Correo: <strong>isosnutricion@gmail.com</strong></span>
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#D96B43] flex-shrink-0" />
              <span>Lun a Vie: 09:00-14:00 y 16:00-20:00 · Sáb: 10:00-14:00</span>
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 sm:p-8 hard-shadow space-y-4">
          <span className="text-xs font-mono-tag uppercase tracking-wider text-[#D96B43] font-bold">
            ¿Listo para empezar?
          </span>
          <h3 className="font-serif-title text-2xl font-bold text-[#0E3346]">
            Agenda tu Consulta Hoy Mismo
          </h3>
          <p className="text-xs sm:text-sm text-[#0E3346]/80 leading-relaxed">
            Selecciona el día y la hora que mejor te acomode a través de nuestra agenda digital, o escríbenos directamente por WhatsApp si tienes alguna consulta previa.
          </p>
          
          <div className="space-y-3 pt-2">
            <Link
              href="/agendar"
              className="w-full py-4 bg-[#D96B43] hover:bg-[#c45a33] text-white font-extrabold rounded-xl border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all"
            >
              <Calendar className="w-4 h-4" />
              Reservar Cita en Línea →
            </Link>

            <a
              href="https://wa.me/526241220715?text=Hola%20Claudia,%20tengo%20una%20duda%20sobre%20las%20consultas%20en%20ISOS"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-2 border-[#0E3346] hard-shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
