import NextIntlMiddleware from 'next-intl/middleware';
import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

// Create the next-intl middleware instance with your locales.
const intlMiddleware = NextIntlMiddleware({
  locales: ['en', 'fi'], // update these locales as needed
  defaultLocale: 'en',
});

export async function middleware(request: NextRequest) {
  // First, let next-intl process the request.
  const intlResponse = await intlMiddleware(request);
  if (intlResponse) {
    // If next-intl returns a response (e.g., a redirect), return it.
    return intlResponse;
  }
  
  // Otherwise, proceed with your custom session update logic.
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};
