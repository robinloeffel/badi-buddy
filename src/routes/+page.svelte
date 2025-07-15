<script lang="ts">
  import BadiList from "$components/badi-list.svelte";
  import type { PageProps } from "./$types";

  const { data }: PageProps = $props();
</script>

<h1>Badi Buddy</h1>
<p>E gäbigi Übersicht für d Badis i de Stedt Bärn u Züri.</p>

<h2>Lufttämperatur</h2>
<ul>
  {#each data.air as { id, temperature } (id)}
    <li>{id === "BER" ? "Bärn" : "Züri"}: {temperature}</li>
  {/each}
</ul>
<p>
  <small>
    Date vo: <a href="https://opendata.swiss/de/dataset/messwerte-lufttemperatur-2-m-10-min-mittel">MeteoSchweiz</a>.
  </small>
</p>

<BadiList
  badis={data.bern}
  source={{
    url: "https://www.sportamt-bern.ch/anlagetyp/freibad/",
    name: "Sportamt Bärn"
  }}
  title="Badis ds Bärn"
/>

<BadiList
  badis={data.zurich}
  source={{
    url: "https://opendata.swiss/de/dataset/wassertemperaturen-freibader",
    name: "Stadt Züri"
  }}
  title="Badis ds Züri"
/>
