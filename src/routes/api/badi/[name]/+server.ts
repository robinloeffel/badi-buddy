import { type Badi, isBadiName } from "$lib/components/badi-tile.svelte";
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

// eslint-disable-next-line max-statements
export const GET: RequestHandler = async ({ params }) => {
  const { name } = params;

  if (!isBadiName(name)) {
    return new Response("Invalid Badi name", { status: 400 });
  }

  const badiUrl = badis[name];
  const response = await fetch(badiUrl);
  const html = await response.text();

  const markup = new JSDOM(html).window.document;
  const facilityStatusBox = markup.querySelector(".facility-status-box");
  const [
    airTemperature = "n/a",
    waterTemperature = "n/a"
  ] = [...facilityStatusBox?.querySelectorAll(".degree span") ?? []].map(node => node.textContent?.trim());
  const occupancy = facilityStatusBox?.querySelector(".personen")?.classList.item(1) ?? "n/a";

  return json({
    name,
    airTemperature,
    waterTemperature,
    occupancy
  });
};
