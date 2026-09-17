const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function sitePath(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${basePath}${normalizedPath}`;
}
