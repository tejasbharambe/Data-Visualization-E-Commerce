<template>
  <div class="home">
    <div class="container-fluid">
      <h2>Analysis of Customers Based on Maps</h2>
      <h2>Clickable and Draggable Maps</h2>
      <div>
        <p>
          Click to select a state on the SVG map that you would like to compare, 
          then click on different states to compare to the first one you chose. <br>
          Drag states around the leaflet map and on top of one another to compare size.<br>
          Hit "Reset SVG" to redraw the map and clear selections. Hit "Reset Slippy" to redraw the leaflet map and set states in their initial location.
        </p>
      </div>
      <MapsC></MapsC>
    </div>
  </div>
</template>
<script>
  // @ is an alias to /src
  import MapsC from "../components/MapsC.vue";

  export default {
    name: 'MapboxC',
    components: {
      MapsC
    }
  }
</script>
<style>
  h2 {
      text-align: center;
  }
</style>