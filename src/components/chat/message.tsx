"use client";

import { useState } from "react";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { ToolCall } from "./tool-call";
import { Zap, User, Copy, Check } from "lucide-react";

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-muted/50 border-border/50 my-3 overflow-hidden rounded-lg border">
      <div className="border-border/50 flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          {copied ? (
            <Check className="size-3" />
          ) : (
            <Copy className="size-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="block font-mono text-xs">{code}</code>
      </pre>
    </div>
  );
}

export function ChatMessage({
  message,
  isStreaming = false,
}: {
  message: UIMessage;
  isStreaming?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopyMessage = () => {
    const text = message.parts
      .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      .map((p) => p.text)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textParts = message.parts.filter((p) => p.type === "text");
  const lastTextIndex = message.parts.lastIndexOf(textParts[textParts.length - 1]);

  return (
    <div
      className={cn(
        "group flex gap-3 py-4",
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
          "min-w-0 max-w-[85%] space-y-2",
          isUser ? "items-end" : "items-start"
        )}
        style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            if (isUser) {
              return (
                <div
                  key={i}
                  className="bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm leading-relaxed"
                >
                  {part.text}
                </div>
              );
            }

            const isLastText = !isUser && isStreaming && i === lastTextIndex;

            // During active streaming, render plain text with whitespace
            // to avoid expensive markdown re-parsing on every token
            if (isLastText) {
              return (
                <div
                  key={i}
                  className="text-foreground streaming-cursor whitespace-pre-wrap text-sm leading-relaxed"
                >
                  {part.text}
                </div>
              );
            }

            return (
              <div
                key={i}
                className="text-foreground text-sm leading-relaxed"
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="text-foreground font-semibold">
                        {children}
                      </strong>
                    ),
                    h1: ({ children }) => (
                      <h1 className="font-heading mb-2 mt-4 text-base font-bold first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-heading mb-2 mt-4 text-sm font-bold first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-heading mb-1.5 mt-3 text-sm font-semibold first:mt-0">
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-3 ml-4 list-disc space-y-1 last:mb-0">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-3 ml-4 list-decimal space-y-1 last:mb-0">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm leading-relaxed">{children}</li>
                    ),
                    table: ({ children }) => (
                      <div className="border-border/50 my-3 overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50 border-border/50 border-b">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-border/30 divide-y">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => (
                      <th className="text-muted-foreground whitespace-nowrap px-3 py-2 text-left text-xs font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-sm">{children}</td>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                            {children}
                          </code>
                        );
                      }
                      const language = className?.replace("language-", "") || "";
                      const codeString = String(children).replace(/\n$/, "");
                      return <CodeBlock language={language} code={codeString} />;
                    },
                    pre: ({ children }) => <>{children}</>,
                    hr: () => (
                      <hr className="border-border/50 my-4" />
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary/60"
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-primary/30 my-3 border-l-2 pl-3 text-sm italic">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {part.text}
                </ReactMarkdown>
              </div>
            );
          }

          if (part.type.startsWith("tool-")) {
            const toolPart = part as Record<string, unknown>;
            const toolName = part.type.replace(/^tool-/, "");
            const args = (toolPart.input as Record<string, unknown>) ?? {};
            const state = toolPart.state as string;
            const output = toolPart.output as unknown;

            return (
              <ToolCall
                key={(toolPart.toolCallId as string) ?? i}
                toolName={toolName}
                args={args}
                result={state === "result" ? output : undefined}
                state={state === "result" ? "result" : "call"}
              />
            );
          }

          return null;
        })}
        {!isUser && (
          <button
            type="button"
            onClick={handleCopyMessage}
            className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      {isUser && (
        <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-lg">
          <User className="size-4" />
        </div>
      )}
    </div>
  );
}
