import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps {
  href: string;
  label?: string;
}

export function GoogleSignInButton({ href, label = "Continue with Google" }: GoogleSignInButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border bg-transparent px-6 text-base font-medium text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92a8.78 8.78 0 0 0 2.68-6.69z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.29-1.57-5.01-3.71H.96v2.33A8.996 8.996 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.99 10.71A5.41 5.41 0 0 1 3.62 9c0-.59.1-1.16.27-1.71V3.96H.96A8.996 8.996 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.03-2.35z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A8.996 8.996 0 0 0 .96 4.96l3.03 2.35C4.71 5.15 6.66 3.58 9 3.58z"
        />
      </svg>
      {label}
    </a>
  );
}
