import type { BadiResponse, BadiResponseItem } from "./badi-response";

const isBadiResponseItem = (item: unknown): item is BadiResponseItem => (
  item !== null
  && typeof item === "object"
  && "id" in item
  && typeof item.id === "string"
  && "name" in item
  && typeof item.name === "string"
  && "temperature" in item
  && typeof item.temperature === "string"
  && "open" in item
  && typeof item.open === "boolean"
  && "url" in item
  && typeof item.url === "string"
);

export const isBadiResponse = (data: unknown): data is BadiResponse => (
  Array.isArray(data) && data.every(item => isBadiResponseItem(item))
);
