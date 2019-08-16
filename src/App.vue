<template>
  <div id="app">
    <button class="anotherBtn" v-if="!secondGrid" @click="anotherGrid">
      Want to have two grids?
    </button>
    <button class="anotherBtn" v-if="secondGrid" @click="anotherGrid">
      I only want one grid
    </button>
    <br>
    <ul>
      <Grid />
      <Grid class="grid-pad" v-if="secondGrid" />
    </ul>
  </div>
</template>

<script>
import Grid from "@/components/Grid";

export default {
  name: 'app',
  components: { Grid },

  data() {
    return {
      secondGrid: false
    }
  },

  methods: {
    //toggle a second grid to show that each grid is its own separate component
    anotherGrid() {
      this.secondGrid = !this.secondGrid;
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
    margin-top: 10px;
  }
  .anotherBtn {
    padding: 10px;
    font-size: 20px;
  }
  .grid-pad {
    padding-left: 10px;
  }
  ul {
    padding-left: 0;
  }
</style>
