import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

function sanitizeNextPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  // Strict relative path validation: prevents Open Redirect attacks
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes(":") || raw.includes("\\")) {
    return "/dashboard";
  }
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));

  if (code) {
    const cookieStore = new Map<string, string>();
    const isLocalhost =
      request.nextUrl.hostname === "localhost" ||
      request.nextUrl.hostname === "127.0.0.1";

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: {
          name: "sb-muaraai-auth-token",
          domain: isLocalhost ? undefined : ".muaraai.com",
        },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              cookieStore.set(name, value);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(next, origin));
      cookieStore.forEach((value, name) => {
        response.cookies.set(name, value, {
          domain: isLocalhost ? undefined : ".muaraai.com",
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      });
      return response;
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
