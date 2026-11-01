import { prisma } from "@/lib/prisma";

export interface PerfilClinicaData {
  id?: number;
  nombreDoctora: string;
  tituloProfesional: string;
  cedula: string;
  nombreClinica: string;
  telefonoWhatsapp: string;
  email: string;
  direccion: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  duracionCitaMin: number;
  horarioLunVie: string;
  horarioSab: string;
  horarioDom: string;
}

export const PERFIL_DEFAULT: PerfilClinicaData = {
  id: 1,
  nombreDoctora: "L.N. Claudia Itzel Chávez García",
  tituloProfesional: "Licenciada en Nutrición Clínica",
  cedula: "15781954",
  nombreClinica: "ISOS Nutrición Clínica",
  telefonoWhatsapp: "6241220715",
  email: "isosnutricion@gmail.com",
  direccion: "s/n esquina Alta Tensión frente Cerro de la Chiva, Yate, Col. El Chamizal",
  colonia: "Col. El Chamizal",
  codigoPostal: "23405",
  ciudad: "San José del Cabo",
  estado: "Baja California Sur",
  duracionCitaMin: 35,
  horarioLunVie: "09:00 - 14:00 y 16:00 - 20:00",
  horarioSab: "10:00 - 14:00",
  horarioDom: "Cerrado",
};

/**
 * Consulta el perfil de la clínica desde la base de datos PostgreSQL.
 * Si no existe, realiza un seed automático con los valores iniciales.
 */
export async function obtenerPerfilClinica(): Promise<PerfilClinicaData> {
  try {
    let perfil = await prisma.perfilClinica.findFirst();
    if (!perfil) {
      perfil = await prisma.perfilClinica.create({
        data: PERFIL_DEFAULT,
      });
    }
    return perfil;
  } catch (error) {
    console.warn("No se pudo consultar perfil_clinica en DB, usando defaults:", error);
    return PERFIL_DEFAULT;
  }
}
