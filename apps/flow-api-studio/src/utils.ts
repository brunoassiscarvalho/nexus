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
