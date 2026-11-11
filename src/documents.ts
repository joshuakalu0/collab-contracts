import { z } from "zod";

export const documentAccessSchema = z.enum(["VIEW", "EDIT"]);
export const workspaceRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"]);

export type DocumentAccess = z.infer<typeof documentAccessSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;

export const createDocumentSchema = z.object({
  title: z.string().trim().min(1).max(120).default("Untitled document")
});

export const updateDocumentSchema = z.object({
  title: z.string().trim().min(1).max(120)
});

export const workspaceMemberCreateSchema = z.object({
  email: z.string().trim().email(),
  role: workspaceRoleSchema.default("MEMBER")
});

export const workspaceMemberRoleUpdateSchema = z.object({
  role: workspaceRoleSchema
});

export const collaboratorMutationSchema = z.object({
  access: documentAccessSchema
  ,
  userId: z.string().trim().min(1)
});

export const collaboratorAccessUpdateSchema = z.object({
  access: documentAccessSchema
});

export const socketTokenRequestSchema = z.object({
  documentId: z.string().trim().min(1)
});

export const collaboratorDescriptorSchema = z.object({
  access: documentAccessSchema,
  email: z.string().email(),
  id: z.string(),
  image: z.string().url().nullable(),
  name: z.string().nullable(),
  workspaceRole: workspaceRoleSchema
});

export type CollaboratorDescriptor = z.infer<typeof collaboratorDescriptorSchema>;

export const workspaceSummarySchema = z.object({
  documentCount: z.number().int().nonnegative(),
  id: z.string(),
  isPersonal: z.boolean(),
  memberCount: z.number().int().nonnegative(),
  name: z.string(),
  role: workspaceRoleSchema,
  slug: z.string()
});

export type WorkspaceSummary = z.infer<typeof workspaceSummarySchema>;

export const workspaceMemberSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  image: z.string().url().nullable(),
  name: z.string().nullable(),
  role: workspaceRoleSchema
});

export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;

export const documentSummarySchema = z.object({
  access: documentAccessSchema,
  collaboratorCount: z.number().int().nonnegative(),
  id: z.string(),
  isOwner: z.boolean(),
  lastSavedAt: z.string().datetime().nullable(),
  preview: z.string(),
  shared: z.boolean(),
  title: z.string(),
  updatedAt: z.string().datetime(),
  workspaceId: z.string(),
  workspaceName: z.string(),
  workspaceSlug: z.string()
});

export type DocumentSummary = z.infer<typeof documentSummarySchema>;

export const documentVersionSchema = z.object({
  content: z.string(),
  contentHash: z.string(),
  documentId: z.string(),
  id: z.string(),
  revision: z.number().int().nonnegative(),
  savedAt: z.string().datetime(),
  savedBy: workspaceMemberSchema.pick({
    email: true,
    id: true,
    image: true,
    name: true
  }).nullable()
});

export type DocumentVersion = z.infer<typeof documentVersionSchema>;

export const documentDetailSchema = z.object({
  access: documentAccessSchema,
  collaborators: z.array(collaboratorDescriptorSchema),
  content: z.string(),
  contentHash: z.string(),
  id: z.string(),
  isOwner: z.boolean(),
  lastSavedAt: z.string().datetime().nullable(),
  ownerId: z.string(),
  revision: z.number().int().nonnegative(),
  title: z.string(),
  updatedAt: z.string().datetime(),
  versions: z.array(documentVersionSchema),
  workspaceId: z.string(),
  workspaceName: z.string(),
  workspaceRole: workspaceRoleSchema,
  workspaceSlug: z.string()
});

export type DocumentDetail = z.infer<typeof documentDetailSchema>;

export const apiKeyCreateSchema = z.object({
  name: z.string().trim().min(2).max(80)
});

export const apiKeySummarySchema = z.object({
  createdAt: z.string().datetime(),
  createdBy: workspaceMemberSchema.pick({
    email: true,
    id: true,
    image: true,
    name: true
  }),
  id: z.string(),
  keyPrefix: z.string(),
  lastUsedAt: z.string().datetime().nullable(),
  name: z.string(),
  revokedAt: z.string().datetime().nullable(),
  workspaceId: z.string()
});

export type ApiKeySummary = z.infer<typeof apiKeySummarySchema>;
