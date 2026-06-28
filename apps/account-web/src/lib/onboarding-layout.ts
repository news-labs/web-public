export const ONBOARDING_SHELL_MAX_CLASS = "mx-auto w-full max-w-[min(100%,30rem)]";

export const ONBOARDING_PAGE_ROOT_CLASS = "flex min-h-dvh flex-col bg-background";

export const ONBOARDING_MAIN_CLASS =
  "flex flex-1 flex-col min-h-0 overflow-y-auto py-4 md:py-8";

export const ONBOARDING_MAIN_INNER_CLASS = [
  "flex w-full flex-1 flex-col min-h-0 justify-start px-4 sm:px-6",
  ONBOARDING_SHELL_MAX_CLASS,
].join(" ");

export const ONBOARDING_PANEL_CLASS =
  "rounded-xl bg-card p-8 shadow-sm border border-border/60";
