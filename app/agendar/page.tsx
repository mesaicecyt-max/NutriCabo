"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, User, Phone, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

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

  // Cargar slots cuando cambia la fecha
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

  // Manejar envío de formulario
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
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">¡Cita Agendada con Éxito!</h1>
        <p className="text-slate-600 mb-8">
          Hemos reservado tu espacio de 35 minutos en el consultorio.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm mb-8 space-y-3">
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 text-sm">Paciente:</span>
            <span className="font-semibold text-slate-800">{citaConfirmada.paciente?.nombre || nombre}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 text-sm">WhatsApp:</span>
            <span className="font-semibold text-slate-800">{telefono}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 text-sm">Fecha:</span>
            <span className="font-semibold text-slate-800">
              {format(new Date(slotSeleccionado!.inicioISO), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-slate-500 text-sm">Horario (35 min):</span>
            <span className="font-semibold text-emerald-700">
              {slotSeleccionado?.horaInicio} a {slotSeleccionado?.horaFin} hrs
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 text-sm">Estado:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
              Confirmada automáticamente
            </span>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm mb-8">
          📱 <strong>Notificación por WhatsApp:</strong> Se ha programado tu confirmación y recordatorio preventivo 24h antes a tu número.
        </div>

        <button
          onClick={() => {
            setCitaConfirmada(null);
            setSlotSeleccionado(null);
          }}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Agenda tu Consulta Nutricional</h1>
        <p className="text-slate-600 mt-1">
          Elige tu día preferido y selecciona un bloque de 35 minutos disponible.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Selector de Fecha y Slots */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> 1. Selecciona la Fecha
            </label>
            <input
              type="date"
              value={fechaSeleccionada}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> 2. Horarios Disponibles (35 min)
              </span>
              <span className="text-xs text-slate-500 font-normal">
                {cargandoSlots ? "Buscando..." : `${slots.filter((s) => s.disponible).length} libres`}
              </span>
            </label>

            {cargandoSlots ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs">Consultando disponibilidad en tiempo real...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl text-sm">
                No hay atención configurada para este día. Selecciona otra fecha.
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
                      className={`py-3 px-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                        !slot.disponible
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                          : seleccionado
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                          : "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800"
                      }`}
                    >
                      <span className="text-sm">
                        {slot.horaInicio} - {slot.horaFin}
                      </span>
                      <span className="text-[10px] mt-0.5 opacity-80">
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> 3. Tus Datos
            </h2>

            {!slotSeleccionado ? (
              <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
                Selecciona primero un horario de 35 min para completar tus datos.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  Cita seleccionada: <strong>{slotSeleccionado.horaInicio} a {slotSeleccionado.horaFin} hrs</strong> ({fechaSeleccionada})
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María González"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Teléfono WhatsApp (para recordatorios)
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. +52 55 1234 5678"
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Motivo o tipo de consulta
                  </label>
                  <select
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 bg-white"
                  >
                    <option value="Control de peso y composición corporal">Control de peso y composición corporal</option>
                    <option value="Nutrición deportiva">Nutrición deportiva</option>
                    <option value="Nutrición clínica (diabetes, tiroides, etc.)">Nutrición clínica (diabetes, hipertensión, etc.)</option>
                    <option value="Consulta de seguimiento">Consulta de seguimiento</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 text-sm"
                >
                  {guardando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Guardando Cita...
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
