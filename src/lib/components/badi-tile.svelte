<script lang="ts" module>
  export interface Badi {
    name: "weyermannshaus" | "ka-we-de" | "lorraine" | "marzili" | "wyler";
    air: string;
    pool: string;
    aare: string | null;
    occupancy: string;
    url: string;
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
    && "air" in badi
    && typeof badi.air === "string"
    && "pool" in badi
    && typeof badi.pool === "string"
    && "occupancy" in badi
    && typeof badi.occupancy === "string"
    && "url" in badi
    && typeof badi.url === "string"
  );
</script>

<script lang="ts">
  interface BadiTileProps {
    title: string;
    name: Badi["name"];
  }

  const { title, name }: BadiTileProps = $props();

  let isLoaded = $state(false);
  let air = $state<Badi["air"]>("");
  let pool = $state<Badi["pool"]>("");
  let aare = $state<Badi["aare"]>(null);
  let occupancy = $state<Badi["occupancy"]>("");
  let url = $state<string>();

  const getBadiData = async () => {
    const response = await fetch(`/api/badi/${name}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();

    if (isBadi(data)) {
      ({ air, pool, aare, occupancy, url } = data);
      isLoaded = true;
    }
  };

  $effect(() => {
    void getBadiData();
  });
</script>

<article class={["badi-tile", { loaded: isLoaded }]}>
  <div class="header">
    <h2 class="title">{title}</h2>
  </div>
  <div class="body">
    <span>Luft:</span> <span>{air}</span>
    <span>Wasser:</span> <span>{pool} {#if aare}/ {aare}{/if}</span>
    <span>Lüt:</span> <span>{occupancy}</span>
  </div>
  <div class="footer">
    <a class="more" href={url} rel="noopener noreferrer" target="_blank">
      sportamt-bern.ch
    </a>
  </div>
</article>

<style lang="scss">
  .badi-tile {
    position: relative;
    display: inline-block;
    contain: content;
    overflow: clip;
    border: 1px solid #333;
    border-radius: 0.5rem;
    transition:
      translate 0.15s ease-in-out,
      opacity 0.15s ease-in-out;

    &:hover {
      translate: 0 -0.25rem;
    }
  }

  :global :has(.badi-tile:hover) > .badi-tile:not(:hover) {
    opacity: 0.5;
  }

  .header,
  .body,
  .footer {
    padding: 1rem 1.25rem;
  }

  .header,
  .footer {
    background-color: #222;
  }

  .header {
    border-bottom: 1px solid #333;
  }

  .body {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;

    &::before {
      position: absolute;
      inset: 0;
      content: "";
      backdrop-filter: blur(2rem);
      transition: opacity 0.5s ease-in-out;
    }

    .loaded &::before {
      pointer-events: none;
      opacity: 0;
    }
  }

  .footer {
    border-top: 1px solid #333;
  }

  .more {
    display: block;
    width: fit-content;
    font-size: 0.9rem;
    color: inherit;
  }
</style>
