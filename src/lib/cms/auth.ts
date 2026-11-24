import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "citraland_cms_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export function cmsConfigured() {
  return Boolean(process.env.CMS_USERNAME && process.env.CMS_PASSWORD && process.env.CMS_SESSION_SECRET);
}

function secureCompare(input: string, expected: string) {
  const first = createHmac("sha256", "citraland-credential-check").update(input).digest();
  const second = createHmac("sha256", "citraland-credential-check").update(expected).digest();
  return timingSafeEqual(first, second);
}

export function usernameMatches(input: string) {
  return Boolean(process.env.CMS_USERNAME && secureCompare(input, process.env.CMS_USERNAME));
}

export function passwordMatches(input: string) {
  return Boolean(process.env.CMS_PASSWORD && secureCompare(input, process.env.CMS_PASSWORD));
}

function signature(expires: string) {
  return createHmac("sha256", process.env.CMS_SESSION_SECRET || "")
    .update(`citraland-cms:${expires}`)
    .digest("hex");
}

export async function isCmsAuthenticated() {
  if (!cmsConfigured()) return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expires, signed, ...rest] = value.split(".");
  if (rest.length || !/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/i.test(signed)) return false;
  const expiresAt = Number(expires);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) return false;
  const expected = Buffer.from(signature(expires), "hex");
  const received = Buffer.from(signed, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function createCmsSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  (await cookies()).set(COOKIE_NAME, `${expires}.${signature(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearCmsSession() {
  (await cookies()).delete(COOKIE_NAME);
}
