import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generarSlotsDisponibles,
  obtenerHorariosPorDia,
  DURACION_CITA,
  TIMEZONE_OFFSET_CLINICA,
} from "@/lib/slots";
import {
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

    const hoyStr = new Date().toISOString().split("T")[0];
    const fechaStr = fechaParam || hoyStr;

    // Límites de fecha con la zona horaria de la clínica (-07:00 B.C.S.)
    let fechaInicioQuery = new Date(`${fechaStr}T00:00:00${TIMEZONE_OFFSET_CLINICA}`);
    let fechaFinQuery = new Date(`${fechaStr}T23:59:59.999${TIMEZONE_OFFSET_CLINICA}`);

    if (vista === "semana") {
      fechaInicioQuery = startOfWeek(fechaInicioQuery, { weekStartsOn: 1 }); // Lunes
      fechaFinQuery = endOfWeek(fechaFinQuery, { weekStartsOn: 1 });
    } else if (vista === "mes") {
      fechaInicioQuery = startOfMonth(fechaInicioQuery);
      fechaFinQuery = endOfMonth(fechaFinQuery);
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
    let metricas = { pendientesHoy: 0, pendientesSemana: 0, pendientesMes: 0 };
    try {
      const hoyInicio = new Date(`${hoyStr}T00:00:00${TIMEZONE_OFFSET_CLINICA}`);
      const hoyFin = new Date(`${hoyStr}T23:59:59.999${TIMEZONE_OFFSET_CLINICA}`);
      const semInicio = startOfWeek(hoyInicio, { weekStartsOn: 1 });
      const semFin = endOfWeek(hoyFin, { weekStartsOn: 1 });
      const mesInicio = startOfMonth(hoyInicio);
      const mesFin = endOfMonth(hoyFin);

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

    // 3. Si se solicitó la fecha, generar slots exactos de 35 min
    let slots: any[] = [];
    if (fechaParam) {
      const [year, month, day] = fechaParam.split("-").map(Number);
      const diaSemana = new Date(year, month - 1, day).getDay(); // 0=Domingo, 1=Lunes, ...
      const horariosAtencion = obtenerHorariosPorDia(diaSemana);

      // Bloqueos de la nutrióloga para el día
      let bloqueos: any[] = [];
      try {
        bloqueos = await prisma.bloqueoAgenda.findMany({
          where: {
            OR: [
              {
                fechaInicio: { lte: fechaFinQuery },
                fechaFin: { gte: fechaInicioQuery },
              },
            ],
          },
        });
      } catch (e) {}

      const citasActivas = citas.filter((c) => c.estado !== "CANCELADA");

      const intervalosOcupados = [
        ...citasActivas.map((c) => ({
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

      slots = generarSlotsDisponibles(fechaParam, horariosAtencion, intervalosOcupados);
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
    const {
      nombre,
      telefonoWhatsapp,
      fechaHoraInicio,
      fechaHoraFin,
      motivoConsulta,
      origen = "WEB",
    } = body;

    if (!nombre || !telefonoWhatsapp || !fechaHoraInicio) {
      return NextResponse.json(
        { error: "Nombre, teléfono WhatsApp y fecha/hora de inicio son obligatorios." },
        { status: 400 }
      );
    }

    const inicio = new Date(fechaHoraInicio);
    const fin = fechaHoraFin ? new Date(fechaHoraFin) : addMinutes(inicio, DURACION_CITA);

    // 1. Buscar o registrar paciente
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
    } else if (paciente.nombre !== nombre) {
      // Actualizar nombre si cambió
      await prisma.paciente.update({
        where: { id: paciente.id },
        data: { nombre },
      });
    }

    // 2. Validar que no colisione con otra cita activa
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
        { error: "Este horario ya se encuentra reservado. Por favor selecciona otro horario." },
        { status: 409 }
      );
    }

    // 3. Crear cita en PostgreSQL
    const citaCreada = await prisma.cita.create({
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

    // 4. Notificación de confirmación (SMS y WhatsApp)
    try {
      await prisma.notificacion.create({
        data: {
          citaId: citaCreada.id,
          tipo: "CONFIRMACION",
          destinatario: telefonoWhatsapp,
          mensaje: `¡Hola ${nombre}! Tu consulta en ISOS Nutrición Clínica ha sido confirmada para el ${inicio.toLocaleString()}. Canal: SMS y WhatsApp.`,
          fechaProgramada: new Date(),
        },
      });
    } catch (notifErr) {
      console.warn("No se pudo guardar la notificación en DB:", notifErr);
    }

    return NextResponse.json({
      mensaje: "Cita registrada exitosamente.",
      cita: citaCreada,
    });
  } catch (error: any) {
    console.error("Error en POST /api/citas:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la cita." }, { status: 500 });
  }
}
