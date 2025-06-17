<script setup lang="ts">
import {onMounted} from "vue";

const { width, height, tileSize } = defineProps({
  width: { type: Number, default: 6 },
  height: { type: Number, default: 6 },
  tileSize: { type: Number, default: 40 },
})
let canvasSize = { width: (tileSize * width) + 2, height: (tileSize * height) + 2 }
let cursorTile = { x: 0, y: 0 }
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

class Tile {
  constructor(public ctx:CanvasRenderingContext2D|null,
              public x: number,
              public y: number,
              public state: 'hover' | 'active') {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.state = state;
  }
  draw () {
    if (this.ctx) {
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = '#f6a05a'
      this.ctx.strokeRect((this.x * tileSize) + 1, (this.y * tileSize) + 1, tileSize, tileSize)
    }
  }
}

let Cursor = new Tile(null, cursorTile.x, cursorTile.y, 'hover')

onMounted(() => {
  const canvas = document.getElementById('tileset') as HTMLCanvasElement
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')
    Cursor.ctx = ctx
    drawBackGround(canvas, ctx)

    canvas.addEventListener('mousemove', (evt: MouseEvent) => {
      const pos = getPos(evt, canvas)
      drawBackGround (canvas, ctx)
      Cursor.x = pos.x
      Cursor.y = pos.y
    })

  }
})

function getPos(evt: MouseEvent, canvas: HTMLCanvasElement) {
  return {
    x: Math.min(Math.floor((evt.clientX - canvas.offsetLeft) / tileSize), width - 1),
    y: Math.min(Math.floor((evt.clientY - canvas.offsetTop) / tileSize), height - 1),
  }
}

function drawBackGround(canvas:HTMLCanvasElement, ctx: CanvasRenderingContext2D|null) {
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw the grid -- s
  for (let x = 1; x <= canvas.width; x=x+tileSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
  }
  for (let y = 1; y <= canvas.height; y=y+tileSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
  }
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000000'
  ctx.stroke()
  // draw the grid -- e
  // draw the empty black tiles -- s
  blackTiles.forEach(tile => {
    ctx.fillStyle = '#00000088'
    ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
  })
  // draw the empty black tiles -- e

  Cursor.draw()
}

</script>

<template>
  <div class="tileset">
    <canvas :width="canvasSize.width" :height="canvasSize.height" id="tileset" />
  </div>

</template>

<style lang="stylus" scoped>

</style>