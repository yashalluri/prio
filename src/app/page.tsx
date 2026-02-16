import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_LINES = [
  { prompt: true, text: "What's blocking the SSO launch?" },
  {
    prompt: false,
    text: "3 issues stalled — all trace back to missing Okta SAML credentials (submitted Feb 3, no response in 12 days). This is the single bottleneck for the entire auth epic.",
  },
  { prompt: true, text: "Who's overloaded this sprint?" },
  {
    prompt: false,
    text: "Alex Kim: 6 active issues across perf + mobile (31 pts). Next closest is Sarah Chen at 18 pts. Recommend redistributing PRD-167 and PRD-171.",
  },
  { prompt: true, text: "Generate a RICE prioritization for Q1 backlog" },
  {
    prompt: false,
    text: "Brief saved — Q1 RICE Prioritization. Top 3: SSO (score 48), API rate limiting (36), mobile offline (28).",
  },
];

const INTEGRATIONS = [
  { name: "Linear", desc: "Issues, sprints, roadmaps" },
  { name: "Slack", desc: "Feedback, decisions, threads" },
  { name: "Notion", desc: "PRDs, specs, meeting notes" },
  { name: "GitHub", desc: "Repos, PRs, commits" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.06_0.005_265)]">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-[oklch(0.6_0.2_265)]">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="font-heading text-sm font-semibold tracking-wide text-white/90">
            prio
          </span>
        </div>
        <Link
          href="/login"
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          Sign in
        </Link>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero — left-aligned, editorial */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-24 pb-20">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[oklch(0.6_0.2_265)]">
            AI-native product management
          </p>
          <h1 className="font-heading max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Stop guessing.
            <br />
            Start shipping what matters.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/45">
            Prio connects Linear, Slack, Notion, and GitHub into one
            conversational interface. Ask a question, get a cited answer with
            data from every tool your team uses.
          </p>
          <div className="mt-10">
            <Button
              size="lg"
              className="bg-[oklch(0.6_0.2_265)] text-white hover:bg-[oklch(0.55_0.2_265)]"
              asChild
            >
              <Link href="/login">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Demo conversation — the product IS the marketing */}
        <section className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <p className="mb-8 text-xs font-medium uppercase tracking-widest text-white/30">
              How it works
            </p>
            <div className="space-y-5">
              {DEMO_LINES.map((line, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 shrink-0 pt-0.5 text-right">
                    <span
                      className={`text-xs font-medium ${line.prompt ? "text-white/25" : "text-[oklch(0.6_0.2_265)]/60"}`}
                    >
                      {line.prompt ? "you" : "prio"}
                    </span>
                  </div>
                  <p
                    className={`max-w-xl text-sm leading-relaxed ${
                      line.prompt
                        ? "font-medium text-white/80"
                        : "text-white/45"
                    }`}
                  >
                    {line.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations — minimal strip */}
        <section className="mx-auto w-full max-w-5xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-white/30">
            Connects to
          </p>
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-4">
            {INTEGRATIONS.map((item) => (
              <div key={item.name}>
                <p className="text-sm font-medium text-white/80">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-white/30">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-24">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-8 py-12">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Your backlog has answers.
              <br />
              <span className="text-white/40">Prio finds them.</span>
            </h2>
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-[oklch(0.6_0.2_265)] text-white hover:bg-[oklch(0.55_0.2_265)]"
                asChild
              >
                <Link href="/login">
                  Try Prio
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-white/20">
          <span>prio</span>
          <a
            href="https://github.com/yashalluri/prio"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/50"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
