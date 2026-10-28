import Link from "next/link";
import { Calendar, Clock, MessageSquare, CheckCircle, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <Clock className="w-4 h-4" /> Consultas personalizadas de 35 minutos
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Tu plan de nutrición a tu medida, sin filas ni esperas.
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          Agenda tu cita en vivo seleccionando el día y la hora que mejor se adapte a ti. Recibe tu confirmación y recordatorios directamente en tu WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/agendar"
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Agendar mi cita ahora
          </Link>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Hablar con Asistente WhatsApp
          </a>
        </div>
      </div>

      {/* Características */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Bloques de 35 Minutos</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Sesiones enfocadas en evaluación antropométrica, hábitos y diseño de plan nutricional sin tiempos muertos.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Recordatorios por WhatsApp</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Confirmación al instante y recordatorios 24h y 2h antes de tu consulta para que nunca olvides tu cita.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Disponibilidad en Tiempo Real</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            El sistema sincroniza en directo con el calendario del consultorio. Solo ves horarios 100% disponibles.
          </p>
        </div>
      </div>
    </div>
  );
}
