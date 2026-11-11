import { z } from "zod";

import { documentAccessSchema } from "./documents";

export const socketTokenPayloadSchema = z.object({
  access: documentAccessSchema,
  aud: z.literal("collab-socket"),
  documentId: z.string().trim().min(1),
  email: z.string().email(),
  exp: z.number().int().positive(),
  iat: z.number().int().positive(),
  image: z.string().url().nullable(),
  iss: z.literal("collab-web"),
  jti: z.string().min(1),
  name: z.string().nullable(),
  sub: z.string().trim().min(1)
  ,
  workspaceId: z.string().trim().min(1)
});

export type SocketTokenPayload = z.infer<typeof socketTokenPayloadSchema>;
