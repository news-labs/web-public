"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { REVAMP_CTA } from "@/lib/marketing-revamp-tokens";
import { NAV_LINKS } from "@/lib/nav-config";
import { SIGNIN_URL, SIGNUP_URL } from "@/data/home-content";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href={SIGNIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(REVAMP_CTA.primary, "px-5 py-2 text-sm")}
          >
            Get API key
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200",
          open ? "max-h-[28rem] border-b border-border" : "max-h-0"
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
            <Link
              href={SIGNIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(REVAMP_CTA.secondary, "w-full py-2.5 text-sm")}
            >
              Sign in
            </Link>
            <Link
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(REVAMP_CTA.primary, "w-full py-2.5 text-sm")}
            >
              Get API key
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
