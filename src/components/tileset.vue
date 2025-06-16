<script setup lang="ts">
import {onMounted} from "vue";

const { width, height, tileSize } = defineProps({
  width: { type: Number, default: 6 },
  height: { type: Number, default: 6 },
  tileSize: { type: Number, default: 40 },
})


let canvasSize = { width: (tileSize * width) + 2, height: (tileSize * height) +2 }



const blackTiles = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 5, y: 1 },
  { x: 7, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 7, y: 2 },
  { x: 7, y: 3 },
  { x: 4, y: 3 },
  { x: 5, y: 3 },
  { x: 1, y: 4 },
  { x: 7, y: 4 },
  { x: 1, y: 5 },
  { x: 2, y: 5 },
  { x: 3, y: 5 },
  { x: 4, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 1, y: 6 },
  { x: 3, y: 6 },
  { x: 6, y: 6 },
  { x: 3, y: 8 },
  { x: 4, y: 8 },
  { x: 6, y: 8 },
  { x: 0, y: 9 },
  { x: 1, y: 9 },
  { x: 6, y: 9 },
]


function cursorTile(ctx:CanvasRenderingContext2D, x: number, y: number , state: 'hover' | 'active') {
  this.x = x;
  this.y = y;
  this.state = state;
  this.draw = () => {
    ctx.lineWidth = 2
    ctx.strokeStyle = '#c6a05a'
    ctx.strokeRect((this.x * tileSize)+1, (this.y * tileSize)+1, tileSize, tileSize)
  }
}

function drawBackGround(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // draw the grid -- s
  for (let x = 1; x <= width; x=x+tileSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = 1; y <= height; y=y+tileSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000000'
  ctx.stroke()
  // draw the grid -- e
  // draw the empty black tiles -- s
  blackTiles.forEach(tile => {
    ctx.fillStyle = '#00000088'
    ctx.fillRect((tile.x * tileSize)+2, (tile.y * tileSize)+2, tileSize-2, tileSize-2)
  })
  // draw the empty black tiles -- e
}


onMounted(() => {
  const canvas = document.getElementById('tileset') as HTMLCanvasElement
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')

    drawBackGround(ctx, canvas.width, canvas.height)

    let Cursor = new cursorTile(ctx, 0, 0, 'hover')
    Cursor.draw()

    canvas.addEventListener('mousemove', (evt: MouseEvent) => {
      const pos = {
        x: Math.floor((evt.clientX - canvas.offsetLeft) / tileSize),
        y: Math.floor((evt.clientY - canvas.offsetTop) / tileSize),
      }
      console.log('m')
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      Cursor.x = pos.x
      Cursor.y = pos.y
      drawBackGround(ctx, canvas.width, canvas.height)
      Cursor.draw()
    })

  }


})





</script>

<template>
  <div class="tileset">
    <canvas :width="canvasSize.width" :height="canvasSize.height" id="tileset" />
  </div>

</template>

<style lang="stylus" scoped>

</style>