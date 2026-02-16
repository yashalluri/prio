import { prisma } from "@/lib/db";
import { GitHubClient } from "./github";

export async function getGitHubClient(
  userId: string
): Promise<GitHubClient | null> {
  const connection = await prisma.connection.findUnique({
    where: { userId_provider: { userId, provider: "GITHUB" } },
    select: { accessToken: true },
  });

  if (!connection) return null;
  return new GitHubClient(connection.accessToken);
}
