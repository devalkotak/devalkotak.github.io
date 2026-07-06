import resourcesPayload from "@/content/generated/resources.json";
import type { ResourceItem, ResourceLoadState } from "./types";

type ResourcesPayload = {
  generatedAt: string;
  error: string | null;
  resources: ResourceItem[];
};

const payload = resourcesPayload as ResourcesPayload;

export function getResources(): ResourceItem[] {
  return mergeResources(payload.resources);
}

export function getResourceState(): ResourceLoadState {
  return {
    resources: getResources(),
    error: payload.error,
  };
}

function mergeResources(resources: ResourceItem[]): ResourceItem[] {
  const seen = new Set<string>();
  const merged: ResourceItem[] = [];

  for (const resource of resources) {
    if (seen.has(resource.id)) {
      continue;
    }
    seen.add(resource.id);
    merged.push(resource);
  }

  return merged;
}
