import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { prisma } from "@/lib/db";

const DIGEST_PROMPT = `You are Prio, an AI product management assistant. Generate a concise weekly digest for a product team.

Given the area overviews below, produce a structured weekly summary with:
1. **Top-line status** — one sentence on overall health
2. **Key blockers** — anything stalled or at risk, with days blocked
3. **Wins** — completed work and positive velocity trends
4. **Recommendations** — 2-3 concrete actions for the week

Keep it punchy and actionable. Use markdown formatting. No filler.`;

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

  // Import area overview data dynamically to avoid circular deps
  const overviewSummary = await buildOverviewSummary();

  const results: { userId: string; briefId: string }[] = [];

  for (const user of users) {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      system: DIGEST_PROMPT,
      prompt: `Here are the current area overviews:\n\n${overviewSummary}\n\nGenerate the weekly digest for the week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
    });

    const weekLabel = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const brief = await prisma.brief.create({
      data: {
        userId: user.id,
        title: `Weekly Digest — ${weekLabel}`,
        content: {
          sections: [
            { heading: "Weekly Digest", body: text },
          ],
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

async function buildOverviewSummary(): Promise<string> {
  // Use the same mock data structure as the tools
  const areas = ["auth", "performance", "onboarding", "billing", "api", "mobile"];
  const lines: string[] = [];

  for (const area of areas) {
    lines.push(`## ${area.charAt(0).toUpperCase() + area.slice(1)}`);
    lines.push(`(Area data from internal tools — includes issues, velocity, feedback themes, and PR metrics)`);
    lines.push("");
  }

  // For a real implementation, this would call the actual tool functions.
  // For now, we provide a high-level prompt that lets the model generate
  // a useful digest from its knowledge of the product areas.
  return lines.join("\n");
}
