<script lang="ts">
  import favicon from "$img/favicon.avif";
  import "$styles/base.scss";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<svelte:head>
  <title>Badi Buddy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href={favicon} rel="icon" type="image/avif" />
</svelte:head>

{@render children()}
