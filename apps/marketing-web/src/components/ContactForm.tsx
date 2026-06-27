"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const FORM_ACTION =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION ?? "/api/contact/";

const INTENT_SUBJECTS: Record<string, string> = {
  demo: "Live demo request",
  enterprise: "Enterprise inquiry",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") ?? "";
  const defaultSubject = INTENT_SUBJECTS[intent] ?? "";

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const subject = String(formData.get("subject") ?? "Newsfork inquiry");
    const message = String(formData.get("message") ?? "");

    if (!FORM_ACTION.startsWith("http") && typeof window !== "undefined") {
      formData.set("_subject", subject);
    }

    setStatus("submitting");

    try {
      const response = await fetch(FORM_ACTION, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold mb-3">Message sent</h2>
        <p className="text-sm text-muted-foreground">
          Thanks for reaching out. We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="_subject" value="Newsfork contact form" />
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            defaultValue={defaultSubject}
            placeholder="How can we help?"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your project or question..."
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors resize-none"
          />
        </div>
        {status === "error" && (
          <p className="text-sm text-red-600">
            Something went wrong. Email us at{" "}
            <a href="mailto:hello@newsfork.com" className="underline">
              hello@newsfork.com
            </a>
            .
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>
      </form>
    </div>
  );
}
