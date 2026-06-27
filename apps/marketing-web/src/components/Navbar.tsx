"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { SIGNIN_URL, SIGNUP_URL } from "@/data/home-content";

const NAV_LINKS = [
  { label: "Product", href: "/product/" },
  { label: "Pricing", href: "/pricing/" },
  { label: "Docs", href: "/docs/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href={SIGNIN_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm">Get API key</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200",
          open ? "max-h-96 border-b border-border" : "max-h-0"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
            <Link href={SIGNIN_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="w-full">
                Get API key
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
