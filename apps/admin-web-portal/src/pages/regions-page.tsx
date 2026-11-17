import { useEffect } from "react";
import { LoadingState, PageHeader } from "@core-labs/admin-shell";

/** Diaspora city_nodes SSOT moved to Platform Ref Data; brand geo is CMS Editions. */
const REF_DATA_CITIES = "/platform/reference-data?tab=cities";

export function RegionsPage() {
  useEffect(() => {
    window.location.replace(REF_DATA_CITIES);
  }, []);

  return (
    <>
      <PageHeader
        title="Regions moved"
        description="Diaspora city nodes are edited in Platform Reference Data → Cities."
      />
      <LoadingState />
      <p className="mt-4 text-sm text-muted-foreground">
        Redirecting to{" "}
        <a className="underline" href={REF_DATA_CITIES}>
          {REF_DATA_CITIES}
        </a>
        . Brand city editions:{" "}
        <a className="underline" href="https://cms.newsfork.com/">
          cms.newsfork.com
        </a>
        .
      </p>
    </>
  );
}
