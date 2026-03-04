export function replaceString(
  template: string,
  replacements: Record<string, string>,
): string {
  return template.replace(/\[(.*?)\]/g, (match, key) => {
    return replacements[key] || match;
  });
}
