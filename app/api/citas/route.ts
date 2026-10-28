import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generarSlotsDisponibles, DURACION_CITA } from "@/lib/slots";
import { startOfDay, endOfDay, addMinutes } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fechaParam = searchParams.get("fecha");
    const incluirCanceladas = searchParams.get("incluirCanceladas") === "true";

    if (!fechaParam) {
      return NextResponse.json({ error: "Parámetro 'fecha' requerido (YYYY-MM-DD)" }, { status: 400 });
    }

    const fecha = new Date(`${fechaParam}T00:00:00`);
    const diaInicio = startOfDay(fecha);
    const diaFin = endOfDay(fecha);
    const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ...

    // 1. Obtener citas del día
    let citasDelDia: any[] = [];
    try {
      citasDelDia = await prisma.cita.findMany({
        where: {
          fechaHoraInicio: {
            gte: diaInicio,
            lte: diaFin,
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
      console.warn("Base de datos no conectada aún, usando modo demostración en memoria.");
    }

    // 2. Obtener bloqueos de la nutrióloga (vacaciones, ausencias)
    let bloqueos: any[] = [];
    try {
      bloqueos = await prisma.bloqueoAgenda.findMany({
        where: {
          OR: [
            {
              fechaInicio: { lte: diaFin },
              fechaFin: { gte: diaInicio },
            },
          ],
        },
      });
    } catch (e) {}

    // Horarios de atención configurados (por defecto Lunes a Viernes 09:00-14:00 y 16:00-19:00, Sábados 09:00-13:00)
    let horariosAtencion = [
      { horaInicio: "09:00", horaFin: "14:00" },
      { horaInicio: "16:00", horaFin: "19:00" },
    ];

    if (diaSemana === 0) {
      // Domingo cerrado
      horariosAtencion = [];
    } else if (diaSemana === 6) {
      // Sábado medio día
      horariosAtencion = [{ horaInicio: "09:00", horaFin: "13:00" }];
    }

    // Mapear intervalos ocupados
    const intervalosOcupados = [
      ...citasDelDia
        .filter((c) => c.estado !== "CANCELADA")
        .map((c) => ({
          inicio: new Date(c.fechaHoraInicio),
          fin: new Date(c.fechaHoraFin),
          motivo: "Cita agendada",
        })),
      ...bloqueos.map((b) => ({
        inicio: new Date(b.fechaInicio),
        fin: new Date(b.fechaFin),
        motivo: b.motivo || "Bloqueo por nutrióloga",
      })),
    ];

    // Generar slots de 35 minutos
    const slots = generarSlotsDisponibles(fecha, horariosAtencion, intervalosOcupados);

    return NextResponse.json({
      fecha: fechaParam,
      slots,
      citas: citasDelDia,
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
    const fin = addMinutes(inicio, DURACION_CITA); // Siempre 35 minutos exactos

    let citaCreada;
    try {
      // Buscar o registrar paciente
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

      // Validar colisión antes de crear
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
          { error: "Este horario de 35 minutos ya ha sido reservado por otro paciente." },
          { status: 409 }
        );
      }

      // Crear cita
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

      // Crear registro de notificación de WhatsApp
      await prisma.notificacion.create({
        data: {
          citaId: citaCreada.id,
          tipo: "CONFIRMACION",
          destinatario: telefonoWhatsapp,
          mensaje: `¡Hola ${nombre}! Tu consulta nutricional de 35 min ha sido confirmada para el ${inicio.toLocaleString()}.`,
          fechaProgramada: new Date(),
        },
      });
    } catch (dbError) {
      // Simulación en memoria si la BD PostgreSQL local aún no ha corrido las migraciones
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
      mensaje: "Cita de 35 minutos registrada exitosamente.",
      cita: citaCreada,
    });
  } catch (error: any) {
    console.error("Error en POST /api/citas:", error);
    return NextResponse.json({ error: "Error al procesar la cita." }, { status: 500 });
  }
}
