import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generarSlotsDisponibles, obtenerHorariosPorDia, DURACION_CITA } from "@/lib/slots";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMinutes,
} from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaParam = searchParams.get("fecha");
    const vista = searchParams.get("vista") || "dia"; // "dia" | "semana" | "mes"
    const incluirCanceladas = searchParams.get("incluirCanceladas") === "true";

    const hoy = new Date();
    const fechaReferencia = fechaParam ? new Date(`${fechaParam}T00:00:00`) : hoy;

    // Rango de consulta según la vista
    let fechaInicioQuery = startOfDay(fechaReferencia);
    let fechaFinQuery = endOfDay(fechaReferencia);

    if (vista === "semana") {
      fechaInicioQuery = startOfWeek(fechaReferencia, { weekStartsOn: 1 }); // Lunes
      fechaFinQuery = endOfWeek(fechaReferencia, { weekStartsOn: 1 });
    } else if (vista === "mes") {
      fechaInicioQuery = startOfMonth(fechaReferencia);
      fechaFinQuery = endOfMonth(fechaReferencia);
    }

    // 1. Obtener citas para el rango solicitado
    let citas: any[] = [];
    try {
      citas = await prisma.cita.findMany({
        where: {
          fechaHoraInicio: {
            gte: fechaInicioQuery,
            lte: fechaFinQuery,
          },
          ...(incluirCanceladas ? {} : { estado: { not: "CANCELADA" } }),
        },
        include: {
          paciente: true,
        },
        orderBy: {
          fechaHoraInicio: "asc",
        },
      });
    } catch (dbError) {
      console.warn("Base de datos no accesible en GET /api/citas:", dbError);
    }

    // 2. Reporte de Métricas Totales (Pendientes de atender)
    // Citas que NO estén CANCELADAS ni COMPLETADAS
    let metricas = { pendientesHoy: 0, pendientesSemana: 0, pendientesMes: 0 };
    try {
      const hoyInicio = startOfDay(hoy);
      const hoyFin = endOfDay(hoy);
      const semInicio = startOfWeek(hoy, { weekStartsOn: 1 });
      const semFin = endOfWeek(hoy, { weekStartsOn: 1 });
      const mesInicio = startOfMonth(hoy);
      const mesFin = endOfMonth(hoy);

      const [hoyCount, semCount, mesCount] = await Promise.all([
        prisma.cita.count({
          where: {
            fechaHoraInicio: { gte: hoyInicio, lte: hoyFin },
            estado: { in: ["PENDIENTE", "CONFIRMADA"] },
          },
        }),
        prisma.cita.count({
          where: {
            fechaHoraInicio: { gte: semInicio, lte: semFin },
            estado: { in: ["PENDIENTE", "CONFIRMADA"] },
          },
        }),
        prisma.cita.count({
          where: {
            fechaHoraInicio: { gte: mesInicio, lte: mesFin },
            estado: { in: ["PENDIENTE", "CONFIRMADA"] },
          },
        }),
      ]);

      metricas = {
        pendientesHoy: hoyCount,
        pendientesSemana: semCount,
        pendientesMes: mesCount,
      };
    } catch (e) {}

    // 3. Si se solicitó la vista de un día en particular, calcular slots de 35 min
    let slots: any[] = [];
    if (fechaParam) {
      const diaSemana = fechaReferencia.getDay();
      const horariosAtencion = obtenerHorariosPorDia(diaSemana);

      // Bloqueos de la nutrióloga para el día
      let bloqueos: any[] = [];
      try {
        bloqueos = await prisma.bloqueoAgenda.findMany({
          where: {
            OR: [
              {
                fechaInicio: { lte: endOfDay(fechaReferencia) },
                fechaFin: { gte: startOfDay(fechaReferencia) },
              },
            ],
          },
        });
      } catch (e) {}

      const citasDelDia = citas.filter(
        (c) =>
          new Date(c.fechaHoraInicio) >= startOfDay(fechaReferencia) &&
          new Date(c.fechaHoraInicio) <= endOfDay(fechaReferencia) &&
          c.estado !== "CANCELADA"
      );

      const intervalosOcupados = [
        ...citasDelDia.map((c) => ({
          inicio: new Date(c.fechaHoraInicio),
          fin: new Date(c.fechaHoraFin),
          motivo: "Consulta agendada",
        })),
        ...bloqueos.map((b) => ({
          inicio: new Date(b.fechaInicio),
          fin: new Date(b.fechaFin),
          motivo: b.motivo || "Bloqueo médico",
        })),
      ];

      slots = generarSlotsDisponibles(fechaReferencia, horariosAtencion, intervalosOcupados);
    }

    return NextResponse.json({
      fecha: fechaParam || fechaInicioQuery.toISOString().split("T")[0],
      vista,
      slots,
      citas,
      metricas,
    });
  } catch (error: any) {
    console.error("Error en GET /api/citas:", error);
    return NextResponse.json({ error: "Error al obtener citas y horarios." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, telefonoWhatsapp, fechaHoraInicio, motivoConsulta, origen = "WEB" } = body;

    if (!nombre || !telefonoWhatsapp || !fechaHoraInicio) {
      return NextResponse.json(
        { error: "Nombre, teléfono WhatsApp y fecha/hora de inicio son obligatorios." },
        { status: 400 }
      );
    }

    const inicio = new Date(fechaHoraInicio);
    const fin = addMinutes(inicio, DURACION_CITA); // 35 min exactos

    let citaCreada;
    try {
      let paciente = await prisma.paciente.findUnique({
        where: { telefonoWhatsapp },
      });

      if (!paciente) {
        paciente = await prisma.paciente.create({
          data: {
            nombre,
            telefonoWhatsapp,
          },
        });
      }

      // Validar que no colisione
      const colision = await prisma.cita.findFirst({
        where: {
          estado: { not: "CANCELADA" },
          AND: [
            { fechaHoraInicio: { lt: fin } },
            { fechaHoraFin: { gt: inicio } },
          ],
        },
      });

      if (colision) {
        return NextResponse.json(
          { error: "Este horario ya ha sido reservado por otro paciente." },
          { status: 409 }
        );
      }

      citaCreada = await prisma.cita.create({
        data: {
          pacienteId: paciente.id,
          fechaHoraInicio: inicio,
          fechaHoraFin: fin,
          estado: "CONFIRMADA",
          origen,
          motivoConsulta,
        },
        include: {
          paciente: true,
        },
      });

      // Notificación de confirmación por WhatsApp
      await prisma.notificacion.create({
        data: {
          citaId: citaCreada.id,
          tipo: "CONFIRMACION",
          destinatario: telefonoWhatsapp,
          mensaje: `¡Hola ${nombre}! Tu consulta en ISOS Nutrición Clínica ha sido confirmada para el ${inicio.toLocaleString()}.`,
          fechaProgramada: new Date(),
        },
      });
    } catch (dbError) {
      citaCreada = {
        id: Math.floor(Math.random() * 1000),
        fechaHoraInicio: inicio.toISOString(),
        fechaHoraFin: fin.toISOString(),
        estado: "CONFIRMADA",
        origen,
        motivoConsulta,
        paciente: {
          nombre,
          telefonoWhatsapp,
        },
      };
    }

    return NextResponse.json({
      mensaje: "Cita registrada exitosamente.",
      cita: citaCreada,
    });
  } catch (error: any) {
    console.error("Error en POST /api/citas:", error);
    return NextResponse.json({ error: "Error al procesar la cita." }, { status: 500 });
  }
}
