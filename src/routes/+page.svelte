<script lang="ts">
  import BadiTile from "$components/badi-tile.svelte";
</script>

<h1 class="title">Badi Buddy</h1>
<div class="badi-tiles">
  <BadiTile name="weyermannshaus" title="Weyerli" />
  <BadiTile name="lorraine" title="Lorraine" />
  <BadiTile name="marzili" title="Marzili" />
  <BadiTile name="wyler" title="Wyler" />
  <BadiTile name="ka-we-de" title="Ka-We-De" />
</div>

<style lang="scss">
  .title {
    margin-bottom: 1.5rem;
    font-family: "Playfair Display Variable", serif;
    font-size: 3rem;
    font-weight: normal;
  }

  .badi-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1rem;
  }
</style>
