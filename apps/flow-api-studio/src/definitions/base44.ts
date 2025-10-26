/**
 * Type definitions for base44 API
 */

/**
 * User type representing a system user
 */
export interface User {
  id: string;
  full_name: string;
  email: string;
  persona: "editor" | "visualizador";
}

/**
 * API type representing an API definition
 */
export interface API {
  id: string;
  name: string;
  description: string;
  version: string;
  base_url?: string;
  created_date: string;
}

/**
 * Parameter type for API endpoints
 */
export interface Parameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

/**
 * Endpoint type representing an API endpoint
 */
export interface Endpoint {
  id: string;
  api_id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  request_params?: Parameter[];
  response_params?: Parameter[];
}

/**
 * UseCase type representing a flow of API endpoint calls
 */
export interface UseCase {
  id: string;
  api_id: string;
  name: string;
  description: string;
  created_date: string;
  flow?: FlowDefinition;
}

/**
 * Flow definition for use cases
 */
export interface FlowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Node in a flow definition
 */
export interface FlowNode {
  id: string;
  type: "endpoint" | "start" | "end";
  position: {
    x: number;
    y: number;
  };
  data: {
    endpoint_id?: string;
    label: string;
  };
}

/**
 * Edge connecting nodes in a flow definition
 */
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  parameterMapping?: {
    source: string;
    target: string;
  }[];
}

/**
 * Test data for API endpoints
 */
export interface TestData {
  id: string;
  endpoint_id: string;
  name: string;
  data: any;
  expected_response?: any;
}
