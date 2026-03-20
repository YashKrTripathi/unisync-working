import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  buildContactMailTemplates,
  DEFAULT_CONTACT_MAIL_TEMPLATES,
} from "@/lib/contact-mail-templates";

const CONTACT_FORM_SCRIPT_URL = process.env.CONTACT_FORM_APPS_SCRIPT_URL;
const RELAY_TIMEOUT_MS = 12000;
const RELAY_MAX_ATTEMPTS = 2;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postToMailRelay(payload) {
  let lastError = null;

  for (let attempt = 1; attempt <= RELAY_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RELAY_TIMEOUT_MS);

    try {
      const upstream = await fetch(CONTACT_FORM_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return upstream;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;

      if (attempt < RELAY_MAX_ATTEMPTS) {
        await wait(600 * attempt);
      }
    }
  }

  throw lastError;
}

async function getMailTemplateContent() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return DEFAULT_CONTACT_MAIL_TEMPLATES;
  }

  try {
    const savedContent = await fetchQuery(api.siteContent.getPageContent, {
      pageId: "contact_mail_templates",
    });

    return savedContent || DEFAULT_CONTACT_MAIL_TEMPLATES;
  } catch {
    return DEFAULT_CONTACT_MAIL_TEMPLATES;
  }
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

    const mailTemplateContent = await getMailTemplateContent();
    const renderedMail = buildContactMailTemplates(mailTemplateContent, payload);

    let upstream;

    try {
      upstream = await postToMailRelay({
        ...payload,
        ...renderedMail,
      });
    } catch (error) {
      const isAbort = error?.name === "AbortError";
      const isTimeout = error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT" || isAbort;

      return NextResponse.json(
        {
          error: isTimeout
            ? "The Gmail relay took too long to respond. Please try again in a moment."
            : "Could not reach the Gmail relay right now. Please try again shortly.",
        },
        { status: 504 }
      );
    }

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
