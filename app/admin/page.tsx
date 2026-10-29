"use client";

import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
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
  Printer,
  Lock,
  LogOut,
  CalendarDays,
  CalendarRange,
  FileSpreadsheet,
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
  // Autenticación de Administrador
  const [autenticado, setAutenticado] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);

  // Vistas y filtros
  const [vista, setVista] = useState<"dia" | "semana" | "mes">("dia");
  const [fechaFiltro, setFechaFiltro] = useState(format(new Date(), "yyyy-MM-dd"));
  const [citas, setCitas] = useState<Cita[]>([]);
  const [metricas, setMetricas] = useState({ pendientesHoy: 0, pendientesSemana: 0, pendientesMes: 0 });
  const [cargando, setCargando] = useState(false);

  // Modal Registro de Cita (antes Alta)
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");
  const [nuevaHoraInicio, setNuevaHoraInicio] = useState("09:00");
  const [nuevoMotivo, setNuevoMotivo] = useState("Nutrición clínica (patologías)");
  const [guardandoRegistro, setGuardandoRegistro] = useState(false);

  // Modal Reprogramación de Citas (antes Cambios)
  const [citaParaReprogramar, setCitaParaReprogramar] = useState<Cita | null>(null);
  const [cambioNuevaFecha, setCambioNuevaFecha] = useState("");
  const [cambioNuevaHora, setCambioNuevaHora] = useState("");

  // Opciones de motivo idénticas a las del cliente
  const motivosDisponibles = [
    "Nutrición clínica (patologías)",
    "Control de peso y composición corporal",
    "Nutrición deportiva",
    "Consulta de seguimiento",
  ];

  // Verificar sesión en localStorage al cargar
  useEffect(() => {
    const sesion = localStorage.getItem("isos_admin_auth");
    if (sesion === "valida_2026") {
      setAutenticado(true);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Clave de acceso administrativa para ISOS Nutrición Clínica
    if (passwordInput.trim() === "isos2026" || passwordInput.trim() === "admin123") {
      localStorage.setItem("isos_admin_auth", "valida_2026");
      setAutenticado(true);
      setErrorPassword(false);
    } else {
      setErrorPassword(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem("isos_admin_auth");
    setAutenticado(false);
  }

  // Cargar citas y métricas
  async function cargarDatos() {
    setCargando(true);
    try {
      const res = await fetch(`/api/citas?fecha=${fechaFiltro}&vista=${vista}&incluirCanceladas=true`);
      const data = await res.json();
      if (data.citas) {
        setCitas(data.citas);
      }
      if (data.metricas) {
        setMetricas(data.metricas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (autenticado) {
      cargarDatos();
    }
  }, [autenticado, fechaFiltro, vista]);

  // Registro de Cita
  async function handleCrearRegistro(e: React.FormEvent) {
    e.preventDefault();
    setGuardandoRegistro(true);

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
        setModalRegistroAbierto(false);
        setNuevoNombre("");
        setNuevoTelefono("");
        cargarDatos();
      } else {
        const err = await res.json();
        alert(err.error || "No se pudo registrar la cita.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setGuardandoRegistro(false);
    }
  }

  // Cancelación de Cita (antes Baja)
  async function handleCancelarCita(id: number) {
    if (!confirm("¿Segura que deseas realizar la cancelación de esta cita? El horario quedará liberado automáticamente.")) return;

    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "CANCELADA" }),
      });

      if (res.ok) {
        cargarDatos();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Reprogramación de Cita (antes Cambios)
  async function handleGuardarReprogramacion(e: React.FormEvent) {
    e.preventDefault();
    if (!citaParaReprogramar) return;

    try {
      const inicio = new Date(`${cambioNuevaFecha}T${cambioNuevaHora}:00`);
      const fin = new Date(inicio.getTime() + 35 * 60 * 1000);

      const res = await fetch(`/api/citas/${citaParaReprogramar.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaHoraInicio: inicio.toISOString(),
          fechaHoraFin: fin.toISOString(),
          estado: "CONFIRMADA",
        }),
      });

      if (res.ok) {
        setCitaParaReprogramar(null);
        cargarDatos();
      } else {
        alert("Error al reprogramar la cita.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Función para imprimir / descargar PDF de la hoja del día
  function handleImprimirReportePDF() {
    window.print();
  }

  // PANTALLA DE LOGIN SI NO ESTÁ AUTENTICADO
  if (!autenticado) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="bg-white border-2 border-[#0E3346] rounded-3xl p-8 max-w-md w-full hard-shadow-lg text-center font-mono-tag">
          <div className="w-14 h-14 bg-[#0E3346] text-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[#0E3346] hard-shadow-sm">
            <Lock className="w-7 h-7 text-[#D96B43]" />
          </div>
          <span className="text-[10px] uppercase font-bold text-[#D96B43] tracking-widest block">
            ACCESO RESTRINGIDO
          </span>
          <h1 className="font-serif-title text-2xl font-black text-[#0E3346] mt-1 mb-2">
            Panel de Control ISOS
          </h1>
          <p className="text-xs text-[#0E3346]/70 mb-6">
            Autenticación de personal médico para administración de citas y expedientes de pacientes.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">
                Contraseña Administrativa
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la clave de acceso"
                className="w-full px-4 py-3 border-2 border-[#0E3346] rounded-xl text-sm bg-[#FAF7F2] font-mono-tag focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
              />
              {errorPassword && (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Clave incorrecta. Intenta con isos2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0E3346] hover:bg-[#15465e] text-white font-extrabold rounded-xl border-2 border-[#0E3346] hard-shadow-sm uppercase text-xs tracking-wider transition-all"
            >
              Iniciar Sesión en Panel →
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#0E3346]/10 text-[10px] text-[#0E3346]/60">
            ISOS Nutrición Clínica · San José del Cabo, B.C.S.
          </div>
        </div>
      </div>
    );
  }

  // PANEL ADMINISTRATIVO AUTENTICADO
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* SECCIÓN IMPRIMIBLE PARA PDF (Solo visible al imprimir con window.print) */}
      <div className="hidden print:block mb-8">
        <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold">ISOS Nutrición Clínica</h1>
            <p className="text-xs">L.N. Claudia Itzel Chávez García · Cédula Profesional: 15781954</p>
            <p className="text-xs">Col. El Chamizal, San José del Cabo, B.C.S. · Tel: 624-122-0715</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">HOJA DE CONTROL DIARIO DE CITAS</h2>
            <p className="text-xs">Fecha del Reporte: {fechaFiltro}</p>
          </div>
        </div>

        <table className="w-full text-left text-xs border border-collapse border-black mb-6">
          <thead>
            <tr className="bg-slate-100 border-b border-black">
              <th className="p-2 border-r border-black">Horario</th>
              <th className="p-2 border-r border-black">Paciente</th>
              <th className="p-2 border-r border-black">WhatsApp / Tel</th>
              <th className="p-2 border-r border-black">Motivo de Consulta</th>
              <th className="p-2 border-r border-black">Estado</th>
              <th className="p-2">Notas Médicas</th>
            </tr>
          </thead>
          <tbody>
            {citas.filter(c => c.estado !== "CANCELADA").map((c, i) => (
              <tr key={i} className="border-b border-black">
                <td className="p-2 border-r border-black font-mono">
                  {format(new Date(c.fechaHoraInicio), "HH:mm")} - {format(new Date(c.fechaHoraFin), "HH:mm")}
                </td>
                <td className="p-2 border-r border-black font-bold">{c.paciente.nombre}</td>
                <td className="p-2 border-r border-black font-mono">{c.paciente.telefonoWhatsapp}</td>
                <td className="p-2 border-r border-black">{c.motivoConsulta || "-"}</td>
                <td className="p-2 border-r border-black">{c.estado}</td>
                <td className="p-2">____________________</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs flex justify-between pt-10">
          <div>Firma Asistente: ______________________</div>
          <div>Firma Doctora: ______________________</div>
        </div>
      </div>

      {/* HEADER PRINCIPAL DEL PANEL (PANTALLA) */}
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-tag font-bold px-2.5 py-1 bg-[#0E3346] text-[#FAF7F2] rounded-lg">
                ISOS Nutrición Clínica
              </span>
              <span className="text-[11px] font-mono-tag text-[#0E3346]/70">
                L.N. Claudia Itzel Chávez García · Cédula: 15781954
              </span>
            </div>
            <h1 className="font-serif-title text-3xl font-extrabold text-[#0E3346] mt-1">
              Panel de Control de Citas
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleImprimirReportePDF}
              className="px-4 py-2.5 bg-white hover:bg-[#FAF7F2] text-[#0E3346] text-xs font-mono-tag font-bold rounded-xl border-2 border-[#0E3346] hard-shadow-sm flex items-center gap-2 transition"
              title="Descargar hoja membretada en PDF para la doctora y asistente"
            >
              <Printer className="w-4 h-4 text-[#D96B43]" />
              Descargar Reporte PDF
            </button>

            <button
              onClick={() => setModalRegistroAbierto(true)}
              className="px-5 py-2.5 bg-[#D96B43] hover:bg-[#c45a33] text-white text-xs font-extrabold uppercase font-mono-tag tracking-wider rounded-xl border-2 border-[#0E3346] hard-shadow flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Registro de Cita
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 text-[#0E3346] hover:text-rose-600 bg-white border-2 border-[#0E3346] rounded-xl hard-shadow-sm transition"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REPORTE DE CITAS TOTALES PENDIENTES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono-tag">
          {/* Citas del Día */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-4 hard-shadow">
            <span className="text-[10px] uppercase font-bold text-[#D96B43] block">
              PENDIENTES DE ATENDER HOY
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-[#0E3346]">{metricas.pendientesHoy}</span>
              <span className="text-xs text-[#0E3346]/60">Citas para hoy</span>
            </div>
          </div>

          {/* Citas de la Semana */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-4 hard-shadow">
            <span className="text-[10px] uppercase font-bold text-[#0E3346] block">
              PENDIENTES ESTA SEMANA
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-[#0E3346]">{metricas.pendientesSemana}</span>
              <span className="text-xs text-[#0E3346]/60">Lunes a Sábado</span>
            </div>
          </div>

          {/* Citas del Mes */}
          <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-4 hard-shadow">
            <span className="text-[10px] uppercase font-bold text-[#0E3346] block">
              PENDIENTES ESTE MES
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-[#0E3346]">{metricas.pendientesMes}</span>
              <span className="text-xs text-[#0E3346]/60">Total mensual</span>
            </div>
          </div>
        </div>

        {/* BARRA DE CONTROL DE CALENDARIO (SELECTOR DE VISTA: DÍA, SEMANA, MES) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#0E3346] hard-shadow mb-6 flex flex-wrap items-center justify-between gap-4 font-mono-tag">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border-2 border-[#0E3346] rounded-xl">
              <button
                onClick={() => setVista("dia")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  vista === "dia" ? "bg-[#0E3346] text-white" : "text-[#0E3346] hover:bg-white"
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setVista("semana")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  vista === "semana" ? "bg-[#0E3346] text-white" : "text-[#0E3346] hover:bg-white"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setVista("mes")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  vista === "mes" ? "bg-[#0E3346] text-white" : "text-[#0E3346] hover:bg-white"
                }`}
              >
                Mes
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0E3346]">Fecha base:</span>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="px-3 py-1.5 border-2 border-[#0E3346] rounded-xl font-bold text-xs text-[#0E3346] bg-[#FAF7F2]"
              />
            </div>
          </div>

          <button
            onClick={cargarDatos}
            className="text-[#0E3346] hover:text-[#D96B43] text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} /> Actualizar
          </button>
        </div>

        {/* LISTADO DE CITAS */}
        <div className="bg-white rounded-2xl border-2 border-[#0E3346] hard-shadow overflow-hidden">
          <div className="p-4 border-b-2 border-[#0E3346] bg-[#FAF7F2] flex justify-between items-center font-mono-tag">
            <h2 className="text-xs uppercase font-bold text-[#0E3346]">
              Citas en Vista ({vista.toUpperCase()}): {citas.length} registros
            </h2>
            <span className="text-[11px] text-[#0E3346]/70">
              Lun-Vie: 09-14h y 16-20h · Sáb: 10-14h
            </span>
          </div>

          {cargando ? (
            <div className="py-16 text-center text-[#0E3346]/50 flex flex-col items-center gap-2 font-mono-tag text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-[#D96B43]" />
              <span>Cargando calendario...</span>
            </div>
          ) : citas.length === 0 ? (
            <div className="py-16 text-center text-[#0E3346]/70 text-xs font-mono-tag">
              No hay citas programadas para este periodo. Puedes registrar una cita con el botón superior.
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
                        <div className="text-[9px] opacity-80 uppercase">{format(inicio, "dd MMM", { locale: es })}</div>
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

                        <div className="flex items-center gap-4 mt-1 text-xs font-mono-tag text-[#0E3346]/70 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#D96B43]" />
                            {cita.paciente.telefonoWhatsapp}
                          </span>
                          {cita.motivoConsulta && (
                            <span className="text-[#0E3346] font-semibold">
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
                          title="Abrir WhatsApp con el paciente"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* REPROGRAMACIÓN DE CITA (Antes Cambios) */}
                        <button
                          onClick={() => {
                            setCitaParaReprogramar(cita);
                            setCambioNuevaFecha(format(new Date(cita.fechaHoraInicio), "yyyy-MM-dd"));
                            setCambioNuevaHora(format(new Date(cita.fechaHoraInicio), "HH:mm"));
                          }}
                          className="px-2.5 py-1.5 border-2 border-[#0E3346] bg-white hover:bg-[#FAF7F2] text-[#0E3346] text-xs font-bold rounded-lg hard-shadow-sm flex items-center gap-1 transition"
                        >
                          <Edit3 className="w-3 h-3 text-blue-600" /> Reprogramación
                        </button>

                        {/* CANCELACIÓN DE CITA (Antes Baja) */}
                        <button
                          onClick={() => handleCancelarCita(cita.id)}
                          className="px-2.5 py-1.5 border-2 border-[#0E3346] bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg hard-shadow-sm flex items-center gap-1 transition"
                        >
                          <XCircle className="w-3 h-3 text-rose-600" /> Cancelación
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL REGISTRO DE CITA (Antes Alta) */}
      {modalRegistroAbierto && (
        <div className="fixed inset-0 bg-[#0E3346]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono-tag">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-[#0E3346] hard-shadow-lg">
            <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#D96B43]" /> Registro de Cita
            </h3>
            <p className="text-xs text-[#0E3346]/70 mb-4">
              Registro manual por teléfono o en recepción para la agenda del día.
            </p>

            <form onSubmit={handleCrearRegistro} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Nombre Paciente</label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-sans"
                  placeholder="Nombre y Apellidos"
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
                  placeholder="624 123 4567"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={nuevaHoraInicio}
                  onChange={(e) => setNuevaHoraInicio(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2] font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">Motivo de Consulta</label>
                <select
                  value={nuevoMotivo}
                  onChange={(e) => setNuevoMotivo(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-[#0E3346] rounded-xl text-xs bg-[#FAF7F2]"
                >
                  {motivosDisponibles.map((m, idx) => (
                    <option key={idx} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalRegistroAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-[#0E3346] hover:bg-[#FAF7F2] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoRegistro}
                  className="px-4 py-2 bg-[#D96B43] hover:bg-[#c45a33] text-white text-xs font-extrabold uppercase rounded-xl border-2 border-[#0E3346] hard-shadow-sm"
                >
                  {guardandoRegistro ? "Guardando..." : "Completar Registro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REPROGRAMACIÓN DE CITA (Antes Cambios) */}
      {citaParaReprogramar && (
        <div className="fixed inset-0 bg-[#0E3346]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono-tag">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-[#0E3346] hard-shadow-lg">
            <h3 className="font-serif-title text-xl font-bold text-[#0E3346] mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" /> Reprogramación de Cita
            </h3>
            <p className="text-xs text-[#0E3346]/70 mb-4">
              Reasigna fecha u hora para {citaParaReprogramar.paciente.nombre}.
            </p>

            <form onSubmit={handleGuardarReprogramacion} className="space-y-4">
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
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCitaParaReprogramar(null)}
                  className="px-4 py-2 text-xs font-bold text-[#0E3346] hover:bg-[#FAF7F2] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase rounded-xl border-2 border-[#0E3346] hard-shadow-sm"
                >
                  Confirmar Reprogramación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
