import { NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildPrompt(task, prompt) {
  if (task === "polishDescription") {
    return `You are a website copywriter for campus events. Rewrite the user's rough event description into polished, attractive website copy.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No markdown. No line breaks in string values.

Return this exact JSON structure:
{
  "description": "Polished event description in a single paragraph"
}

User's rough event description: ${prompt}

Rules:
- Return ONLY the JSON object
- Keep it to 2-4 sentences
- Make it polished, clear, and appealing for an event listing
- Preserve the user's original meaning and likely intent
- Do not invent specific facts unless strongly implied by the prompt
- Keep it on a single line with spaces instead of line breaks`;
  }

  return `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

User's event idea: ${prompt}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"`;
}

function cleanJsonText(text) {
  let cleanedText = text.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/```\n?/g, "");
  }
  return cleanedText.trim();
}

export async function POST(req) {
  try {
    const { prompt, task = "generateEvent" } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || "qwen/qwen-2.5-72b-instruct";

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY in environment configuration" },
        { status: 500 }
      );
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "UniSync Event Generator",
      },
      body: JSON.stringify({
        model,
        temperature: task === "polishDescription" ? 0.6 : 0.7,
        messages: [
          {
            role: "user",
            content: buildPrompt(task, prompt),
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        `OpenRouter request failed with status ${response.status}`;

      return NextResponse.json(
        { error: providerMessage },
        { status: response.status }
      );
    }

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        { error: "OpenRouter returned an empty response" },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(cleanJsonText(text));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating event:", error);

    return NextResponse.json(
      { error: `Failed to generate event: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
