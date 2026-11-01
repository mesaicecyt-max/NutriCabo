import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obtenerPerfilClinica, PERFIL_DEFAULT } from "@/lib/perfil";

export async function GET() {
  try {
    const perfil = await obtenerPerfilClinica();
    return NextResponse.json({ perfil });
  } catch (error: any) {
    console.error("Error en GET /api/configuracion:", error);
    return NextResponse.json({ perfil: PERFIL_DEFAULT });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nombreDoctora,
      tituloProfesional,
      cedula,
      nombreClinica,
      telefonoWhatsapp,
      email,
      direccion,
      colonia,
      codigoPostal,
      ciudad,
      estado,
      duracionCitaMin,
      horarioLunVie,
      horarioSab,
      horarioDom,
    } = body;

    const dataToUpdate: any = {};
    if (nombreDoctora !== undefined) dataToUpdate.nombreDoctora = nombreDoctora.trim();
    if (tituloProfesional !== undefined) dataToUpdate.tituloProfesional = tituloProfesional.trim();
    if (cedula !== undefined) dataToUpdate.cedula = cedula.trim();
    if (nombreClinica !== undefined) dataToUpdate.nombreClinica = nombreClinica.trim();
    if (telefonoWhatsapp !== undefined) dataToUpdate.telefonoWhatsapp = telefonoWhatsapp.trim();
    if (email !== undefined) dataToUpdate.email = email.trim();
    if (direccion !== undefined) dataToUpdate.direccion = direccion.trim();
    if (colonia !== undefined) dataToUpdate.colonia = colonia.trim();
    if (codigoPostal !== undefined) dataToUpdate.codigoPostal = codigoPostal.trim();
    if (ciudad !== undefined) dataToUpdate.ciudad = ciudad.trim();
    if (estado !== undefined) dataToUpdate.estado = estado.trim();
    if (duracionCitaMin !== undefined) dataToUpdate.duracionCitaMin = Number(duracionCitaMin);
    if (horarioLunVie !== undefined) dataToUpdate.horarioLunVie = horarioLunVie.trim();
    if (horarioSab !== undefined) dataToUpdate.horarioSab = horarioSab.trim();
    if (horarioDom !== undefined) dataToUpdate.horarioDom = horarioDom.trim();

    // Actualizar o crear registro id: 1
    const perfilActualizado = await prisma.perfilClinica.upsert({
      where: { id: 1 },
      update: dataToUpdate,
      create: {
        id: 1,
        ...PERFIL_DEFAULT,
        ...dataToUpdate,
      },
    });

    return NextResponse.json({
      mensaje: "Configuración y datos de la clínica actualizados con éxito en la base de datos.",
      perfil: perfilActualizado,
    });
  } catch (error: any) {
    console.error("Error en PUT /api/configuracion:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar la configuración." },
      { status: 500 }
    );
  }
}
