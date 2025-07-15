import { json } from "@sveltejs/kit";
import { kebabCase } from "es-toolkit";
import { JSDOM } from "jsdom";
import type { RequestHandler } from "./$types";

const getTemperature = (list: NodeListOf<Element>) => {
  if (list.length > 1) {
    const temperatureText = list.item(1).querySelector("span")?.textContent?.trim();
    const temperatureNumber = Number(temperatureText);

    return Number.isNaN(temperatureNumber) ? "Unbekannt" : `${temperatureNumber.toString()}°C`;
  }

  return "I weiss ni";
};

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  const url = "https://www.sportamt-bern.ch/anlagetyp/freibad/";
  const request = await fetch(url);
  const response = await request.text();
  const { document } = new JSDOM(response).window;

  const facilities = document.querySelectorAll(".facility-preview-box");
  const badis = [...facilities].map((facility) => {
    const name = facility.querySelector("h2")?.textContent?.trim() ?? "Unbekannt";
    const degreeElements = facility.querySelectorAll(".degree");
    const temperature = getTemperature(degreeElements);
    const open = Boolean(facility.querySelector(".specialhours")?.classList.contains("open"));
    const badiUrl = facility.querySelector("a.btn")?.getAttribute("href") ?? "https://www.sportamt-bern.ch/anlagetyp/freibad/";

    return {
      id: kebabCase(name),
      url: badiUrl,
      name,
      temperature,
      open
    };
  });

  setHeaders({ "Cache-Control": "max-age=600, immutable" });
  return json(badis);
};
