"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, Phone, CheckCircle2, ArrowRight, Loader2, Sparkles, MessageSquare } from "lucide-react";

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
  const [motivo, setMotivo] = useState("Control de peso y hábitos");
  const [guardando, setGuardando] = useState(false);
  const [citaConfirmada, setCitaConfirmada] = useState<any>(null);

  useEffect(() => {
    async function cargarSlots() {
      setCargandoSlots(true);
      setSlotSeleccionado(null);
      try {
        const res = await fetch(`/api/citas?fecha=${fechaSeleccionada}`);
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
        }
      } catch (err) {
        console.error("Error al cargar slots:", err);
      } finally {
        setCargandoSlots(false);
      }
    }
    cargarSlots();
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
        setCitaConfirmada(data.cita);
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
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-[#0E3346] text-[#FAF7F2] rounded-2xl border-2 border-[#0E3346] hard-shadow flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="font-serif-title text-3xl font-bold text-[#0E3346] mb-2">¡Cita Agendada con Éxito!</h1>
        <p className="text-sm font-mono-tag text-[#0E3346]/80 mb-8">
          Tu bloque de 35 minutos ha sido registrado en ISOS Nutrición Clínica.
        </p>

        <div className="bg-white border-2 border-[#0E3346] rounded-2xl p-6 text-left hard-shadow mb-8 space-y-3 font-mono-tag text-xs">
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Paciente:</span>
            <span className="font-bold text-[#0E3346]">{citaConfirmada.paciente?.nombre || nombre}</span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">WhatsApp:</span>
            <span className="font-bold text-[#0E3346]">{telefono}</span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Fecha:</span>
            <span className="font-bold text-[#0E3346]">
              {format(new Date(slotSeleccionado!.inicioISO), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#0E3346]/10 pb-2">
            <span className="text-[#0E3346]/60">Horario (35 min):</span>
            <span className="font-bold text-[#D96B43]">
              {slotSeleccionado?.horaInicio} a {slotSeleccionado?.horaFin} hrs
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#0E3346]/60">Especialista:</span>
            <span className="font-bold text-[#0E3346]">L.N. Claudia Itzel Chávez García</span>
          </div>
        </div>

        <div className="p-4 bg-[#0E3346] text-[#FAF7F2] border-2 border-[#0E3346] rounded-xl text-xs font-mono-tag mb-8 text-left">
          📱 <strong>Aviso por WhatsApp:</strong> Recibirás la confirmación y recordatorios preventivos directamente al {telefono}.
        </div>

        <button
          onClick={() => {
            setCitaConfirmada(null);
            setSlotSeleccionado(null);
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
          ISOS Nutrición Clínica · San José del Cabo
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#0E3346] mt-1">
          Reserva tu Consulta de 35 Minutos
        </h1>
        <p className="text-xs sm:text-sm text-[#0E3346]/80 mt-1">
          Atención personalizada con la <strong>L.N. Claudia Itzel Chávez García</strong> (Cédula: 15781954).
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
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-[#0E3346] hard-shadow">
            <label className="block text-xs font-mono-tag uppercase font-bold text-[#0E3346] mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D96B43]" /> 2. Bloques de 35 min Disponibles
              </span>
              <span className="text-[11px] font-mono-tag bg-[#FAF7F2] border border-[#0E3346] px-2 py-0.5 rounded">
                {cargandoSlots ? "Buscando..." : `${slots.filter((s) => s.disponible).length} libres`}
              </span>
            </label>

            {cargandoSlots ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#0E3346]/60 gap-2 font-mono-tag text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-[#D96B43]" />
                <span>Calculando disponibilidad en tiempo real...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-[#0E3346]/70 bg-[#FAF7F2] rounded-xl text-xs font-mono-tag border-2 border-dashed border-[#0E3346]/20">
                No hay atención programada para esta fecha (o el consultorio está cerrado). Por favor selecciona otro día.
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
                      className={`py-3 px-3 rounded-xl border-2 border-[#0E3346] text-center transition-all flex flex-col items-center justify-center font-mono-tag ${
                        !slot.disponible
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed line-through opacity-60 border-slate-300"
                          : seleccionado
                          ? "bg-[#D96B43] text-white hard-shadow font-bold"
                          : "bg-[#FAF7F2] hover:bg-[#0E3346] hover:text-white text-[#0E3346] hard-shadow-sm"
                      }`}
                    >
                      <span className="text-xs font-bold">
                        {slot.horaInicio} - {slot.horaFin}
                      </span>
                      <span className="text-[9px] mt-0.5 opacity-80">
                        {slot.disponible ? "Disponible (35 min)" : slot.motivoNoDisponible || "Ocupado"}
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
                Selecciona un horario disponible de 35 min para completar tus datos.
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
                    <Phone className="w-3.5 h-3.5 text-[#D96B43]" /> Teléfono WhatsApp (Para recordatorios)
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
                    Tipo de Consulta
                  </label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-[#0E3346] rounded-xl text-xs font-sans text-[#0E3346] bg-[#FAF7F2] focus:outline-none"
                  >
                    <option value="Nutrición clínica (patologías)">Nutrición clínica (diabetes, tiroides, etc.)</option>
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
                      Confirmar Cita (35 min) <ArrowRight className="w-4 h-4" />
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
