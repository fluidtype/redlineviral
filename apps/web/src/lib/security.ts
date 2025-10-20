import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

function getWorkerSecret(): Buffer {
  const secret = process.env.WORKER_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new HttpError(500, "WORKER_JWT_SECRET is not configured");
  }
  return Buffer.from(secret, "utf8");
}

const IDEMPOTENCY_KEY_HEADER = "idempotency-key";
const IDEMPOTENCY_REGEX = /^[A-Za-z0-9_-]{16,128}$/;

export function requireIdempotencyKey(req: NextRequest): string {
  const value = req.headers.get(IDEMPOTENCY_KEY_HEADER) ?? req.headers.get(IDEMPOTENCY_KEY_HEADER.toUpperCase());
  if (!value) {
    throw new HttpError(400, "Missing Idempotency-Key header");
  }

  const trimmed = value.trim();
  if (!IDEMPOTENCY_REGEX.test(trimmed)) {
    throw new HttpError(400, "Invalid Idempotency-Key header");
  }

  return trimmed;
}

export function assertOrigin(req: NextRequest, baseUrl: string): void {
  const configured = new URL(baseUrl);
  const requestOrigin = req.headers.get("origin");
  const requestHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");

  if (requestOrigin) {
    const originUrl = new URL(requestOrigin);
    if (originUrl.host !== configured.host || originUrl.protocol !== configured.protocol) {
      throw new HttpError(403, "Origin mismatch");
    }
    return;
  }

  if (requestHost && requestHost !== configured.host) {
    throw new HttpError(403, "Host mismatch");
  }
}

function encodeSegment(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", getWorkerSecret()).update(data).digest("base64url");
}

function decodePayload(segment: string) {
  const decoded = Buffer.from(segment, "base64url").toString("utf8");
  return JSON.parse(decoded) as { sub?: string; jti?: string; exp?: number };
}

export function makeSignedSseToken({
  userId,
  jobId,
  expSeconds,
}: {
  userId: string;
  jobId: string;
  expSeconds: number;
}): string {
  if (expSeconds <= 0) {
    throw new HttpError(400, "expSeconds must be positive");
  }
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encodeSegment({ alg: "HS256", typ: "JWT" });
  const payload = encodeSegment({ sub: userId, jti: jobId, iat: issuedAt, exp: issuedAt + expSeconds });
  const body = `${header}.${payload}`;
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySignedSseToken(token: string): { userId: string; jobId: string } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new HttpError(401, "Malformed token");
  }
  const [header, payload, signature] = parts;
  const data = `${header}.${payload}`;
  const expected = sign(data);

  const providedBuf = Buffer.from(signature, "base64url");
  const expectedBuf = Buffer.from(expected, "base64url");
  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
    throw new HttpError(401, "Invalid signature");
  }

  const claims = decodePayload(payload);
  if (!claims.sub || !claims.jti) {
    throw new HttpError(401, "Missing claims");
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp === "number" && claims.exp < now) {
    throw new HttpError(401, "Token expired");
  }

  return { userId: claims.sub, jobId: claims.jti };
}
