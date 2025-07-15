<script lang="ts">
  import Badi from "$components/badi.svelte";
  import type { BadiResponse } from "$lib/shared/badi-response";

  interface BadiListProps {
    title: string;
    badis: BadiResponse;
    source: {
      url: string;
      name: string;
    };
  }

  const { title, badis, source }: BadiListProps = $props();

  let filter = $state("");
</script>

<h2>{title}</h2>
<input
  class="badi-list-filter"
  placeholder="Ussieble"
  type="text"
  bind:value={filter}
/>
<ul class="badi-list">
  {#each badis as badi (badi.id)}
    <li class={["badi-list-item", { hidden: !badi.name.toLowerCase().includes(filter.toLowerCase()) }]}>
      <Badi {...badi} />
    </li>
  {/each}
</ul>
<p>
  <small>
    Date vo: <a href={source.url}>{source.name}</a>
  </small>
</p>

<style lang="scss">
  .badi-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
    gap: 1rem;
  }

  .badi-list-item {
    contain: content;
    transition:
      opacity 0.2s ease-in-out,
      translate 0.2s ease-in-out;

    @media (pointer: fine) {
      :not(:has(.hidden)):has(&:hover) > &:hover {
        translate: 0 -4px;
      }

      :not(:has(.hidden)):has(&:hover) > &:not(:hover) {
        opacity: 0.5;
      }
    }

    &.hidden {
      pointer-events: none;
      user-select: none;
      opacity: 0.1;
    }
  }

  .badi-list-filter {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    line-height: 1.1;
    color: #ddd;
    background: 0;
    border: 1px solid #222;
    border-radius: 8px;
  }
</style>
