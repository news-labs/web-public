import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Newsfork team.",
};

export default function ContactPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold tracking-tight mb-5">Get in touch</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Have questions about the API, pricing, or enterprise plans? We&apos;d love to hear
              from you.
            </p>

            <div className="space-y-5">
              <a
                href="mailto:hello@newsfork.com"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent/40 transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">
                    Email
                  </p>
                  <p className="text-sm text-muted-foreground">hello@newsfork.com</p>
                </div>
              </a>

              <a
                href="https://github.com/news-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent/40 transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">
                    GitHub
                  </p>
                  <p className="text-sm text-muted-foreground">github.com/news-labs</p>
                </div>
              </a>

              <a
                href="https://x.com/newsfork"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent/40 transition-colors group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-accent transition-colors">
                    X (Twitter)
                  </p>
                  <p className="text-sm text-muted-foreground">@newsfork</p>
                </div>
              </a>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-muted/50 p-6">
              <h3 className="font-semibold mb-2">Enterprise inquiries</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Looking for a dedicated deployment, custom seed contracts, or volume pricing? Email
                us at{" "}
                <a href="mailto:enterprise@newsfork.com" className="text-accent hover:underline">
                  enterprise@newsfork.com
                </a>{" "}
                with details about your use case.
              </p>
            </div>
          </div>

          <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-8 h-96 animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
