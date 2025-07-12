<script lang="ts" module>

  export interface Badi {
    name: "weyermannshaus" | "ka-we-de" | "lorraine" | "marzili" | "wyler";
    airTemperature: string;
    waterTemperature: string;
    occupancy: string;
  }

  export const isBadiName = (name: string): name is Badi["name"] => [
    "weyermannshaus",
    "ka-we-de",
    "lorraine",
    "marzili",
    "wyler"
  ].includes(name);

  export const isBadi = (badi: unknown): badi is Badi => (
    typeof badi === "object"
    && badi !== null
    && "name" in badi
    && typeof badi.name === "string"
    && isBadiName(badi.name)
    && "airTemperature" in badi
    && typeof badi.airTemperature === "string"
    && "waterTemperature" in badi
    && typeof badi.waterTemperature === "string"
    && "occupancy" in badi
    && typeof badi.occupancy === "string"
  );
</script>

<script lang="ts">
  interface BadiTileProps {
    name: Badi["name"];
  }

  const { name }: BadiTileProps = $props();

  let airTemperature = $state<Badi["airTemperature"]>("loading...");
  let waterTemperature = $state<Badi["waterTemperature"]>("loading...");
  let occupancy = $state<Badi["occupancy"]>("loading...");

  const getBadiData = async () => {
    const response = await fetch(`/api/badi/${name}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    if (isBadi(data)) {
      airTemperature = `${data.airTemperature}°c`;
      waterTemperature = `${data.waterTemperature}°c`;
      ({ occupancy } = data);
    }
  };

  $effect(() => {
    void getBadiData();
  });
</script>

<article class="badi-tile">
  <h2>{name}</h2>
  <p>air: {airTemperature}</p>
  <p>water: {waterTemperature}</p>
  <p>occupancy: {occupancy}</p>
</article>

<style lang="scss">
  .badi-tile {
    display: inline-block;
    padding: 16px 24px;
    margin: 8px;
    border: 1px solid rgb(135 206 235);
    border-radius: 8px;
  }
</style>
