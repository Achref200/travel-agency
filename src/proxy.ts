import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - API routes (/api, /trpc)
  // - the admin dashboard (/admin) — not localized
  // - Next.js internals (/_next, /_vercel)
  // - files with an extension (e.g. favicon.ico, images, robots.txt)
  matcher: "/((?!api|trpc|admin|_next|_vercel|.*\\..*).*)",
};
