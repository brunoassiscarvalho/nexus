/**
 * Utility functions for the Flow API Studio application
 */

/**
 * Creates a page URL for routing
 * @param page - The page name (e.g., "Dashboard", "APIs", "UseCases")
 * @param params - Optional query parameters
 * @returns The formatted URL path
 */
export function createPageUrl(
  page: string,
  params?: Record<string, string>
): string {
  const basePath = `/${page.toLowerCase()}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    return `${basePath}?${searchParams.toString()}`;
  }

  return basePath;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce function to limit the rate of function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  };
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Get color classes for HTTP methods
 * @param method - The HTTP method (GET, POST, etc.)
 * @param style - The style variant ('light' for badges with borders, 'solid' for solid backgrounds)
 * @returns CSS class string for the method color
 */
export function getMethodColors(
  method: string,
  style: "light" | "solid" = "light"
): string {
  const colors = {
    light: {
      GET: "bg-green-100 text-green-700 border-green-200",
      POST: "bg-blue-100 text-blue-700 border-blue-200",
      PUT: "bg-orange-100 text-orange-700 border-orange-200",
      PATCH: "bg-purple-100 text-purple-700 border-purple-200",
      DELETE: "bg-red-100 text-red-700 border-red-200",
    },
    solid: {
      GET: "bg-green-500",
      POST: "bg-blue-500",
      PUT: "bg-orange-500",
      PATCH: "bg-purple-500",
      DELETE: "bg-red-500",
    },
  };

  return (
    colors[style][method as keyof (typeof colors)[typeof style]] ||
    (style === "light"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : "bg-slate-500")
  );
}
