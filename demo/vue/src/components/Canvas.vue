<template>
  <div class="canvas">
    <div class="canvas__container" ref="canvasContainer">
      <canvas class="canvas__element" ref="canvasEl"></canvas>
    </div>
    <Toolbar
      @changeTool="changeTool"
      @undo="undo"
      @clear="clear"
    />
  </div>
</template>

<script>
import Drawl from '@drawl/drawl';

import Toolbar from '@/components/Toolbar';

export default {
  name: 'Canvas',
  components: {
    Toolbar,
  },
  data() {
    return {
      drawl: null,
    };
  },
  mounted() {
    const { width, height } = this.getContainerSize();

    // Set the initial canvas size to the parent container
    this.$refs.canvasEl.width = width;
    this.$refs.canvasEl.height = height;

    this.drawl = new Drawl(this.$refs.canvasEl);

    window.addEventListener('resize', this.resizeDrawlCanvas);
  },
  methods: {
    resizeDrawlCanvas() {
    const { width, height } = this.getContainerSize();

      this.drawl.scaleCanvas(width, height);
    },
    getContainerSize() {
      const { clientWidth, clientHeight } = this.$refs.canvasContainer;

      return { width: clientWidth, height: clientHeight };
    },
    changeTool(tool) {
      if(!this.drawl)
        return;

      this.drawl.setBrushMode(tool);
    },
    undo() {
      if(!this.drawl)
        return;

      this.drawl.undo();
    },
    clear() {
      if(!this.drawl)
        return;

      this.drawl.clearCanvas();
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.canvas {
  max-width: 840px;
  width: 100%;

  &__container {
    width: 100%;
    height: 0;

    position: relative;
    overflow: hidden;

    padding-top: 9 / 16 * 100%;

    border: 2px dotted #ccc;

    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

}
</style>
