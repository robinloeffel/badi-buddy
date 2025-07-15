import type { AirResponse, AirResponseItem } from "./air-response";

const isAirResponseItem = (item: unknown): item is AirResponseItem => (
  item !== null
  && typeof item === "object"
  && "id" in item
  && typeof item.id === "string"
  && "name" in item
  && typeof item.name === "string"
  && "temperature" in item
  && typeof item.temperature === "string"
);

export const isAirResponse = (data: unknown): data is AirResponse => (
  Array.isArray(data) && data.every(item => isAirResponseItem(item))
);
