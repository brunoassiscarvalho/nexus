import { ErrorResponse } from "react-router";
import { BaseEntity, PaginatedResponse } from "../../../../definitions/types";

// Extending the base types for API-specific use
export interface APIEntity extends BaseEntity {
  name: string;
  description: string;
  version: string;
  endpoints: string[];
}

export type APIResponse<T> = Promise<
  { success: true; data: T } | { success: false; error: ErrorResponse }
>;

export type PaginatedAPIResponse<T> = Promise<PaginatedResponse<T>>;
