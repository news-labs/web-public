interface CodeShowcaseProps {
  title: string;
  subtitle: string;
  command: string;
  response: string;
}

export function CodeShowcase({ title, subtitle, command, response }: CodeShowcaseProps) {
  return (
    <section className="border-y border-border bg-muted/30 py-24 md:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-4 order-2 lg:order-1">
            <div className="rounded-2xl border border-border bg-[#0d1117] overflow-hidden">
              <div className="border-b border-white/10 px-4 py-2">
                <span className="text-xs text-white/50 font-mono">Terminal</span>
              </div>
              <pre className="p-4 text-sm text-green-400 font-mono overflow-x-auto leading-relaxed">
                <code>{command}</code>
              </pre>
            </div>
            <div className="rounded-2xl border border-border bg-[#0d1117] overflow-hidden">
              <div className="border-b border-white/10 px-4 py-2">
                <span className="text-xs text-white/50 font-mono">Response</span>
              </div>
              <pre className="p-4 text-sm text-blue-300 font-mono overflow-x-auto leading-relaxed">
                <code>{response}</code>
              </pre>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
