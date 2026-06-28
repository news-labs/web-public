import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/login" className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" className="fill-foreground" />
        <path
          d="M8 10h16v2H8V10zm0 5h12v2H8v-2zm0 5h14v2H8v-2z"
          className="fill-background"
        />
        <circle cx="24" cy="22" r="3" className="fill-accent" />
      </svg>
      <span className="font-bold text-lg tracking-tight">Newsfork</span>
    </Link>
  );
}
