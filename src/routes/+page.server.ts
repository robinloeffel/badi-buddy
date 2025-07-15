/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { isAirResponse } from "$lib/shared/is-air-response";
import { isBadiResponse } from "$lib/shared/is-badi-response";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  const airRequest = await fetch("/api/air-temp");
  const airResponse = await airRequest.json();
  const air = isAirResponse(airResponse) ? airResponse : [];

  const zurichRequest = await fetch("/api/badis/zurich");
  const zurichResponse = await zurichRequest.json();
  const zurich = isBadiResponse(zurichResponse) ? zurichResponse : [];

  const bernRequest = await fetch("/api/badis/bern");
  const bernResponse = await bernRequest.json();
  const bern = isBadiResponse(bernResponse) ? bernResponse : [];

  return { air, bern, zurich };
};
