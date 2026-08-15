import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const FORMAT_RULES =
  `\n\nFormatting rules: no markdown headers (#), no bullet or dash lists, no backticks. ` +
  `Start each section with its label in **bold** on its own line, then 2-4 terse sentences below it in plain text. ` +
  `Use **bold** sparingly elsewhere only for key numbers or exercise names. Separate sections with a blank line.`;

const PROMPTS = {
  day: (label, log) =>
    `Analyze this single workout session I just completed.\n\n` +
    `Workout Log (${label}):\n${log}\n\n` +
    `Please provide a short analysis covering:\n` +
    `- Overall volume and intensity of this session.\n` +
    `- Exercise order efficiency (did exercise selection or order cause early fatigue?).\n` +
    `- Quick form/recovery tips or immediate adjustments for next time.` +
    FORMAT_RULES,

  week: (label, log) =>
    `Analyze my workout log for this past week.\n\n` +
    `Weekly Log (${label}):\n${log}\n\n` +
    `Please provide a concise analysis covering:\n` +
    `- Push vs. Pull & Upper vs. Lower Balance: Are any muscle groups over- or under-trained?\n` +
    `- Volume & Fatigue Check: Did my strength drop off significantly across sets or sessions?\n` +
    `- Action Plan: 2-3 actionable tweaks for next week to maintain progressive overload.` +
    FORMAT_RULES,

  month: (label, log) =>
    `Analyze my workout logs from this past month.\n\n` +
    `Monthly Log (${label}):\n${log}\n\n` +
    `Please provide a short, high-level analysis covering:\n` +
    `- Strength Progression: Clear callouts of exercises where weights/reps increased vs. where I plateaued.\n` +
    `- Structural Balance & Gaps: Muscle balance ratio (push/pull/legs) and any missing movement patterns.\n` +
    `- Adaptation Focus: Whether my training currently favors strength, hypertrophy, or muscular endurance based on rep ranges.\n` +
    `- Realistic Calorie Burn Estimate: Total estimated active calorie burn across all sessions.` +
    FORMAT_RULES,
};

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
  const buildPrompt = PROMPTS[scope] || PROMPTS.day;

  try {
    const { text } = await generateText({
      model: openrouter("deepseek/deepseek-v4-flash"),
      temperature: 0.3,
      prompt: buildPrompt(label, log),
    });

    return Response.json({ summary: text });
  } catch (e) {
    return Response.json({ error: e.message || "Failed to generate summary." }, { status: 502 });
  }
}
