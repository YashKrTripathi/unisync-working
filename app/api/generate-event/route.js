import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ─── System prompt (shared across all providers) ────────────────────────────
const SYSTEM_PROMPT = `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"`;

// ─── Clean AI response text to valid JSON ───────────────────────────────────
function cleanJsonResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```\n?/g, "");
  }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned);
}

// ─── Provider 1: Google Gemini (primary) ────────────────────────────────────
async function generateWithGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\nUser's event idea: ${prompt}`
  );
  const response = await result.response;
  return cleanJsonResponse(response.text());
}

// ─── Provider 2: Groq (fast fallback) ───────────────────────────────────────
async function generateWithGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Generate event details for: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return cleanJsonResponse(data.choices[0].message.content);
}

// ─── Provider 3: OpenRouter (premium fallback) ──────────────────────────────
async function generateWithOpenRouter(prompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Generate event details for: ${prompt}` },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return cleanJsonResponse(data.choices[0].message.content);
}

// ─── Provider chain with automatic fallback ─────────────────────────────────
const PROVIDERS = [
  { name: "Gemini", fn: generateWithGemini, keyEnv: "GEMINI_API_KEY" },
  { name: "Groq", fn: generateWithGroq, keyEnv: "GROQ_API_KEY" },
  { name: "OpenRouter", fn: generateWithOpenRouter, keyEnv: "OPENROUTER_API_KEY" },
];

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Try each provider in order, fall through on failure
    const errors = [];
    for (const provider of PROVIDERS) {
      if (!process.env[provider.keyEnv]) continue;

      try {
        console.log(`[AI] Trying ${provider.name}...`);
        const eventData = await provider.fn(prompt);

        if (!eventData.title || !eventData.description || !eventData.category) {
          throw new Error("Invalid response structure from AI");
        }

        console.log(`[AI] Success with ${provider.name}`);
        return NextResponse.json({ ...eventData, _provider: provider.name });
      } catch (err) {
        console.warn(`[AI] ${provider.name} failed:`, err.message);
        errors.push(`${provider.name}: ${err.message}`);
      }
    }

    // All providers failed or none configured
    const configuredCount = PROVIDERS.filter((p) => process.env[p.keyEnv]).length;
    if (configuredCount === 0) {
      return NextResponse.json(
        {
          error:
            "No AI provider configured. Add GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY to .env.local",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: `All AI providers failed: ${errors.join("; ")}` },
      { status: 502 }
    );
  } catch (error) {
    console.error("Error generating event:", error);
    return NextResponse.json(
      { error: "Failed to generate event: " + error.message },
      { status: 500 }
    );
  }
}
