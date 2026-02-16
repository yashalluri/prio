"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./message";
import { ScrollArea } from "@/components/ui/scroll-area";

const promptStarters = [
  {
    label: "Prioritize my backlog",
    prompt:
      "Analyze my current backlog and help me prioritize using the RICE framework. What should we focus on this sprint?",
  },
  {
    label: "Summarize recent feedback",
    prompt:
      "Search Slack for recent customer feedback and summarize the key themes. What are customers asking for most?",
  },
  {
    label: "Draft a PRD",
    prompt:
      "Help me draft a PRD for our most requested feature. Pull in relevant context from our docs and issues.",
  },
  {
    label: "Sprint health check",
    prompt:
      "Give me an overview of our current sprint. What's on track, what's blocked, and what needs attention?",
  },
];

const transport = new DefaultChatTransport({
  api: "/api/chat",
});

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({ transport });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
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
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="text-muted-foreground size-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">
                    Prio is thinking...
                  </span>
                </div>
              )}
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
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="size-8 shrink-0 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Prio uses mock data for now. Connect your tools in Settings for real
          insights.
        </p>
      </div>
    </div>
  );
}
