<script lang="ts">
  import favicon from "$img/favicon.avif";
  import "$styles/base.scss";
  import inter from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2";
  import playfairDisplay from "@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<svelte:head>
  <link as="font" crossorigin="anonymous" href={inter} rel="preload" type="font/woff2" />
  <link as="font" crossorigin="anonymous" href={playfairDisplay} rel="preload" type="font/woff2" />
  <meta charset="utf-8" />
  <title>Badi Buddy</title>
  <meta name="description" content="E gäbigi Übersicht für d Badis ir Stadt Bärn." />
  <meta name="keywords" content="badi, bern, freibad" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href={favicon} rel="icon" type="image/avif" />
</svelte:head>

{@render children()}
