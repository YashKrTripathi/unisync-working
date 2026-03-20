import { NextResponse } from "next/server";

const CONTACT_FORM_SCRIPT_URL = process.env.CONTACT_FORM_APPS_SCRIPT_URL;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const { name, email, topic, message } = await req.json();

    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { error: "All contact form fields are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!CONTACT_FORM_SCRIPT_URL) {
      return NextResponse.json(
        { error: "CONTACT_FORM_APPS_SCRIPT_URL is not configured." },
        { status: 500 }
      );
    }

    const payload = {
      name,
      email,
      topic,
      message,
      source: "unisync-contact-form",
      submittedAt: new Date().toISOString(),
    };

    const upstream = await fetch(CONTACT_FORM_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawText = await upstream.text();
    let data = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = { raw: rawText };
    }

    if (!upstream.ok || data?.ok === false) {
      return NextResponse.json(
        {
          error: data?.error || "The Google Apps Script mail relay rejected the request.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Contact message forwarded successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to process contact form submission.",
      },
      { status: 500 }
    );
  }
}
