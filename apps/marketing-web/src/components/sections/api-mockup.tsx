interface ApiMockupProps {
  label: string;
  lines: string[];
}

export function ApiMockup({ label, lines }: ApiMockupProps) {
  return (
    <div className="rounded-2xl border border-border bg-[#0d1117] overflow-hidden h-full min-h-[16rem] flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-white/50 font-mono">{label}</span>
      </div>
      <pre className="flex-1 p-5 text-sm font-mono leading-relaxed overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block text-blue-300/90">
              {line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
