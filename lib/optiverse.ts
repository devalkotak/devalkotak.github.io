import optiversePayload from "@/content/generated/optiverse.json";
import type { OptiverseContent } from "./types";

const payload = optiversePayload as OptiverseContent;

export function getOptiverseContent(): OptiverseContent {
  return payload;
}
