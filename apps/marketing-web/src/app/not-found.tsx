import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SIGNUP_URL } from "@/data/home-content";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-xl px-4 text-center">
        <p className="text-sm font-medium text-accent mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
          <Link href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <Button>Get API key</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
