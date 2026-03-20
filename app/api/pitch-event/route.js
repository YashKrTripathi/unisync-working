import { NextResponse } from "next/server";

const CONTACT_FORM_SCRIPT_URL = process.env.CONTACT_FORM_APPS_SCRIPT_URL;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const {
      fullName,
      email,
      organisation,
      audienceType,
      eventTitle,
      eventFormat,
      expectedAudience,
      proposedWindow,
      venuePreference,
      pitch,
      supportNeeded,
    } = await req.json();

    if (!fullName || !email || !eventTitle || !eventFormat || !expectedAudience || !proposedWindow || !pitch) {
      return NextResponse.json(
        { error: "Please complete all required event pitch fields." },
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

    const message = [
      `Pitch type: ${audienceType || "not specified"}`,
      `Organisation: ${organisation || "Not provided"}`,
      `Event title: ${eventTitle}`,
      `Format: ${eventFormat}`,
      `Expected audience: ${expectedAudience}`,
      `Date window: ${proposedWindow}`,
      `Venue preference: ${venuePreference || "Not provided"}`,
      "",
      "Pitch summary:",
      pitch,
      "",
      "Support needed:",
      supportNeeded || "Not provided",
    ].join("\n");

    const payload = {
      name: fullName,
      email,
      topic: `New Event Pitch - ${eventTitle}`,
      message,
      source: "unisync-event-pitch",
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
          error: data?.error || "The event pitch relay rejected the request.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Event pitch forwarded successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "Failed to process event pitch submission.",
      },
      { status: 500 }
    );
  }
}
