import { NextRequest, NextResponse } from "next/server";

// Endpoint para verificación del Webhook de WhatsApp (Meta Cloud API o proveedores similares)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "nutri_webhook_token_secreto";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Token de verificación no coincide." }, { status: 403 });
}

// Endpoint para recibir mensajes entrantes y responder como Asistente Virtual
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Estructura básica de mensaje entrante
    console.log("Mensaje de WhatsApp recibido:", JSON.stringify(payload, null, 2));

    // Lógica para chatbot:
    // 1. Si el usuario pregunta "¿dónde están?" -> Responder con la dirección del consultorio.
    // 2. Si pregunta por "citas" o "precios" -> Responder con el costo de la consulta de 35 min y el link a /agendar.
    // 3. Si confirma cita -> Enviar confirmación interactiva.

    return NextResponse.json({
      status: "received",
      respuestaAsistente: "¡Hola! Soy la asistente virtual del consultorio de nutrición. Puedes agendar tu consulta de 35 minutos directamente aquí: https://tu-dominio.com/agendar",
    });
  } catch (error) {
    console.error("Error procesando webhook WhatsApp:", error);
    return NextResponse.json({ error: "Error interno del webhook." }, { status: 500 });
  }
}
