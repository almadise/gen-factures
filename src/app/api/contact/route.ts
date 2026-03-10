import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    // Validation rapide
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    // Ici, vous pourriez intégrer l'envoi d'email réel (Resend, SendGrid, etc.)
    console.log("Nouveau message de :", name, email, message);

    return NextResponse.json({
      success: "Votre message a été envoyé avec succès !",
    });
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }
}
