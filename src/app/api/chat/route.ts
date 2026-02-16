import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  stepCountIs,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { tools } from "@/lib/ai/tools";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
