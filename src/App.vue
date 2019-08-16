<template>
  <div id="app">
    <button @click="anotherGrid(true)" class="anotherBtn">
      +Grid
    </button>
    <button v-if="grids > 1" @click="anotherGrid(false)" class="anotherBtn add-margin">
      -Grid
    </button>
    <br>
    <ul>
      <Grid v-for="n in grids" :key="'grid#' + n" class="grid-pad"/>
    </ul>
  </div>
</template>

<script>
import Grid from "@/components/Grid";

export default {
  name: 'App',
  components: { Grid },

  data() {
    return {
      grids: 1,
    }
  },

  methods: {
    //Add or subject grids, to show that each grid is its own separate component
    anotherGrid(add) {
      if(add) {
        this.grids++;
      } else {
        this.grids--;
      }
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 5px;
  }
  .anotherBtn {
    padding: 5px;
    font-size: 20px;
    font-weight: bold;
    color: #212529;
  }
  .grid-pad {
    padding-left: 10px;
  }
  ul {
    padding-left: 0;
    margin-top: 6px;
  }
  .add-margin {
    margin-left: 12px;
  }
</style>
