import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("supabase client environment check", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws descriptive error when NEXT_PUBLIC_SUPABASE_URL or ANON_KEY is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Reset module cache so singleton doesn't retain old instance
    const { getSupabase } = await import("../supabase");

    expect(() => getSupabase()).toThrow(
      /Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured\./,
    );
  });
});
