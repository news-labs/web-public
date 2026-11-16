"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AccountApiError,
  accountApi,
  describeError,
  type ApiKeySummary,
  type BillingStatus,
  type DailyUsage,
  type Overview,
} from "@/lib/account-api";

interface DashboardState {
  overview: Overview | null;
  billing: BillingStatus | null;
  keys: ApiKeySummary[];
  days: DailyUsage[];
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setOverview: (overview: Overview) => void;
}

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [billing, setBilling] = useState<BillingStatus | null>(null);
  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [days, setDays] = useState<DailyUsage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [me, keyList, usage, bill] = await Promise.all([
        accountApi.me(),
        accountApi.keys(),
        accountApi.usage(30),
        accountApi.billing().catch(() => null),
      ]);
      setOverview(me);
      setBilling(bill);
      setKeys(keyList.keys);
      setDays(usage.days);
      setError(null);
    } catch (err) {
      if (err instanceof AccountApiError && err.status === 401) {
        window.location.replace("/login/");
        return;
      }
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      overview,
      billing,
      keys,
      days,
      error,
      loading,
      refresh,
      setOverview,
    }),
    [overview, billing, keys, days, error, loading, refresh],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardState {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
