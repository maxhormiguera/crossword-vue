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
] // this set of black squares is temporary
let direction:'vertical' | 'horizontal' = 'horizontal'
let selectedWord:{x:number, y:number}[] = []

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
      this.ctx.strokeStyle = this.state == 'hover' ? '#f6a05a' : '#fd806c'
      this.ctx.strokeRect((this.x * tileSize) + 1, (this.y * tileSize) + 1, tileSize, tileSize)
    }
  }
}

const Cursor = new Tile(null, cursorTile.x, cursorTile.y, 'hover')
const Active = new Tile(null, cursorTile.x, cursorTile.y, 'active')

onMounted(() => {
  const canvas = document.getElementById('tileset') as HTMLCanvasElement
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')
    Cursor.ctx = ctx
    Active.ctx = ctx
    drawBackGround(canvas, ctx)

    canvas.addEventListener('mousemove', (evt: MouseEvent) => {
      const pos = getPos(evt, canvas)
      Cursor.x = pos.x
      Cursor.y = pos.y
      drawBackGround (canvas, ctx)
    })

    canvas.addEventListener('click', (evt: MouseEvent) => {
      const pos = getPos(evt, canvas)
      if (Active.x == pos.x && Active.y == pos.y) {
        direction = direction === 'horizontal' ? 'vertical' : 'horizontal'
      }
      Active.x = pos.x
      Active.y = pos.y
      if (getTileState(Active.x, Active.y) !== 'blocked') {
        selectedWord = findWord()
      }
      drawBackGround (canvas, ctx)
    })

  }
})

function findWord() {
  getTileState(Active.x, Active.y)
  let foreTiles = []
  let backTiles = []

  if (direction == 'horizontal') {
    for(let rx = Active.x; getTileState(rx, Active.y) != 'blocked' && rx < width; rx++) {
      foreTiles.push({x: rx, y: Active.y})
    }
    for(let rx = Active.x-1; getTileState(rx, Active.y) != 'blocked' && rx >= 0; rx--) {
      backTiles.unshift({x: rx, y: Active.y})
    }
  } else {
    for(let ry = Active.y; getTileState(Active.x, ry) != 'blocked' && ry < height; ry++) {
      foreTiles.push({x: Active.x, y: ry})
    }
    for(let ry = Active.y-1; getTileState(Active.x, ry) != 'blocked' && ry >= 0; ry--) {
      backTiles.unshift({x: Active.x, y: ry})
    }
  }
  if (foreTiles.length == 1 && backTiles.length < 1) {
    direction = direction == 'vertical' ? 'horizontal' : 'vertical'
    return findWord()
  }
  return [...foreTiles, ...backTiles].sort((a,b) => a.x - b.x)
}

function getTileState (x: number, y: number) {
  const isBlocked = blackTiles.findIndex(tile => tile.x === x && tile.y === y)
  return isBlocked !== -1 ? 'blocked' : 'letter'
}

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

  // draw the selected word tiles -- s
  selectedWord.forEach(tile => {
    ctx.fillStyle = '#00aa0044'
    ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
  })
  // draw the empty black tiles -- e

  Cursor.draw()
  Active.draw()
}

</script>

<template>
  <div class="tileset">
    <canvas :width="canvasSize.width" :height="canvasSize.height" id="tileset" />
  </div>

</template>

<style lang="stylus" scoped>

</style>