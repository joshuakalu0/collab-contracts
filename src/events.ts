import { z } from "zod";

import { documentAccessSchema } from "./documents";

export const clientEventNames = {
  cursorMove: "cursor:move",
  docChange: "doc:change",
  roomJoin: "room:join",
  roomLeave: "room:leave"
} as const;

export const serverEventNames = {
  docSaved: "doc:saved",
  docUpdated: "doc:updated",
  presenceUpdate: "presence:update",
  roomSnapshot: "room:snapshot",
  socketError: "socket:error"
} as const;

export const roomJoinSchema = z.object({
  documentId: z.string().trim().min(1)
});

export const roomLeaveSchema = roomJoinSchema;

export const docChangeSchema = z.object({
  baseRevision: z.number().int().nonnegative(),
  content: z.string(),
  documentId: z.string().trim().min(1),
  selectionEnd: z.number().int().nonnegative(),
  selectionStart: z.number().int().nonnegative()
});

export const cursorMoveSchema = z.object({
  caretEnd: z.number().int().nonnegative(),
  caretStart: z.number().int().nonnegative(),
  documentId: z.string().trim().min(1)
});

export const presenceMemberSchema = z.object({
  access: documentAccessSchema,
  caretEnd: z.number().int().nonnegative().nullable(),
  caretStart: z.number().int().nonnegative().nullable(),
  color: z.string().min(1),
  connectedAt: z.string().datetime(),
  documentId: z.string().trim().min(1),
  email: z.string().email(),
  image: z.string().url().nullable(),
  name: z.string().nullable(),
  socketId: z.string(),
  updatedAt: z.string().datetime(),
  userId: z.string()
});

export const roomSnapshotSchema = z.object({
  content: z.string(),
  documentId: z.string().trim().min(1),
  presence: z.array(presenceMemberSchema),
  revision: z.number().int().nonnegative()
});

export const presenceUpdateSchema = z.object({
  documentId: z.string().trim().min(1),
  presence: z.array(presenceMemberSchema)
});

export const docUpdatedSchema = z.object({
  actorSocketId: z.string(),
  content: z.string(),
  documentId: z.string().trim().min(1),
  revision: z.number().int().nonnegative(),
  updatedAt: z.string().datetime()
});

export const docSavedSchema = z.object({
  documentId: z.string().trim().min(1),
  revision: z.number().int().nonnegative(),
  savedAt: z.string().datetime()
});

export const socketErrorSchema = z.object({
  code: z.string().trim().min(1),
  detail: z.string().trim().min(1),
  documentId: z.string().trim().min(1).optional()
});

export type ClientEventName =
  (typeof clientEventNames)[keyof typeof clientEventNames];

export type ServerEventName =
  (typeof serverEventNames)[keyof typeof serverEventNames];

export type RoomJoinPayload = z.infer<typeof roomJoinSchema>;
export type RoomLeavePayload = z.infer<typeof roomLeaveSchema>;
export type DocChangePayload = z.infer<typeof docChangeSchema>;
export type CursorMovePayload = z.infer<typeof cursorMoveSchema>;
export type PresenceMember = z.infer<typeof presenceMemberSchema>;
export type RoomSnapshotPayload = z.infer<typeof roomSnapshotSchema>;
export type PresenceUpdatePayload = z.infer<typeof presenceUpdateSchema>;
export type DocUpdatedPayload = z.infer<typeof docUpdatedSchema>;
export type DocSavedPayload = z.infer<typeof docSavedSchema>;
export type SocketErrorPayload = z.infer<typeof socketErrorSchema>;
