import { UrlKey } from '@/routes/routes';

export function getGroupCodeShareUrl(href: string, groupCode: string) {
  const url = new URL(href);
  url.searchParams.set(UrlKey.GROUP_CODE, groupCode);
  return url.toString();
}
