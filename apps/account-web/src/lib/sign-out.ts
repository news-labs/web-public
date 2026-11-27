import { accountApi, AccountApiError } from "@/lib/account-api";

export const LOGOUT_FAILED_MESSAGE =
  "Log out failed. You may still be signed in. Check your connection and try again.";

/** Goes to /login/ once the session is gone. Resolves false when it may still be active. */
export async function signOut(): Promise<boolean> {
  try {
    await accountApi.logout();
  } catch (err) {
    // 401 means the session is already gone. Anything else may leave it active.
    if (!(err instanceof AccountApiError && err.status === 401)) return false;
  }
  window.location.assign("/login/");
  return true;
}
