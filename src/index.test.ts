import { describe, expect, it } from "vitest";

import {
  collaboratorMutationSchema,
  docChangeSchema,
  roomSnapshotSchema,
  signSocketToken,
  socketTokenPayloadSchema
} from "./index";

describe("collab-contracts", () => {
  it("accepts collaborator mutations with a valid email and access", () => {
    const parsed = collaboratorMutationSchema.parse({
      access: "EDIT",
      email: "owner@example.com"
    });

    expect(parsed.access).toBe("EDIT");
  });

  it("rejects negative cursor offsets in document changes", () => {
    expect(() =>
      docChangeSchema.parse({
        baseRevision: 2,
        content: "hello",
        documentId: "doc_123",
        selectionEnd: 3,
        selectionStart: -1
      })
    ).toThrow();
  });

  it("accepts room snapshots with presence members", () => {
    const snapshot = roomSnapshotSchema.parse({
      content: "hello",
      documentId: "doc_123",
      presence: [
        {
          access: "EDIT",
          caretEnd: 5,
          caretStart: 5,
          color: "#ff7a00",
          connectedAt: new Date().toISOString(),
          documentId: "doc_123",
          email: "collab@example.com",
          image: null,
          name: "Teammate",
          socketId: "socket_1",
          updatedAt: new Date().toISOString(),
          userId: "user_1"
        }
      ],
      revision: 9
    });

    expect(snapshot.presence).toHaveLength(1);
  });

  it("captures document-scoped socket token claims", () => {
    const now = Math.floor(Date.now() / 1000);
    const payload = socketTokenPayloadSchema.parse({
      access: "VIEW",
      aud: "collab-socket",
      documentId: "doc_456",
      email: "viewer@example.com",
      exp: now + 300,
      iat: now,
      image: null,
      iss: "collab-web",
      jti: "token_123",
      name: "Viewer",
      sub: "user_2"
    });

    expect(payload.documentId).toBe("doc_456");
  });

  it("signs socket tokens with the shared contract", async () => {
    const signed = await signSocketToken(
      {
        access: "EDIT",
        documentId: "doc_789",
        email: "editor@example.com",
        image: null,
        name: "Editor",
        sub: "user_3"
      },
      "super-secret-value"
    );

    expect(signed.token).toBeTruthy();
    expect(signed.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
