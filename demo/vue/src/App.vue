<template>
  <div id="app">
    <h1>Drawl Vue Demo</h1>

    <div class="container">
      <Canvas/>
    </div>
  </div>
</template>

<script>
import Canvas from '@/components/Canvas';

export default {
  name: 'App',
  components: {
    Canvas,
  },
};
</script>

<style lang="scss">
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
