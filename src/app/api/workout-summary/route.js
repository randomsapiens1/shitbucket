import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export async function POST(req) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 });
  }

  const { scope, label, log } = await req.json();
  if (!log || !log.trim()) {
    return Response.json({ error: "Nothing logged for this period yet." }, { status: 400 });
  }

  const openrouter = createOpenRouter({ apiKey });

  try {
    const { text } = await generateText({
      model: openrouter("deepseek/deepseek-v4-flash"),
      temperature: 0.3,
      prompt:
        `You're reviewing a lifter's ${scope} log for ${label}.\n\n` +
        `Raw log (date: exercise sets):\n${log}\n\n` +
        `Rewrite this as a tight, specific breakdown - NOT a paragraph, no fluff, no commentary. ` +
        `One line per exercise, restating the exact sets and reps from the log verbatim (never invent or round numbers). ` +
        `If the same exercise appears on multiple days, list it once per day. ` +
        `After the exercise lines, add one final line estimating total calories burned across the whole ${scope}, ` +
        `based on typical strength-training energy expenditure - clearly mark it as a rough estimate.\n\n` +
        `Use exactly this format, nothing else:\n` +
        `<exercise>: <set1>, <set2>, ...\n` +
        `<exercise>: <set1>, <set2>, ...\n` +
        `...\n` +
        `est. calories burned: ~<number> kcal (rough estimate)`,
    });

    return Response.json({ summary: text });
  } catch (e) {
    return Response.json({ error: e.message || "Failed to generate summary." }, { status: 502 });
  }
}
