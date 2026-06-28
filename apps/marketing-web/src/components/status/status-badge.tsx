import { cn } from "@/lib/utils";

export type ServiceStatus = "operational" | "degraded" | "outage";

const STATUS_STYLES: Record<ServiceStatus, string> = {
  operational: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  degraded: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  outage: "bg-red-500/15 text-red-700 dark:text-red-400",
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
