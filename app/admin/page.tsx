"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Clock,
  PlusCircle,
  XCircle,
  Edit3,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
  ShieldCheck,
} from "lucide-react";

interface Cita {
  id: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";
  origen: "WEB" | "ADMIN_MANUAL" | "WHATSAPP";
  motivoConsulta?: string;
  paciente: {
    nombre: string;
    telefonoWhatsapp: string;
    email?: string;
  };
}

export default function AdminPage() {
  const [fechaFiltro, setFechaFiltro] = useState(format(new Date(), "yyyy-MM-dd"));
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(false);

  // Estados para modal de Alta (A)
  const [modalAltaAbierto, setModalAltaAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState("10:00");
  const [nuevoMotivo, setNuevoMotivo] = useState("Consulta presencial de 35 min");
  const [guardandoAlta, setGuardandoAlta] = useState(false);

  // Estados para Cambios (C)
  const [citaParaCambio, setCitaParaCambio] = useState<Cita | null>(null);
  const [cambioNuevaFecha, setCambioNuevaFecha] = useState("");
  const [cambioNuevaHora, setCambioNuevaHora] = useState("");

  async function cargarCitas() {
    setCargando(true);
    try {
      const res = await fetch(`/api/citas?fecha=${fechaFiltro}&incluirCanceladas=true`);
      const data = await res.json();
      if (data.citas) {
        setCitas(data.citas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarCitas();
  }, [fechaFiltro]);

  async function handleCrearAlta(e: React.FormEvent) {
    e.preventDefault();
    setGuardandoAlta(true);

    try {
      const inicio = new Date(`${fechaFiltro}T${nuevaHoraInicio}:00`);
      const fin = new Date(inicio.getTime() + 35 * 60 * 1000);

      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre,
          telefonoWhatsapp: nuevoTelefono,
          fechaHoraInicio: inicio.toISOString(),
          fechaHoraFin: fin.toISOString(),
          motivoConsulta: nuevoMotivo,
          origen: "ADMIN_MANUAL",
        }),
      });

      if (res.ok) {
        setModalAltaAbierto(false);
        setNuevoNombre("");
        setNuevoTelefono("");
        cargarCitas();
      } else {
        const err = await res.json();
        alert(err.error || "No se pudo registrar la cita.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setGuardandoAlta(false);
    }
  }

  async function handleBajaCita(id: number) {
    if (!confirm("¿Segura que deseas cancelar esta cita? Se liberará el bloque de 35 min en la web.")) return;

    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CANCELADA" }),
      });

      if (res.ok) {
        cargarCitas();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGuardarCambio(e: React.FormEvent) {
    e.preventDefault();
    if (!citaParaCambio) return;

    try {
      const inicio = new Date(`${cambioNuevaFecha}T${cambioNuevaHora}:00`);
      const fin = new Date(inicio.getTime() + 35 * 60 * 1000);

      const res = await fetch(`/api/citas/${citaParaCambio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaHoraInicio: inicio.toISOString(),
          fechaHoraFin: fin.toISOString(),
          estado: "CONFIRMADA",
        }),
      });

      if (res.ok) {
        setCitaParaCambio(null);
        cargarCitas();
      } else {
        alert("Error al reagendar la cita.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-tag font-bold px-2.5 py-1 bg-[#0E3346] text-[#FAF7F2] rounded-lg">
              ISOS Nutrición Clínica
            </span>
            <span className="text-[11px] font-mono-tag text-[#0E3346]/70">
              Cédula: 15781954
            </span>
          </div>
          <h1 className="font-serif-title text-3xl font-extrabold text-[#0E3346] mt-1">
            Panel de Control de Citas (ABC)
          </h1>
          <p className="text-xs font-mono-tag text-[#0E3346]/70">
            Dra. Claudia Itzel Chávez García · Gestión de agenda en bloques de 35 min.
          </p>
        </div>

        <button
          onClick={() => setModalAltaAbierto(true)}
          className="px-5 py-3 bg-[#D96B43] hover:bg-[#c45a33] text-white text-xs font-extrabold uppercase font-mono-tag tracking-wider rounded-xl border-2 border-[#0E3346] hard-shadow hover:translate-x-[1px] hover:translate-y-[1px] flex items-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" /> [A] Alta Manual de Cita
        </button>
      </div>

      {/* Barra de Filtro de Fecha */}
      <div className="bg-white p-4 rounded-2xl border-2 border-[#0E3346] hard-shadow mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#D96B43]" />
          <span className="text-xs font-mono-tag uppercase font-bold text-[#0E3346]">Agenda del:</span>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="px-3 py-1.5 border-2 border-[#0E3346] rounded-xl font-mono-tag font-bold text-xs text-[#0E3346] bg-[#FAF7F2] focus:outline-none"
          />
        </div>

        <button
          onClick={cargarCitas}
          className="text-[#0E3346] hover:text-[#D96B43] text-xs font-mono-tag font-bold flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>

      {/* Lista de Citas del Día */}
      <div className="bg-white rounded-2xl border-2 border-[#0E3346] hard-shadow overflow-hidden">
        <div className="p-4 border-b-2 border-[#0E3346] bg-[#FAF7F2] flex justify-between items-center font-mono-tag">
          <h2 className="text-xs uppercase font-bold text-[#0E3346]">
            Citas Programadas ({citas.length} registradas)
          </h2>
          <span className="text-[11px] text-[#0E3346]/70">Bloques fijos: 35 min</span>
        </div>

        {cargando ? (
          <div className="py-16 text-center text-[#0E3346]/50 flex flex-col items-center gap-2 font-mono-tag text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-[#D96B43]" />
            <span>Consultando agenda...</span>
          </div>
        ) : citas.length === 0 ? (
          <div className="py-16 text-center text-[#0E3346]/70 text-xs font-mono-tag">
            No hay citas registradas para este día. Usa <strong>[A] Alta Manual</strong> o los pacientes pueden agendar en la web.
          </div>
        ) : (
          <div className="divide-y-2 divide-[#0E3346]/10">
            {citas.map((cita) => {
              const inicio = new Date(cita.fechaHoraInicio);
              const fin = new Date(cita.fechaHoraFin);
              const esCancelada = cita.estado === "CANCELADA";

              return (
                <div
                  key={cita.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    esCancelada ? "bg-[#FAF7F2]/60 opacity-50" : "hover:bg-[#FAF7F2]/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`px-3 py-2 rounded-xl text-center font-mono-tag text-xs font-bold border-2 border-[#0E3346] ${
                        esCancelada
                          ? "bg-slate-100 text-slate-400 line-through"
                          : "bg-[#0E3346] text-[#FAF7F2] hard-shadow-sm"
                      }`}
                    >
                      <div>{format(inicio, "HH:mm")}</div>
                      <div className="text-[9px] opacity-70">a {format(fin, "HH:mm")}</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-mono-tag">
                        <span className="font-extrabold text-[#0E3346] text-sm">{cita.paciente.nombre}</span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            cita.estado === "CONFIRMADA"
                              ? "bg-emerald-100 text-emerald-800"
                              : cita.estado === "CANCELADA"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {cita.estado}
                        </span>
                        <span className="text-[9px] text-[#0E3346]/60 bg-[#FAF7F2] border border-[#0E3346]/20 px-1.5 py-0.5 rounded">
                          {cita.origen}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-xs font-mono-tag text-[#0E3346]/70">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D96B43]" />
                          {cita.paciente.telefonoWhatsapp}
                        </span>
                        {cita.motivoConsulta && (
                          <span className="truncate max-w-xs">
                            • {cita.motivoConsulta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!esCancelada && (
                    <div className="flex items-center gap-2 self-end sm:self-center font-mono-tag">
                      <a
                        href={`https://wa.me/${cita.paciente.telefonoWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-300 transition"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setCitaParaCambio(cita);
                          setCambioNuevaFecha(format(new Date(cita.fechaHoraInicio), "yyyy-MM-dd"));
                          setCambioNuevaHora(format(new Date(cita.fechaHoraInicio), "HH:mm"));
                        }}
                        className="px-2.5 py-1.5 border-2 border-[#0E3346] bg-white hover:bg-[#FAF7F2] text-[#0E3346] text-xs font-bold rounded-lg hard-shadow-sm flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" /> [C] Cambiar
                      </button>

                      <button
                        onClick={() => handleBajaCita(cita.id)}
                        className="px-2.5 py-1.5 border-2 border-[#0E3346] bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hard-shadow-sm flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3 h-3 text-rose-600" /> [B] Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Alta (A) */}
      {modalAltaAbierto && (
        <div className="fixed inset-0 bg-[#0E3346]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-[#0E3346] hard-shadow-lg font-mono-tag">
            <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#D96B43]" /> [A] Alta Manual de Cita
            </h3>
            <p className="text-xs text-[#0E3346]/70 mb-4">
              Registra una cita telefónica o presencial de 35 minutos.
            </p>

            <form onSubmit={handleCrearAlta} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Nombre Paciente</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={nuevaHoraInicio}
                    onChange={(e) => setNuevaHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-mono-tag font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Duración</label>
                  <input
                    type="text"
                    disabled
                    value="35 minutos"
                    className="w-full px-3 py-2 border-2 border-[#0E3346]/30 rounded-xl text-xs bg-slate-100 text-[#0E3346]/60 font-mono-tag font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Motivo</label>
                <input
                  type="text"
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAltaAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-[#0E3346] hover:bg-[#FAF7F2] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoAlta}
                  className="px-4 py-2 bg-[#D96B43] hover:bg-[#c45a33] text-white text-xs font-extrabold uppercase rounded-xl border-2 border-[#0E3346] hard-shadow-sm"
                >
                  {guardandoAlta ? "Guardando..." : "Guardar Cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cambios (C) */}
      {citaParaCambio && (
        <div className="fixed inset-0 bg-[#0E3346]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-[#0E3346] hard-shadow-lg font-mono-tag">
            <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> [C] Reagendar Cita
            </h3>
            <p className="text-xs text-[#0E3346]/70 mb-4">
              Reasigna fecha u hora para {citaParaCambio.paciente.nombre}.
            </p>

            <form onSubmit={handleGuardarCambio} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Nueva Fecha</label>
                <input
                  type="date"
                  required
                  value={cambioNuevaFecha}
                  onChange={(e) => setCambioNuevaFecha(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Nueva Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={cambioNuevaHora}
                  onChange={(e) => setCambioNuevaHora(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-bold"
                />
                <span className="text-[10px] text-[#0E3346]/60 mt-1 block">
                  El sistema mantendrá los 35 minutos de duración de la consulta.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCitaParaCambio(null)}
                  className="px-4 py-2 text-xs font-bold text-[#0E3346] hover:bg-[#FAF7F2] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase rounded-xl border-2 border-[#0E3346] hard-shadow-sm"
                >
                  Confirmar Cambio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
