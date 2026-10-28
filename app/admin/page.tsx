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
  const [nuevoMotivo, setNuevoMotivo] = useState("Consulta presencial");
  const [guardandoAlta, setGuardandoAlta] = useState(false);

  // Estados para Cambios (C)
  const [citaParaCambio, setCitaParaCambio] = useState<Cita | null>(null);
  const [cambioNuevaFecha, setCambioNuevaFecha] = useState("");
  const [cambioNuevaHora, setCambioNuevaHora] = useState("");

  // Cargar citas de la fecha
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

  // A: Alta Manual
  async function handleCrearAlta(e: React.FormEvent) {
    e.preventDefault();
    setGuardandoAlta(true);

    try {
      // Calcular fechaHoraInicio y fechaHoraFin (+35 min)
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

  // B: Baja (Cancelar Cita)
  async function handleBajaCita(id: number) {
    if (!confirm("¿Segura que deseas cancelar esta cita? Se liberará el bloque de 35 min.")) return;

    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CANCELADA" }),
      });

      if (res.ok) {
        cargarCitas();
      } else {
        alert("Error al cancelar cita.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // C: Cambio (Reagendar Cita)
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header del Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            Panel de Control Nutriológico
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Administrador de Calendario (ABC)
          </h1>
          <p className="text-sm text-slate-500">
            Control de Altas, Bajas y Cambios de consultas en bloques de 35 minutos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalAltaAbierto(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> [A] Alta Manual de Cita
          </button>
        </div>
      </div>

      {/* Barra de Filtro de Fecha */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">Viendo citas del:</span>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="px-3 py-1.5 border rounded-lg border-slate-300 font-semibold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={cargarCitas}
          className="text-slate-500 hover:text-slate-800 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </div>

      {/* Lista de Citas del Día */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">
            Agenda del Día ({citas.length} citas registradas)
          </h2>
          <span className="text-xs text-slate-500">Duración: 35 min por sesión</span>
        </div>

        {cargando ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">Cargando citas...</span>
          </div>
        ) : citas.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No hay citas registradas para este día. Haz clic en <strong>[A] Alta Manual</strong> o los pacientes pueden agendar desde la web.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {citas.map((cita) => {
              const inicio = new Date(cita.fechaHoraInicio);
              const fin = new Date(cita.fechaHoraFin);
              const esCancelada = cita.estado === "CANCELADA";

              return (
                <div
                  key={cita.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    esCancelada ? "bg-slate-50/60 opacity-60" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`px-3 py-2 rounded-xl text-center font-mono text-xs font-bold border ${
                        esCancelada
                          ? "bg-slate-100 border-slate-200 text-slate-400 line-through"
                          : "bg-emerald-50 border-emerald-200 text-emerald-800"
                      }`}
                    >
                      <div>{format(inicio, "HH:mm")}</div>
                      <div className="text-[10px] text-slate-400">a {format(fin, "HH:mm")}</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{cita.paciente.nombre}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            cita.estado === "CONFIRMADA"
                              ? "bg-emerald-100 text-emerald-800"
                              : cita.estado === "CANCELADA"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {cita.estado}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Origen: {cita.origen}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {cita.paciente.telefonoWhatsapp}
                        </span>
                        {cita.motivoConsulta && (
                          <span className="truncate max-w-xs text-slate-600">
                            • {cita.motivoConsulta}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones del ABC */}
                  {!esCancelada && (
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={`https://wa.me/${cita.paciente.telefonoWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setCitaParaCambio(cita);
                          setCambioNuevaFecha(format(new Date(cita.fechaHoraInicio), "yyyy-MM-dd"));
                          setCambioNuevaHora(format(new Date(cita.fechaHoraInicio), "HH:mm"));
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" /> [C] Cambiar
                      </button>

                      <button
                        onClick={() => handleBajaCita(cita.id)}
                        className="px-2.5 py-1.5 border border-rose-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> [B] Cancelar
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" /> [A] Alta Manual de Cita
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registra una cita telefónica o presencial de 35 minutos.
            </p>

            <form onSubmit={handleCrearAlta} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Paciente</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={nuevoTelefono}
                  onChange={(e) => setNuevoTelefono(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={nuevaHoraInicio}
                    onChange={(e) => setNuevaHoraInicio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duración</label>
                  <input
                    type="text"
                    disabled
                    value="35 minutos"
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-slate-100 text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo / Notas</label>
                <input
                  type="text"
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAltaAbierto(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoAlta}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> [C] Reagendar Cita
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Reasigna fecha u hora para {citaParaCambio.paciente.nombre}.
            </p>

            <form onSubmit={handleGuardarCambio} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Fecha</label>
                <input
                  type="date"
                  required
                  value={cambioNuevaFecha}
                  onChange={(e) => setCambioNuevaFecha(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={cambioNuevaHora}
                  onChange={(e) => setCambioNuevaHora(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  El sistema calculará automáticamente los 35 minutos de consulta.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCitaParaCambio(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
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
