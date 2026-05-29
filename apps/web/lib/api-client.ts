import { getToken } from "next-auth/jwt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getInternalToken(): Promise<string | null> {
  const cookieStore = cookies();
  // Decodifica sem `raw:true` → retorna payload, não o JWE bruto
  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value])
      ),
    } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) return null;

  const userId = (token.sub ?? token.id) as string | undefined;
  if (!userId) return null;

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2m")
    .sign(secret);
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  const token = await getInternalToken();

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[api-client] ${path} → ${res.status}`);
      return null;
    }

    return res.json() as Promise<T>;
  } catch (err) {
    console.error(`[api-client] fetch error: ${path}`, err);
    return null;
  }
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  xpTotal: number;
  streakAtual: number;
  ultimaAtividade: string | null;
  level: number;
  xpToNextLevel: number;
}

export interface DashboardStats {
  xpTotal: number;
  streakAtual: number;
  lessonsCompleted: number;
  weeklyXp: { label: string; xp: number }[];
  xpWeekly: number;
  level: number;
  xpToNextLevel: number;
  continueLesson: {
    lessonId: string;
    title: string;
    trackTitle: string;
    trackSlug: string;
    unitTitle: string;
    type: string;
  } | null;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  return apiFetch<UserProfile>("/users/me");
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  return apiFetch<DashboardStats>("/users/me/stats");
}
