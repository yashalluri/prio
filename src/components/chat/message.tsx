"use client";

import type { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { ToolCall } from "./tool-call";
import { Zap, User } from "lucide-react";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
          <Zap className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] space-y-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-foreground"
                )}
              >
                <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                  {part.text}
                </div>
              </div>
            );
          }

          if (part.type.startsWith("tool-")) {
            const toolPart = part as Record<string, unknown>;
            const toolName = (toolPart.toolName as string) ?? "unknown";
            const args = (toolPart.input as Record<string, unknown>) ??
              (toolPart.args as Record<string, unknown>) ?? {};
            const state = toolPart.state as string;
            const output = toolPart.output as unknown;

            return (
              <ToolCall
                key={toolPart.toolCallId as string ?? i}
                toolName={toolName}
                args={args}
                result={state === "result" ? output : undefined}
                state={state === "result" ? "result" : "call"}
              />
            );
          }

          return null;
        })}
      </div>
      {isUser && (
        <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-lg">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}
