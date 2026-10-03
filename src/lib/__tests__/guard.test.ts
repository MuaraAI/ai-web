import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock supabase module before importing guard
const mockGetSession = vi.fn();
const mockFrom = vi.fn();

vi.mock("../supabase", () => ({
  getSupabase: () => ({
    auth: {
      getSession: mockGetSession,
    },
    from: mockFrom,
  }),
  DB: {
    apiKeys: "ai_api_keys",
  },
}));

import { loadMember } from "../guard";

describe("loadMember guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns { state: 'anon' } when no active session exists", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });

    const result = await loadMember();
    expect(result).toEqual({ state: "anon" });
  });

  it("returns { state: 'approved', member: {...} } when member status is approved", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-123", email: "user@muaraai.com" } } },
      error: null,
    });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: {
        id: "user-123",
        full_name: "Yuken Velino",
        hierarchy: "maintainer",
        registration_status: "approved",
      },
      error: null,
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });

    const result = await loadMember();
    expect(result).toEqual({
      state: "approved",
      member: {
        id: "user-123",
        fullName: "Yuken Velino",
        hierarchy: "maintainer",
      },
    });
  });

  it("returns { state: 'pending' } when members row is missing or registration_status is pending", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-456", email: "pending@muaraai.com" } } },
      error: null,
    });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });

    const result = await loadMember();
    expect(result).toEqual({ state: "pending" });
  });

  it("rethrows error when members query fails", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-error" } } },
      error: null,
    });

    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockMaybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: new Error("DB connection failure"),
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    });

    await expect(loadMember()).rejects.toThrow("DB connection failure");
  });
});
