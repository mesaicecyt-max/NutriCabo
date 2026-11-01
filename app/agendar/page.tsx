"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, Phone, CheckCircle2, ArrowRight, Loader2, MessageSquare, Bell, Smartphone } from "lucide-react";
import { crearLinkWhatsApp, crearLinkSMS, generarMensajeConfirmacion } from "@/lib/notificaciones";

interface Slot {
  horaInicio: string;
  horaFin: string;
  inicioISO: string;
  finISO: string;
  disponible: boolean;
  motivoNoDisponible?: string;
}

export default function AgendarPage() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotSeleccionado, setSlotSeleccionado] = useState<Slot | null>(null);
  const [cargandoSlots, setCargandoSlots] = useState(false);

  // Formulario del paciente
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("Nutrición clínica (patologías)");
  const [guardando, setGuardando] = useState(false);
  const [citaConfirmada, setCitaConfirmada] = useState<any>(null);

  // Perfil dinámico de la clínica desde la base de datos
  const [perfilClinica, setPerfilClinica] = useState({
    nombreDoctora: "L.N. Claudia Itzel Chávez García",
    cedula: "15781954",
    nombreClinica: "ISOS Nutrición Clínica",
    telefonoWhatsapp: "6241220715",
    direccion: "s/n esquina Alta Tensión frente Cerro de la Chiva, Yate, Col. El Chamizal",
    ciudad: "San José del Cabo",
    estado: "B.C.S.",
    horarioLunVie: "09:00 - 14:00 y 16:00 - 20:00",
    horarioSab: "10:00 - 14:00",
  });

  useEffect(() => {
    fetch("/api/configuracion")
      .then((res) => res.json())
      .then((data) => {
        if (data?.perfil) setPerfilClinica(data.perfil);
      })
      .catch((err) => console.warn("Error cargando perfil clínica:", err));
  }, []);

  // Cargar slots disponibles para la fecha seleccionada
  async function cargarSlots(fecha: string) {
    setCargandoSlots(true);
    setSlotSeleccionado(null);
    try {
      const res = await fetch(`/api/citas?fecha=${fecha}`);
      const data = await res.json();
      if (data.slots) {
        setSlots(data.slots);
      }
    } catch (err) {
      console.error("Error al cargar horarios:", err);
    } finally {
      setCargandoSlots(false);
    }
  }

  useEffect(() => {
    cargarSlots(fechaSeleccionada);
  }, [fechaSeleccionada]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slotSeleccionado) return;

    setGuardando(true);
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefonoWhatsapp: telefono,
          fechaHoraInicio: slotSeleccionado.inicioISO,
          fechaHoraFin: slotSeleccionado.finISO,
          motivoConsulta: motivo,
          origen: "WEB",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Guardamos los datos para la pantalla de confirmación
        setCitaConfirmada({
          ...data.cita,
          nombrePaciente: nombre,
          telefonoPaciente: telefono,
          fechaTexto: format(new Date(slotSeleccionado.inicioISO), "EEEE d 'de' MMMM, yyyy", { locale: es }),
          horarioTexto: `${slotSeleccionado.horaInicio} a ${slotSeleccionado.horaFin} hrs`,
          motivoTexto: motivo,
        });

        // LIMPIEZA COMPLETA: Borrar inmediatamente los datos del paciente para que no persistan
        setNombre("");
        setTelefono("");
        setSlotSeleccionado(null);

        // Recargar los slots para que el horario recién reservado aparezca deshabilitado
        cargarSlots(fechaSeleccionada);
      } else {
        alert(data.error || "Ocurrió un error al agendar.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al agendar.");
    } finally {
      setGuardando(false);
    }
  }

  if (citaConfirmada) {
    const textoMensajeOficial = `¡Hola! Mi cita en ${perfilClinica.nombreClinica} ha sido confirmada en el calendario del consultorio:\n\n👤 Paciente: ${citaConfirmada.nombrePaciente}\n📅 Fecha: ${citaConfirmada.fechaTexto}\n⏰ Horario: ${citaConfirmada.horarioTexto}\n🎯 Motivo: ${citaConfirmada.motivoTexto}\n📍 Consultorio: ${perfilClinica.ciudad}, ${perfilClinica.estado}\n\n(Se me recordará 1 día antes y 1 hora antes de la cita por SMS y WhatsApp)`;

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#0E3346] text-[#FAF7F2] rounded-2xl border-2 border-[#0E3346] hard-shadow flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="font-serif-title text-3xl font-bold text-[#0E3346] mb-2">¡Cita Confirmada en el Calendario!</h1>
        <p className="text-xs sm:text-sm font-mono-tag text-[#0E3346]/80 mb-8">
          Tu horario ha sido registrado y asegurado oficialmente en el consultorio.
        </p>

        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 text-left hard-shadow mb-6 space-y-3 font-mono-tag text-xs">
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Paciente:</span>
            <span className="font-bold text-[#0E3346]">{citaConfirmada.nombrePaciente}</span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Teléfono (SMS / WhatsApp):</span>
            <span className="font-bold text-[#0E3346]">{citaConfirmada.telefonoPaciente}</span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Fecha:</span>
            <span className="font-bold text-[#0E3346] capitalize">
              {citaConfirmada.fechaTexto}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Horario:</span>
            <span className="font-bold text-[#D96B43]">
              {citaConfirmada.horarioTexto}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Motivo:</span>
            <span className="font-bold text-[#0E3346]">{citaConfirmada.motivoTexto}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#0E3346]/60">Especialista:</span>
            <span className="font-bold text-[#0E3346]">{perfilClinica.nombreDoctora} (Cédula: {perfilClinica.cedula})</span>
          </div>
        </div>

        {/* Notificación y Recordatorios (1 Día Antes y 1 Hora Antes) */}
        <div className="p-5 bg-[#0E3346] text-[#FAF7F2] border-2 border-[#0E3346] rounded-2xl hard-shadow mb-8 text-left space-y-3 font-mono-tag">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-[#FAF7F2] mt-0.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-xs mb-1">
                Aviso de Notificaciones por SMS y WhatsApp:
              </p>
              <p className="text-[#FAF7F2]/90 text-[11px] leading-relaxed">
                Tu cita fue confirmada en el calendario del consultorio. Se te recordará <strong>1 día antes</strong> y <strong>1 hora antes</strong> de la cita por este mismo medio a tu número <strong>{citaConfirmada.telefonoPaciente}</strong>.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] space-y-1.5 text-slate-200">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span>✓</span> Cita confirmada en el calendario del consultorio
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span>⏰</span> Recordatorio preventivo: 1 día antes (24h) por SMS y WhatsApp
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span>⚡</span> Recordatorio final: 1 hora antes de la consulta por SMS y WhatsApp
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
            <a
              href={crearLinkWhatsApp(perfilClinica.telefonoWhatsapp, textoMensajeOficial)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border border-emerald-500 hard-shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Enviar confirmación por WhatsApp
            </a>

            <a
              href={crearLinkSMS(
                perfilClinica.telefonoWhatsapp,
                `Cita confirmada en ${perfilClinica.nombreClinica}: ${citaConfirmada.nombrePaciente} el ${citaConfirmada.fechaTexto} a las ${citaConfirmada.horarioTexto}. Recordatorios programados 1 día antes y 1 hora antes.`
              )}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition text-center"
            >
              💬 Enviar confirmación por SMS
            </a>
          </div>
        </div>

        <button
          onClick={() => {
            setCitaConfirmada(null);
            setSlotSeleccionado(null);
            setNombre("");
            setTelefono("");
            cargarSlots(fechaSeleccionada);
          }}
          className="px-6 py-3 bg-[#0E3346] text-white rounded-xl text-xs font-bold font-mono-tag uppercase tracking-wider hard-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <span className="text-xs font-mono-tag uppercase tracking-widest text-[#D96B43] font-bold">
          {perfilClinica.nombreClinica} · {perfilClinica.ciudad}
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#0E3346] mt-1">
          Reserva tu Consulta Nutricional
        </h1>
        <p className="text-xs sm:text-sm text-[#0E3346]/80 mt-1">
          Atención personalizada con la <strong>{perfilClinica.nombreDoctora}</strong> (Cédula: {perfilClinica.cedula}).
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Selector de Fecha y Slots */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-[#0E3346] hard-shadow">
            <label className="block text-xs font-mono-tag uppercase font-bold text-[#0E3346] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D96B43]" /> 1. Elige la Fecha
            </label>
            <input
              type="date"
              value={fechaSeleccionada}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-[#0E3346] rounded-xl font-mono-tag text-sm font-bold text-[#0E3346] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
            />
            <p className="text-[11px] font-mono-tag text-[#0E3346]/60 mt-2">
              Horarios: Lun a Vie ({perfilClinica.horarioLunVie}) · Sáb ({perfilClinica.horarioSab})
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-[#0E3346] hard-shadow">
            <label className="block text-xs font-mono-tag uppercase font-bold text-[#0E3346] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D96B43]" /> 2. Horarios Disponibles
              </span>
              <span className="text-[11px] font-mono-tag bg-[#FAF7F2] border border-[#0E3346] px-2 py-0.5 rounded">
                {cargandoSlots ? "Buscando..." : `${slots.filter((s) => s.disponible).length} libres`}
              </span>
            </label>

            {cargandoSlots ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#0E3346]/60 gap-2 font-mono-tag text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-[#D96B43]" />
                <span>Consultando disponibilidad en tiempo real...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-[#0E3346]/70 bg-[#FAF7F2] rounded-xl text-xs font-mono-tag border-2 border-dashed border-[#0E3346]/20">
                No hay atención programada para esta fecha o el consultorio se encuentra cerrado. Por favor selecciona otro día.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {slots.map((slot, index) => {
                  const seleccionado = slotSeleccionado?.inicioISO === slot.inicioISO;
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!slot.disponible}
                      onClick={() => setSlotSeleccionado(slot)}
                      className={`py-3 px-3 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center font-mono-tag ${
                        !slot.disponible
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60 border-slate-300"
                          : seleccionado
                          ? "bg-[#D96B43] border-[#0E3346] text-white hard-shadow font-bold"
                          : "bg-[#FAF7F2] border-[#0E3346] hover:bg-[#0E3346] hover:text-white text-[#0E3346] hard-shadow-sm"
                      }`}
                    >
                      <span className="text-xs font-bold">
                        {slot.horaInicio} - {slot.horaFin}
                      </span>
                      <span className="text-[9px] mt-0.5 opacity-80">
                        {slot.disponible ? "Disponible" : slot.motivoNoDisponible || "Ocupado"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-2xl border-2 border-[#0E3346] hard-shadow sticky top-28">
            <h2 className="font-serif-title text-xl font-bold text-[#0E3346] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#D96B43]" /> 3. Datos del Paciente
            </h2>

            {!slotSeleccionado ? (
              <div className="text-center py-10 px-4 bg-[#FAF7F2] border-2 border-dashed border-[#0E3346]/20 rounded-xl text-[#0E3346]/60 text-xs font-mono-tag">
                Selecciona un horario disponible para ingresar tus datos.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono-tag">
                <div className="p-3 bg-[#0E3346] text-[#FAF7F2] rounded-xl text-xs">
                  Cita: <strong>{slotSeleccionado.horaInicio} a {slotSeleccionado.horaFin} hrs</strong> ({fechaSeleccionada})
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Roberto Morales"
                    className="w-full px-3.5 py-2.5 border-2 border-[#0E3346] rounded-xl text-xs font-sans text-[#0E3346] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#D96B43]" /> Teléfono Móvil (Confirmación por SMS y WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 624 123 4567"
                    className="w-full px-3.5 py-2.5 border-2 border-[#0E3346] rounded-xl text-xs font-sans text-[#0E3346] bg-[#FAF7F2] focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#0E3346] mb-1">
                    Motivo de Consulta
                  </label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-[#0E3346] rounded-xl text-xs font-sans text-[#0E3346] bg-[#FAF7F2] focus:outline-none"
                  >
                    <option value="Nutrición clínica (patologías)">Nutrición clínica (diabetes, tiroides, patologías)</option>
                    <option value="Control de peso y composición corporal">Control de peso y composición corporal</option>
                    <option value="Nutrición deportiva">Nutrición deportiva</option>
                    <option value="Consulta de seguimiento">Consulta de seguimiento</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full py-3.5 bg-[#D96B43] hover:bg-[#c45a33] text-white font-extrabold rounded-xl border-2 border-[#0E3346] hard-shadow-sm transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  {guardando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Confirmando Cita...
                    </>
                  ) : (
                    <>
                      Confirmar Cita <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
