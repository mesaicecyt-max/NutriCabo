import { addMinutes, format, isBefore, isAfter, parse, areIntervalsOverlapping } from "date-fns";

export const DURACION_CITA = 35; // minutos internos por consulta (no publicitar en la web)

export interface SlotHorario {
  horaInicio: string; // "09:00"
  horaFin: string;    // "09:35"
  inicioISO: string;  // ISO string
  finISO: string;     // ISO string
  disponible: boolean;
  motivoNoDisponible?: string;
}

export interface IntervaloOcupado {
  inicio: Date;
  fin: Date;
  motivo?: string;
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
 */
export function generarSlotsDisponibles(
  fechaBase: Date,
  horariosAtencion: { horaInicio: string; horaFin: string }[],
  intervalosOcupados: IntervaloOcupado[]
): SlotHorario[] {
  const slots: SlotHorario[] = [];
  const fechaStr = format(fechaBase, "yyyy-MM-dd");

  for (const rango of horariosAtencion) {
    let cursor = parse(`${fechaStr} ${rango.horaInicio}`, "yyyy-MM-dd HH:mm", new Date());
    const finRango = parse(`${fechaStr} ${rango.horaFin}`, "yyyy-MM-dd HH:mm", new Date());

    while (true) {
      const slotFin = addMinutes(cursor, DURACION_CITA);

      // Si el slot sobrepasa la hora de cierre, se detiene
      if (isAfter(slotFin, finRango)) {
        break;
      }

      // Verificar si colisiona con alguna cita o bloqueo existente
      const colision = intervalosOcupados.find((ocupado) =>
        areIntervalsOverlapping(
          { start: cursor, end: slotFin },
          { start: ocupado.inicio, end: ocupado.fin },
          { inclusive: false }
        )
      );

      slots.push({
        horaInicio: format(cursor, "HH:mm"),
        horaFin: format(slotFin, "HH:mm"),
        inicioISO: cursor.toISOString(),
        finISO: slotFin.toISOString(),
        disponible: !colision,
        motivoNoDisponible: colision ? (colision.motivo || "Ocupado") : undefined,
      });

      // Avanzar al siguiente bloque
      cursor = slotFin;
    }
  }

  return slots;
}
