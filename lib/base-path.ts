export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/3-amici-suites";

export function withBasePath(path: string) {
  if (!basePath) {
    return path;
  }

  return `${basePath}${path}`;
}
