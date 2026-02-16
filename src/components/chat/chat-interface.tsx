"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Sparkles, Square, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./message";
import { ScrollArea } from "@/components/ui/scroll-area";

const promptStarters = [
  {
    label: "Uncover the hidden blockers",
    prompt:
      "What's really blocking our Q1 goals right now? Search across Linear, Slack, and Notion to find the root causes. I want to see the full chain of dependencies — not just what's blocked, but WHY it's blocked and what downstream impact that's having on revenue and timelines.",
  },
  {
    label: "Who's the biggest risk on the team?",
    prompt:
      "Which team member is the biggest delivery risk right now? Check issue assignments in Linear, look for concerning signals in Slack, and cross-reference with Notion meeting notes. Show me the evidence chain.",
  },
  {
    label: "Revenue impact analysis",
    prompt:
      "How much revenue is at risk right now due to engineering delays? Cross-reference our sales pipeline discussions in Slack with the actual state of engineering work in Linear, and check Notion for any context on priorities. I need hard numbers.",
  },
  {
    label: "Generate Q1 leadership brief",
    prompt:
      "Draft a comprehensive Q1 leadership brief. Pull data from all sources — Linear for engineering status, Slack for team signals and customer feedback, and Notion for strategic context. Flag the top risks with evidence, quantify impact, and recommend specific actions. Save it as a brief.",
  },
];

interface ChatInterfaceProps {
  conversationId?: string;
  initialMessages?: UIMessage[];
}

export function ChatInterface({
  conversationId: initialConvId,
  initialMessages,
}: ChatInterfaceProps) {
  const router = useRouter();
  const [convId, setConvId] = useState(initialConvId);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { conversationId: convId },
      }),
    [convId]
  );

  const { messages, sendMessage, status, stop, error } = useChat({
    id: convId,
    transport,
    messages: initialMessages,
  });

  const scrollEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevStatus = useRef(status);
  const pendingMessageRef = useRef<string | null>(null);
  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    // Use instant scroll during streaming to avoid animation queue buildup
    scrollEndRef.current?.scrollIntoView({
      behavior: isLoading ? "instant" : "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save messages when stream completes
  useEffect(() => {
    if (prevStatus.current === "streaming" && status === "ready" && convId && messages.length > 0) {
      fetch(`/api/conversations/${convId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      }).catch(() => {});
    }
    prevStatus.current = status;
  }, [status, convId, messages]);

  // Send pending message after transport rebuilds with new convId
  useEffect(() => {
    if (convId && pendingMessageRef.current) {
      const text = pendingMessageRef.current;
      pendingMessageRef.current = null;
      sendMessage({ text });
    }
  }, [convId, sendMessage]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");

    if (!convId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: text.slice(0, 80) }),
        });
        const { data } = await res.json();
        pendingMessageRef.current = text;
        setConvId(data.id);
        // Use history.replaceState to update URL without triggering
        // a Next.js navigation that would unmount this component
        // and lose the pendingMessageRef
        window.history.replaceState(null, "", `/chat/${data.id}`);
        return;
      } catch {
        // Fall back to ephemeral chat
      }
    }

    await sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-2xl">
                <Sparkles className="text-primary size-6" />
              </div>
              <h2 className="font-heading text-xl font-semibold">
                What can I help you with?
              </h2>
              <p className="text-muted-foreground max-w-md text-center text-sm">
                I can analyze your backlog, summarize feedback, draft PRDs, and
                help you decide what to build next.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {promptStarters.map((starter) => (
                <button
                  key={starter.label}
                  type="button"
                  onClick={() => handleSend(starter.prompt)}
                  className="hover:bg-accent border-border/50 rounded-xl border px-4 py-3 text-left text-sm transition-colors"
                >
                  <span className="font-medium">{starter.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={
                  status === "streaming" &&
                  index === messages.length - 1 &&
                  message.role === "assistant"
                }
              />
            ))}
            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-2 py-4">
                  <Brain className="text-primary size-4 animate-pulse" />
                  <span className="text-muted-foreground text-sm">
                    Reasoning...
                  </span>
                </div>
              )}
            {status === "error" && (
              <div className="border-destructive/50 bg-destructive/10 my-2 flex items-center gap-3 rounded-lg border px-4 py-3">
                <span className="text-destructive flex-1 text-sm">
                  {error?.message || "Something went wrong. Please try again."}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const lastUserMsg = [...messages]
                      .reverse()
                      .find((m) => m.role === "user");
                    const text = lastUserMsg?.parts
                      .filter(
                        (p): p is Extract<typeof p, { type: "text" }> =>
                          p.type === "text"
                      )
                      .map((p) => p.text)
                      .join(" ");
                    if (text) handleSend(text);
                  }}
                >
                  Retry
                </Button>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="bg-muted/50 border-border/50 mx-auto flex max-w-3xl items-end gap-2 rounded-xl border p-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Prio anything about your product..."
            className="placeholder:text-muted-foreground min-h-[40px] max-h-[200px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
            }}
          />
          <Button
            type={isLoading ? "button" : "submit"}
            size="icon"
            variant={isLoading ? "outline" : "default"}
            disabled={!isLoading && !input.trim()}
            onClick={isLoading ? () => stop() : undefined}
            className="size-8 shrink-0 rounded-lg"
          >
            {isLoading ? (
              <Square className="size-3.5" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Powered by Claude Opus 4.6 — Adaptive reasoning across your product
          stack.
        </p>
      </div>
    </div>
  );
}
