
import {
  createHmac,
  randomBytes,
  timingSafeEqual
} from "node:crypto";

import { env } from "../../config/env.js";

// Generate a CSRF token bound to a specific session
export function generateCsrfToken(sessionId) {

  // Generate a cryptographically secure random value
  const nonce = randomBytes(32).toString("base64url");

  // Sign the session ID and nonce using our CSRF secret
  const signature = createHmac("sha256", env.CSRF_SECRET)
    .update(`${sessionId}.${nonce}`)
    .digest("base64url");

  // Token format: nonce.signature
  return `${nonce}.${signature}`;
}


// Compare two strings without ordinary timing-sensitive comparison
export function safeTokenEqual(tokenA, tokenB) {

  if (
    typeof tokenA !== "string" ||
    typeof tokenB !== "string"
  ) {
    return false;
  }

  const bufferA = Buffer.from(tokenA);
  const bufferB = Buffer.from(tokenB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}


// Verify the CSRF token's signature against the session ID
export function verifyCsrfToken(token, sessionId) {

  if (
    typeof token !== "string" ||
    typeof sessionId !== "string"
  ) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 2) {
    return false;
  }

  const [nonce, receivedSignature] = parts;

  // Expected format: 32 random bytes encoded as base64url
  if (!/^[A-Za-z0-9_-]{43}$/.test(nonce)) {
    return false;
  }

  if (!/^[A-Za-z0-9_-]{43}$/.test(receivedSignature)) {
    return false;
  }

  // Recreate the expected signature
  const expectedSignature = createHmac("sha256", env.CSRF_SECRET)
    .update(`${sessionId}.${nonce}`)
    .digest("base64url");

  // Compare signatures safely
  return safeTokenEqual(
    receivedSignature,
    expectedSignature
  );
}
