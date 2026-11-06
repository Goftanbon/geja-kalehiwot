export function useContructUrl(key: string | null | undefined): string {
  if (!key) return "";
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;
}
