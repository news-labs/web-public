interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FadeInSection({ children, className = "" }: FadeInSectionProps) {
  return (
    <div className={`motion-safe:animate-fade-in-up ${className}`.trim()}>{children}</div>
  );
}
