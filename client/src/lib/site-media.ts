import { useQuery } from "@tanstack/react-query";

export function siteMediaQueryKey() {
  return ["/api/site-media"] as const;
}

export function useSiteMediaMap() {
  return useQuery<{ success: boolean; data: Record<string, string> }>({
    queryKey: siteMediaQueryKey(),
    queryFn: async () => {
      const res = await fetch("/api/site-media");
      if (!res.ok) return { success: false, data: {} };
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function mediaUrl(
  map: Record<string, string> | undefined,
  key: string,
  fallback: string,
): string {
  return map?.[key] || fallback;
}
