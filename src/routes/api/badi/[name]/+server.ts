import { type Badi, isBadiName } from "$components/badi-tile.svelte";
import { json } from "@sveltejs/kit";
import { JSDOM } from "jsdom";
import type { RequestHandler } from "./$types";

const badis: Record<Badi["name"], string> = {
  "weyermannshaus": "https://www.sportamt-bern.ch/sportanlage/freibad-weyermannshaus/",
  "ka-we-de": "https://www.sportamt-bern.ch/sportanlage/freibad-ka-we-de/",
  "lorraine": "https://www.sportamt-bern.ch/sportanlage/freibad-lorraine/",
  "marzili": "https://www.sportamt-bern.ch/sportanlage/marzili/",
  "wyler": "https://www.sportamt-bern.ch/sportanlage/freibad-wyler/"
};

const occupancyStatusMap: Record<string, string> = {
  "status-0": "Viu",
  "status-1": "Weni",
  "status-2": "Mittu"
};

const formatTemperature = (temperature?: string) => {
  const numberValue = Number(temperature);
  return Number.isNaN(numberValue) ? "--" : `${String(Math.round(numberValue))} °C`;
};

// eslint-disable-next-line max-statements
export const GET: RequestHandler = async ({ params, setHeaders }) => {
  const { name } = params;

  if (!isBadiName(name)) {
    return new Response("Invalid Badi name", { status: 400 });
  }

  const url = badis[name];
  const response = await fetch(url);
  const html = await response.text();
  const { document } = new JSDOM(html).window;

  const facilityStatusNode = document.querySelector<HTMLDivElement>(".facility-status-box");
  const occupancyNode = facilityStatusNode?.querySelector<HTMLSpanElement>(".personen");
  const temperatureNodes = facilityStatusNode?.querySelectorAll<HTMLSpanElement>(".degree span");
  const airTemperatureNode = temperatureNodes?.item(0);
  const poolTemperatureNode = temperatureNodes?.item(1);
  const aareTemperatureNode = temperatureNodes?.item(2);
  const occupancyClass = occupancyNode?.classList.item(1) ?? "";

  const occupancy = occupancyStatusMap[occupancyClass] ?? "--";
  const air = formatTemperature(airTemperatureNode?.textContent?.trim());
  const pool = formatTemperature(poolTemperatureNode?.textContent?.trim());
  const aare = aareTemperatureNode ? formatTemperature(aareTemperatureNode.textContent?.trim()) : null;

  setHeaders({ "Cache-Control": "max-age=600, immutable" });
  return json({ name, air, pool, aare, occupancy, url });
};
