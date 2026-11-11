import { z } from "zod";

import {
  apiKeySummarySchema,
  documentSummarySchema,
  workspaceMemberSchema,
  workspaceSummarySchema
} from "./documents";

export const workspaceDashboardSchema = z.object({
  documents: z.array(documentSummarySchema),
  members: z.array(workspaceMemberSchema),
  workspace: workspaceSummarySchema
});

export type WorkspaceDashboard = z.infer<typeof workspaceDashboardSchema>;

export const apiKeyCreateResultSchema = z.object({
  apiKey: apiKeySummarySchema,
  secret: z.string()
});

export type ApiKeyCreateResult = z.infer<typeof apiKeyCreateResultSchema>;
