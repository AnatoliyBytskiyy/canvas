<template>
  <div id="app">
<!--    <img src="./assets/logo.png"/>-->
    <Convas/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Convas from './components/Convas.ts';

@Component({
  components: {
    Convas,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
$bg_clr: #E1E1E1;
$title_clr: #AAA;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
  overflow-x:  hidden;
}

#A, #B {
  min-width: -webkit-fill-available;
  background-color: $bg_clr;
}

#log {
  width: 100%;
  height: 350px;
  border: 1px solid $bg_clr;
  padding: 10px;
  overflow-y: auto;
}

h3 {
  color: $title_clr;
}

img {
  width: 300px;
  height: 200px;
}

#C {
  display: none;
  width: 50px;
  height: 50px;
  position: absolute;
  background-color: inherit;
  z-index: 999999999999;
}

.data {
  color: $title_clr;
}

.obj_name {
  color: green;
}

.container_name {
  color: blue;
}
</style>
