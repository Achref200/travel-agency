import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation APIs. Always import `Link`, `useRouter`,
 * `usePathname` and `redirect` from here (never from `next/link` or
 * `next/navigation`) so that the active locale prefix is handled for you.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
