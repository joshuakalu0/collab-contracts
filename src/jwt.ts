import crypto from "node:crypto";

import { jwtVerify, SignJWT } from "jose";

import { socketTokenPayloadSchema, type SocketTokenPayload } from "./socket-token";

const SOCKET_AUDIENCE = "collab-socket";
const SOCKET_ISSUER = "collab-web";

type SocketTokenClaimsInput = Omit<
  SocketTokenPayload,
  "aud" | "exp" | "iat" | "iss" | "jti"
>;

function getSocketSecret(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signSocketToken(
  claims: SocketTokenClaimsInput,
  secret: string,
  expiresInSeconds = 5 * 60
) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresInSeconds;
  const jti = crypto.randomUUID();

  const token = await new SignJWT({
    ...claims,
    aud: SOCKET_AUDIENCE,
    iss: SOCKET_ISSUER,
    jti
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT"
    })
    .setSubject(claims.sub)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .setAudience(SOCKET_AUDIENCE)
    .setIssuer(SOCKET_ISSUER)
    .setJti(jti)
    .sign(getSocketSecret(secret));

  return {
    expiresAt,
    token
  };
}

export async function verifySocketToken(token: string, secret: string) {
  const verified = await jwtVerify(token, getSocketSecret(secret), {
    audience: SOCKET_AUDIENCE,
    issuer: SOCKET_ISSUER
  });

  return socketTokenPayloadSchema.parse(verified.payload);
}
