import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  HttpError,
  assertOrigin,
  makeSignedSseToken,
  requireIdempotencyKey,
  verifySignedSseToken,
} from "./security";

const BASE_URL = "https://app.example.com";

beforeEach(() => {
  process.env.WORKER_JWT_SECRET = "s".repeat(48);
  vi.useRealTimers();
});

describe("requireIdempotencyKey", () => {
  it("extracts and validates the header", () => {
    const req = new NextRequest(`${BASE_URL}/api/test`, {
      headers: new Headers({ "Idempotency-Key": "abc1234567890123" }),
    });

    expect(requireIdempotencyKey(req)).toBe("abc1234567890123");
  });

  it("rejects missing headers", () => {
    const req = new NextRequest(`${BASE_URL}/api/test`);
    expect(() => requireIdempotencyKey(req)).toThrow(HttpError);
  });
});

describe("assertOrigin", () => {
  it("accepts matching origin", () => {
    const req = new NextRequest(`${BASE_URL}/api/test`, {
      headers: new Headers({ origin: BASE_URL }),
    });

    expect(() => assertOrigin(req, BASE_URL)).not.toThrow();
  });

  it("rejects mismatched host", () => {
    const req = new NextRequest(`${BASE_URL}/api/test`, {
      headers: new Headers({ origin: "https://evil.example.net" }),
    });

    expect(() => assertOrigin(req, BASE_URL)).toThrowError(/Origin mismatch/);
  });
});

describe("signed SSE tokens", () => {
  it("signs and verifies payloads", () => {
    const token = makeSignedSseToken({ userId: "user-a", jobId: "job-1", expSeconds: 60 });
    const payload = verifySignedSseToken(token);

    expect(payload).toEqual({ userId: "user-a", jobId: "job-1" });
  });

  it("expires tokens", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    const token = makeSignedSseToken({ userId: "user-a", jobId: "job-1", expSeconds: 10 });
    vi.setSystemTime(new Date("2024-01-01T00:00:11Z"));

    expect(() => verifySignedSseToken(token)).toThrowError(/Token expired/);
  });
});
