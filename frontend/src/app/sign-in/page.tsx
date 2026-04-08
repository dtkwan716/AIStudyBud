"use client"

import { signIn } from "next-auth/react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_38%),linear-gradient(180deg,_#f7f1e8_0%,_#efe7db_100%)] p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[32px] border border-border bg-surface shadow-[var(--shadow-soft)] md:min-h-[calc(100vh-3rem)]">
        <section className="hidden w-full max-w-[420px] border-r border-border bg-surface-muted/80 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              AI Study Buddies
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">
              Home of Your AI Study Buddies
            </h1>
            <p className="mt-4 text-sm leading-7 text-text-muted">
              Talk to multiple unique buddies to ace your next exam!
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/75 p-6 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Inside the app
            </p>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Choose a study buddy, keep your messages in one place, and switch between teaching styles without losing the thread.
            </p>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,_rgba(255,255,255,0.72),_rgba(247,241,232,0.45))] px-4 py-10 md:px-6">
          <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[var(--shadow-card)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Welcome Back
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">
              Sign in to StudyBud
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-muted">
              Continue with Google to open your study space and jump back into chat.
            </p>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/chat" })}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Continue with Google
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
