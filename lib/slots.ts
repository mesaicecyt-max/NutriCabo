import { areIntervalsOverlapping } from "date-fns";

export const DURACION_CITA = 35; // minutos internos por consulta (no publicitar en la web)
export const TIMEZONE_OFFSET_CLINICA = "-07:00"; // San José del Cabo, B.C.S., México (UTC-7)

export interface SlotHorario {
  horaInicio: string; // "09:00"
  horaFin: string;    // "09:35"
  inicioISO: string;  // ISO string en UTC para la base de datos
  finISO: string;     // ISO string en UTC para la base de datos
  disponible: boolean;
  motivoNoDisponible?: string;
}

export interface IntervaloOcupado {
  inicio: Date;
  fin: Date;
  motivo?: string;
}

/**
 * Convierte minutos totales del día (ej. 540) a string formato "09:00"
 */
function minutosAHorasStr(minutosTotales: number): string {
  const h = Math.floor(minutosTotales / 60);
  const m = minutosTotales % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Convierte "09:00" a minutos totales (540)
 */
function horaStrAMinutos(horaStr: string): number {
  const [h, m] = horaStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Horarios de atención oficiales de ISOS Nutrición Clínica:
 * - Lunes a Viernes: 09:00 a 14:00 y 16:00 a 20:00
 * - Sábado: 10:00 a 14:00
 * - Domingo: Cerrado
 */
export function obtenerHorariosPorDia(diaSemana: number): { horaInicio: string; horaFin: string }[] {
  if (diaSemana >= 1 && diaSemana <= 5) {
    // Lunes a Viernes
    return [
      { horaInicio: "09:00", horaFin: "14:00" },
      { horaInicio: "16:00", horaFin: "20:00" },
    ];
  } else if (diaSemana === 6) {
    // Sábado
    return [{ horaInicio: "10:00", horaFin: "14:00" }];
  } else {
    // Domingo cerrado
    return [];
  }
}

/**
 * Genera todos los bloques de 35 minutos dentro de los horarios de atención y
 * filtra los que colisionan con citas existentes o bloqueos de la nutrióloga.
 * 
 * Implementación inmune a la zona horaria del servidor (Vercel corre en UTC,
 * la clínica opera en UTC-7 San José del Cabo).
 */
export function generarSlotsDisponibles(
  fechaStr: string, // "YYYY-MM-DD"
  horariosAtencion: { horaInicio: string; horaFin: string }[],
  intervalosOcupados: IntervaloOcupado[]
): SlotHorario[] {
  const slots: SlotHorario[] = [];

  for (const rango of horariosAtencion) {
    const inicioRangoMin = horaStrAMinutos(rango.horaInicio);
    const finRangoMin = horaStrAMinutos(rango.horaFin);

    let cursorMin = inicioRangoMin;

    while (cursorMin + DURACION_CITA <= finRangoMin) {
      const slotFinMin = cursorMin + DURACION_CITA;

      const horaInicio = minutosAHorasStr(cursorMin);
      const horaFin = minutosAHorasStr(slotFinMin);

      // Creamos los Date con el offset estricto de la clínica (-07:00)
      const slotStart = new Date(`${fechaStr}T${horaInicio}:00${TIMEZONE_OFFSET_CLINICA}`);
      const slotEnd = new Date(`${fechaStr}T${horaFin}:00${TIMEZONE_OFFSET_CLINICA}`);

      // Verificar si colisiona con alguna cita o bloqueo existente
      const colision = intervalosOcupados.find((ocupado) =>
        areIntervalsOverlapping(
          { start: slotStart, end: slotEnd },
          { start: ocupado.inicio, end: ocupado.fin },
          { inclusive: false }
        )
      );

      slots.push({
        horaInicio,
        horaFin,
        inicioISO: slotStart.toISOString(),
        finISO: slotEnd.toISOString(),
        disponible: !colision,
        motivoNoDisponible: colision ? (colision.motivo || "Ocupado") : undefined,
      });

      cursorMin = slotFinMin;
    }
  }

  return slots;
}
