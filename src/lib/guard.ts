import { getSupabase } from "./supabase";

export interface MemberProfile {
  id: string;
  fullName: string;
  hierarchy: string;
}

export type GuardResult =
  | { state: "anon" }
  | { state: "pending" }
  | { state: "rejected" }
  | { state: "approved"; member: MemberProfile };

/**
 * Checks authentication status and validates member approval status from public.members.
 */
export async function loadMember(): Promise<GuardResult> {
  const supabase = getSupabase();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return { state: "anon" };
  }

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("id, full_name, hierarchy, registration_status")
    .eq("id", session.user.id)
    .maybeSingle();

  if (memberError) {
    throw memberError;
  }

  if (!member) {
    return { state: "pending" };
  }

  if (member.registration_status === "approved") {
    return {
      state: "approved",
      member: {
        id: member.id,
        fullName: member.full_name,
        hierarchy: member.hierarchy,
      },
    };
  }

  if (member.registration_status === "rejected") {
    return { state: "rejected" };
  }

  return { state: "pending" };
}
