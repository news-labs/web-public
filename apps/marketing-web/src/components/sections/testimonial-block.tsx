interface TestimonialBlockProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialBlock({ quote, author, role }: TestimonialBlockProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed tracking-tight text-balance">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <footer className="mt-8">
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </footer>
      </div>
    </section>
  );
}
