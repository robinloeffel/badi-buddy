import type { AirResponse } from "$lib/shared/air-response";
import { json, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface EndpointResponse {
  crs: Crs;
  license: string;
  mapname: string;
  map_long_name: string;
  map_short_name: string;
  map_abstract: string;
  creation_time: string;
  type: string;
  features: Feature[];
}

export interface Crs {
  type: string;
  properties: Properties;
}

export interface Properties {
  name: string;
}

export interface Feature {
  type: string;
  geometry: Geometry;
  id: string;
  properties: Station;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Station {
  station_name: string;
  station_symbol: number;
  value: number;
  unit: string;
  reference_ts: string;
  altitude: string;
  measurement_height: string;
  description: string;
}

const isEndpointResponse = (data: unknown): data is EndpointResponse => (
  data !== null
  && typeof data === "object"
  && "crs" in data
  && "license" in data
  && "mapname" in data
  && "map_long_name" in data
  && "map_short_name" in data
  && "map_abstract" in data
  && "creation_time" in data
  && "type" in data
  && "features" in data
  && Array.isArray(data.features)
);

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  const url = "https://data.geo.admin.ch/ch.meteoschweiz.messwerte-lufttemperatur-10min/ch.meteoschweiz.messwerte-lufttemperatur-10min_en.json";
  const response = await fetch(url);
  const data: unknown = await response.json();

  if (!isEndpointResponse(data)) {
    return text("invalid response format", {
      status: 500
    });
  }

  const stations: AirResponse = data.features.map(
    feature => ({
      id: feature.id,
      name: feature.properties.station_name,
      temperature: Math.round(feature.properties.value).toString() + feature.properties.unit
    })
  ).filter(
    station => ["BER", "REH"].includes(station.id)
  );

  setHeaders({ "Cache-Control": "max-age=600, immutable" });
  return json(stations);
};
