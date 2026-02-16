import { prisma } from "@/lib/db";
import { generateDailyDigest } from "@/lib/ai/digest";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({ select: { id: true } });

  if (users.length === 0) {
    return Response.json({ message: "No users found", generated: 0 });
  }

  const digest = generateDailyDigest();
  const results: { userId: string; briefId: string }[] = [];

  const risksSummary = digest.risks
    .map((r) => `- **${r.severity.toUpperCase()}**: ${r.title} — ${r.detail}`)
    .join("\n");

  const actionsSummary = digest.actions
    .map((a, i) => `${i + 1}. **${a.verb}** ${a.action}`)
    .join("\n");

  const winsSummary = digest.wins
    .map((w) => `- ${w.title} (${w.detail})`)
    .join("\n");

  const markdown = [
    `**Status: ${digest.overallStatus.toUpperCase()}** — ${digest.statusLine}`,
    "",
    `### Risks`,
    risksSummary,
    "",
    `### Recommended Actions`,
    actionsSummary,
    "",
    digest.wins.length > 0 ? `### Wins\n${winsSummary}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const weekLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  for (const user of users) {
    const brief = await prisma.brief.create({
      data: {
        userId: user.id,
        title: `Daily Digest — ${weekLabel}`,
        content: {
          sections: [{ heading: "Daily Digest", body: markdown }],
        },
        status: "DRAFT",
      },
    });

    results.push({ userId: user.id, briefId: brief.id });
  }

  return Response.json({
    message: `Generated ${results.length} digest(s)`,
    generated: results.length,
    results,
  });
}
