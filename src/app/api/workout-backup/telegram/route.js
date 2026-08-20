export async function POST(req) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ error: "Telegram backup is not configured." }, { status: 500 });
  }

  const { idea, log } = await req.json();
  if (!log || Object.keys(log).length === 0) {
    return Response.json({ error: "Nothing logged yet." }, { status: 400 });
  }

  const now = new Date();
  const filename = `workout-log-backup-${now.toISOString().slice(0, 10)}.json`;
  const content = JSON.stringify({ exported_at: now.toISOString(), idea, log }, null, 2);

  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("document", new Blob([content], { type: "application/json" }), filename);
  form.append("caption", `Workout log backup — ${filename}`);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return Response.json({ error: data.description || "Telegram API error." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message || "Failed to reach Telegram." }, { status: 502 });
  }
}
