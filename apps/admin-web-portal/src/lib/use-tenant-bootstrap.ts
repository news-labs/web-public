import { useEffect } from "react";
import { useTenantContext } from "@core-labs/admin-shell";
import { fetchBrands, fetchRegions } from "./api";

export function useTenantBootstrap() {
  const ctx = useTenantContext();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [brandsRes, regionsRes] = await Promise.all([fetchBrands(), fetchRegions()]);
        if (cancelled) return;
        ctx.setBrands(
          (brandsRes.brands ?? []).map((b) => ({
            brand_id: b.brand_id,
            apex_domain: b.apex_domain,
            template_id: b.template_id,
            default_locale: b.default_locale,
          })),
        );
        ctx.setRegions(
          (regionsRes.regions ?? []).map((r) => ({
            city_code: r.city_code,
            brand_id: r.brand_id,
            city_name: r.city_name,
            country_iso: r.country_iso,
            domain: r.domain,
            target_language: r.target_language,
            template_override_id: r.template_override_id,
          })),
        );
      } catch {
        /* CP may be unavailable in local dev */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ctx.setBrands, ctx.setRegions]);
}
