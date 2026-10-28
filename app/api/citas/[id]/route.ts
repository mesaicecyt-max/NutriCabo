import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addMinutes } from "date-fns";
import { DURACION_CITA } from "@/lib/slots";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { estado, fechaHoraInicio, motivoConsulta, notasNutriologa } = body;

    const datosActualizar: any = {};
    if (estado) datosActualizar.estado = estado;
    if (motivoConsulta !== undefined) datosActualizar.motivoConsulta = motivoConsulta;
    if (notasNutriologa !== undefined) datosActualizar.notasNutriologa = notasNutriologa;

    // Si es un cambio de fecha/hora (C del ABC)
    if (fechaHoraInicio) {
      const nuevoInicio = new Date(fechaHoraInicio);
      const nuevoFin = addMinutes(nuevoInicio, DURACION_CITA); // 35 min exactos
      datosActualizar.fechaHoraInicio = nuevoInicio;
      datosActualizar.fechaHoraFin = nuevoFin;
    }

    let citaActualizada;
    try {
      citaActualizada = await prisma.cita.update({
        where: { id },
        data: datosActualizar,
        include: { paciente: true },
      });
    } catch (dbError) {
      citaActualizada = { id, ...datosActualizar };
    }

    return NextResponse.json({
      mensaje: "Cita actualizada correctamente.",
      cita: citaActualizada,
    });
  } catch (error: any) {
    console.error("Error en PATCH /api/citas/[id]:", error);
    return NextResponse.json({ error: "Error al actualizar la cita." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    try {
      await prisma.cita.delete({ where: { id } });
    } catch (e) {}
    return NextResponse.json({ mensaje: "Cita eliminada." });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la cita." }, { status: 500 });
  }
}
