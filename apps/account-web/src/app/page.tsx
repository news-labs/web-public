"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    window.location.replace("/login/");
  }, []);

  return (
    <p className="p-8 text-center text-sm text-muted-foreground">Redirecting to login…</p>
  );
}
