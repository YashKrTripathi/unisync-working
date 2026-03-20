import { action } from "./_generated/server";
import { v } from "convex/values";

export const beautifyEvent = action({
  args: {
    prompt: v.string(),
    eventDetails: v.any(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const { prompt, eventDetails } = args;

    const systemPrompt = `You are a world-class UI/UX design assistant specializing in event branding.
Your goal is to take a user's prompt and event data, and return a JSON object representing the "beautified" visual theme and content updates.

Event Title: ${eventDetails.title}
Event Category: ${eventDetails.category}
Current Description: ${eventDetails.description}

USER PROMPT: "${prompt}"

Return ONLY a JSON object with this exact structure:
{
  "themeColor": "HEX_COLOR (vibrant, matching prompt)",
  "primaryColor": "HEX_COLOR",
  "secondaryColor": "HEX_COLOR",
  "fontFamily": "sans | serif | mono",
  "layoutVariant": "modern | sleek | brutalist | elegant",
  "customCss": "Optional CSS string for micro-animations or layout tweaks",
  "heroBlurb": "A compelling, generated 1-2 sentence hero hook",
  "updates": {
    "description": "Enhanced, professionally written description",
    "whyAttend": ["Compelling reason 1", "Compelling reason 2", "Compelling reason 3"],
    "agenda": [
      { "time": "9:00 AM", "title": "Welcome", "description": "Brief intro" },
      { "time": "10:30 AM", "title": "Main Session", "description": "Detailed talk" }
    ],
    "faqs": [
      { "question": "Who can join?", "answer": "All students are welcome!" },
      { "question": "Is it free?", "answer": "Yes, completely free." }
    ]
  }
}

STYLING GUIDELINES BY CATEGORY:
- Competition: High-energy, bold gradients (e.g., Orange #ff6b1a), dark backgrounds, "brutalist" or "sleek" layouts. Focus on prize pools and timelines.
- Workshop: Practical, interactive feel, clean "modern" layout, accents like Emerald or Cyan. Focus on curriculum and "what tools to bring".
- Seminar: Premium, professional, "elegant" or "sleek" layout. Use serif fonts for a scholarly/luxury feel. Focus on speaker authority and networking.

The "updates" object should contain realistic, high-quality content based on the event title and category.
Do not include any markdown or commentary. Only the raw JSON.`;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://unisync.com",
          "X-Title": "UniSync AI Studio",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Beautify this event based on: ${prompt}` }
          ],
          response_format: { type: "json_object" }
        }),
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Generation failed:", error);
      throw new Error("Failed to generate AI beautification: " + error.message);
    }
  },
});
