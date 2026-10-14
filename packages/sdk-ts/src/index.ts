import { type Health, healthSchema } from "@fides/contracts";
export function createFidesClient(
  baseUrl: string,
  fetcher: typeof fetch = fetch,
) {
  return {
    async health(signal?: AbortSignal): Promise<Health> {
      const response = await fetcher(
        new URL("/health", baseUrl),
        signal ? { signal } : {},
      );
      if (!response.ok) throw new Error("Fides API health request failed");
      return healthSchema.parse(await response.json());
    },
  };
}
