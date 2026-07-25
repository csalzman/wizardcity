import { SignJWT, jwtVerify } from "jose";
import { config } from "./config";

export type SessionUser = {
  id: string;
  username: string;
};

export const SESSION_COOKIE = "rft26_wizard_session";
export const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
export const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.secureCookies,
} as const;

const secret = new TextEncoder().encode(config.jwtSecret);

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setExpirationTime(new Date(Date.now() + SESSION_MAX_AGE_MS))
    .sign(secret);
}

export async function verifySession(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return { id: payload.sub as string, username: payload.username as string };
  } catch {
    return null;
  }
}
