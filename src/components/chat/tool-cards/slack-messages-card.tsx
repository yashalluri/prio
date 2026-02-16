"use client";

import { CardList, ExtLink } from "./shared";

interface SlackMessage {
  channel: string;
  author: string;
  timestamp: string;
  text: string;
  reactions: Record<string, number>;
  thread?: { author: string; text: string; timestamp: string }[];
  url: string;
}

const emojiMap: Record<string, string> = {
  "+1": "\uD83D\uDC4D",
  eyes: "\uD83D\uDC40",
  tada: "\uD83C\uDF89",
  rocket: "\uD83D\uDE80",
  fire: "\uD83D\uDD25",
  pray: "\uD83D\uDE4F",
  disappointed: "\uD83D\uDE1E",
  cry: "\uD83D\uDE22",
  warning: "\u26A0\uFE0F",
  bug: "\uD83D\uDC1B",
  hourglass: "\u231B",
  white_check_mark: "\u2705",
  noted: "\uD83D\uDCDD",
  chart_with_upwards_trend: "\uD83D\uDCC8",
  chart_with_downwards_trend: "\uD83D\uDCC9",
  rotating_light: "\uD83D\uDEA8",
};

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function SlackMessagesCard({ data }: { data: unknown }) {
  const messages = data as SlackMessage[];
  if (!messages?.length)
    return <p className="text-muted-foreground text-xs">No messages found.</p>;

  return (
    <CardList>
      <div className="divide-border/20 divide-y">
        {messages.map((msg, i) => (
          <div key={i} className="py-2 first:pt-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px]">
                {msg.channel}
              </span>
              <span className="text-foreground text-xs font-medium">
                {msg.author}
              </span>
              <span className="text-muted-foreground ml-auto text-[10px]">
                {formatDate(msg.timestamp)}
              </span>
            </div>
            <ExtLink
              href={msg.url}
              className="text-foreground text-xs no-underline hover:underline"
            >
              <p className="line-clamp-2 text-xs leading-relaxed">
                {msg.text}
              </p>
            </ExtLink>
            {Object.keys(msg.reactions).length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {Object.entries(msg.reactions).map(([emoji, count]) => (
                  <span
                    key={emoji}
                    className="bg-muted/50 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px]"
                  >
                    {emojiMap[emoji] ?? `:${emoji}:`}
                    <span className="text-muted-foreground font-mono">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            )}
            {msg.thread && msg.thread.length > 0 && (
              <p className="text-muted-foreground mt-0.5 text-[10px]">
                {msg.thread.length} repl
                {msg.thread.length === 1 ? "y" : "ies"} in thread
              </p>
            )}
          </div>
        ))}
      </div>
    </CardList>
  );
}
