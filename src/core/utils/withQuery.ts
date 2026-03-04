export function withQuery<T extends Record<string, any>>(url: string, query?: T): string {
    if (!query) return url;
    const search = new URLSearchParams(query as any).toString();
    return `${url}?${search}`;
  }