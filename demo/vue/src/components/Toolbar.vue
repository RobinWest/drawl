<template>
  <div class="toolbar">
    <button @click="changeTool('pencil')">Pen</button>
    <button @click="changeTool('eraser')">Eraser</button>
    |
    <button @click="undo">Undo</button>
    <button @click="clear">Clear</button>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
  methods: {
    changeTool(tool) {
      this.$emit('changeTool', tool);
    },
    undo() {
      this.$emit('undo');
    },
    clear() {
      this.$emit('clear');
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toolbar {

}
</style>
