/**
 * Utilidades para la generación y enlaces de mensajes de notificación
 * Multicanal (SMS y WhatsApp) para ISOS Nutrición Clínica.
 * 
 * Regla de negocio:
 * 1. Confirmación de que la cita fue confirmada en el calendario del consultorio.
 * 2. Recordatorio preventivo 1 día antes (24h).
 * 3. Recordatorio preventivo 1 hora antes de la cita.
 * 
 * Admite datos dinámicos desde la base de datos (PerfilClinica).
 */

export interface InfoClinicaMensaje {
  nombreDoctora?: string;
  nombreClinica?: string;
  direccion?: string;
  ciudad?: string;
  telefonoWhatsapp?: string;
}

export function formatearTelefonoWhatsApp(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "");
  // Si tiene 10 dígitos (formato estándar celular México), agregamos prefijo 52
  if (digitos.length === 10) {
    return `52${digitos}`;
  }
  return digitos;
}

export function formatearTelefonoSMS(telefono: string): string {
  return telefono.replace(/\D/g, "");
}

export function generarMensajeConfirmacion(
  nombre: string,
  fechaTexto: string,
  horarioTexto: string,
  clinica?: InfoClinicaMensaje
): string {
  const doc = clinica?.nombreDoctora || "L.N. Claudia Itzel Chávez García";
  const clin = clinica?.nombreClinica || "ISOS Nutrición Clínica";
  const dir = clinica?.direccion || "Yate esq. Alta Tensión frente Cerro de la Chiva, Col. El Chamizal, San José del Cabo, B.C.S.";
  const tel = clinica?.telefonoWhatsapp || "624-122-0715";

  return `¡Hola ${nombre}! Tu cita en ${clin} ha sido confirmada en el calendario del consultorio para el ${fechaTexto} en el horario de ${horarioTexto} con la ${doc}.\n\nTe recordaremos 1 día antes y 1 hora antes de tu cita por este mismo medio (SMS y WhatsApp).\n\n📍 Ubicación: ${dir}\n📞 Dudas o cambios: ${tel}.`;
}

export function generarMensajeRecordatorio24h(
  nombre: string,
  fechaTexto: string,
  horarioTexto: string,
  clinica?: InfoClinicaMensaje
): string {
  const doc = clinica?.nombreDoctora || "L.N. Claudia Itzel Chávez García";
  const clin = clinica?.nombreClinica || "ISOS Nutrición Clínica";
  const ciud = clinica?.ciudad || "San José del Cabo";
  const tel = clinica?.telefonoWhatsapp || "624-122-0715";

  return `¡Hola ${nombre}! Te recordamos tu cita de nutrición el día de mañana (${fechaTexto}) en el horario de ${horarioTexto} en ${clin} con la ${doc}.\n\nPor favor llega 5 minutos antes. Si necesitas reprogramar, comunícate al ${tel}.\n📍 Ubicación: ${ciud}.`;
}

export function generarMensajeRecordatorio1h(
  nombre: string,
  horarioTexto: string,
  clinica?: InfoClinicaMensaje
): string {
  const doc = clinica?.nombreDoctora || "L.N. Claudia Itzel Chávez García";
  const clin = clinica?.nombreClinica || "ISOS Nutrición Clínica";
  const ciud = clinica?.ciudad || "San José del Cabo";
  const tel = clinica?.telefonoWhatsapp || "624-122-0715";

  return `¡Hola ${nombre}! Tu cita en ${clin} es hoy en 1 hora (a las ${horarioTexto}) con la ${doc}.\n\n¡Te esperamos en el consultorio!\n📍 Ubicación: ${ciud}. Dudas al ${tel}.`;
}

export function crearLinkWhatsApp(telefono: string, mensaje: string): string {
  const numero = formatearTelefonoWhatsApp(telefono);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function crearLinkSMS(telefono: string, mensaje: string): string {
  const numero = formatearTelefonoSMS(telefono);
  return `sms:${numero}?body=${encodeURIComponent(mensaje)}`;
}
