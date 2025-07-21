import type { BadiResponse } from "$lib/shared/badi-response";
import { json, text } from "@sveltejs/kit";
import { XMLParser } from "fast-xml-parser";
import type { RequestHandler } from "./$types";

interface ZurichData {
  "?xml": string;
  "bathinfos": {
    baths: ZurichDataBaths;
    meta: ZurichDataMeta;
  };
}

interface ZurichDataBaths {
  bath: ZurichDataBath[];
}

interface ZurichDataBath {
  title: string;
  temperatureWater: number;
  poiid: string;
  dateModified: string;
  openClosedTextPlain: string;
  urlPage: string;
  pathPage: string;
}

interface ZurichDataMeta {
  version: number;
  releasenotes: string;
  deprecated: string;
  contactEmail: string;
  dateformat: string;
  urlLegal: string;
  dateTimeSent: string;
  latestDateModified: string;
  outputformat: {
    requestParamName: "outputformat";
    supportedformats: "XML";
    defaultformat: "XML";
  };
  orderedBy: {
    property: "title";
    mode: "ascending";
  };
}

const isZurichData = (data: unknown): data is ZurichData => (
  typeof data === "object"
  && data !== null
  && "?xml" in data
  && "bathinfos" in data
  && typeof data.bathinfos === "object"
  && data.bathinfos !== null
  && "baths" in data.bathinfos
  && "meta" in data.bathinfos
);

const parseZurichXml = (data: string) => {
  const parsed: unknown = new XMLParser().parse(data);
  return isZurichData(parsed) ? parsed : null;
};

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  const url = "https://www.stadt-zuerich.ch/stzh/bathdatadownload";
  const xmlResponse = await fetch(url);
  const xmlText = await xmlResponse.text();
  const data = parseZurichXml(xmlText);

  if (!data) {
    return text("invalid data", {
      status: 500
    });
  }

  const badis: BadiResponse = data.bathinfos.baths.bath.map(bath => ({
    id: bath.poiid,
    name: bath.title,
    temperature: `${bath.temperatureWater.toString()}°C`,
    open: bath.openClosedTextPlain === "offen",
    url: bath.urlPage
  }));

  setHeaders({ "Cache-Control": "max-age=600, immutable" });
  return json(badis);
};
