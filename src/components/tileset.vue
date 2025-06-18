<script setup lang="ts">
import {computed, eagerComputed, onMounted, reactive, ref} from "vue";
import Toolbar from "@/components/toolbar.vue";

interface Tile {
  x: number, y: number, value: string
}

const { width, height, tileSize } = defineProps({
  width: { type: Number, default: 6 },
  height: { type: Number, default: 6 },
  tileSize: { type: Number, default: 40 },
})
let canvasSize = { width: (tileSize * width) + 2, height: (tileSize * height) + 2 }
let cwTiles:Tile[] = reactive((() => {
  const tiles = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      tiles.push({ x: x, y: y, value: '' });
    }
  }
  return tiles
})())
let cursorTile = { x: 0, y: 0 }
const blackTiles = computed(() => {
  return cwTiles.filter(tile => tile.value == ' ')
})
const horizontal = ref<Boolean>(true)
let selectedWord:{x:number, y:number}[] = []

console.log('::::: tiles ', cwTiles[0])

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
        horizontal.value = !horizontal.value
      }
      Active.x = pos.x
      Active.y = pos.y
      if (getTileValue(Active.x, Active.y) !== 'blocked') {
        selectedWord = findWord()
      }
      drawBackGround (canvas, ctx)
    })

    canvas.addEventListener('keyup', (evt: KeyboardEvent) => {
      const thisTile: Tile | undefined = cwTiles.find(({x, y}) => Active.x === x && Active.y === y)
      console.log('::: evt.code ', evt.code)
      if (!thisTile) return // tile not found
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(evt.code)) {
        const nextTile = evt.code === 'ArrowLeft' ? {x: (Active.x - 1), y: Active.y} :
          evt.code === 'ArrowRight' ? { x: (Active.x + 1), y: Active.y } :
          evt.code === 'ArrowUp' ? {x: Active.x, y: (Active.y - 1)} :
            {x: Active.x, y: (Active.y + 1)}
        const nextTileValue = getTileValue(nextTile.x, nextTile.y)
        if (nextTileValue || nextTileValue === '') {
          Active.x = nextTile.x
          Active.y = nextTile.y
        }
      } else if (evt.code === 'Space') {
        thisTile.value = ' '
      } else if (evt.code === `Key${evt.key.toUpperCase()}`) {
        thisTile.value = evt.key.toUpperCase()
        moveTypingCursor()
      }
      drawBackGround(canvas, ctx)
    })
  }
})

function moveTypingCursor() {
  console.log('::: selectedWord ', selectedWord)
  if (horizontal.value) {

  }
}

function findWord() {
  getTileValue(Active.x, Active.y)
  let foreTiles = []
  let backTiles = []

  if (horizontal.value) {
    for(let rx = Active.x; getTileValue(rx, Active.y) != 'blocked' && rx < width; rx++) {
      foreTiles.push({x: rx, y: Active.y})
    }
    for(let rx = Active.x-1; getTileValue(rx, Active.y) != 'blocked' && rx >= 0; rx--) {
      backTiles.unshift({x: rx, y: Active.y})
    }
  }
  else {
    for(let ry = Active.y; getTileValue(Active.x, ry) != 'blocked' && ry < height; ry++) {
      foreTiles.push({x: Active.x, y: ry})
    }
    for(let ry = Active.y-1; getTileValue(Active.x, ry) != 'blocked' && ry >= 0; ry--) {
      backTiles.unshift({x: Active.x, y: ry})
    }
  }
  if (foreTiles.length == 1 && backTiles.length < 1) {
    horizontal.value = !horizontal.value
    return findWord()
  }
  return [...foreTiles, ...backTiles].sort((a,b) => a.x - b.x)
}

function getTileValue (x: number, y: number) {
  return cwTiles.find(tile => tile.x === x && tile.y === y)?.value
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
  cwTiles.forEach(tile => {
    if (tile.value === ' ') {
      ctx.fillStyle = '#00000088'
      ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
    }
    else {
      ctx.font = "32px sans-serif"
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.fillText(tile.value.toUpperCase(), (tile.x * tileSize) + (tileSize*0.5), (tile.y * tileSize) + (tileSize*0.85))
    }
  })
  // draw the empty black tiles -- e

  // draw the selected word tiles -- s
  selectedWord.forEach(tile => {
    ctx.fillStyle = '#00aa0044'
    ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
  })
  // draw the selected word tiles -- e

  // letterTiles.forEach(tile => {
  //   ctx.font = "32px sans-serif"
  //   ctx.fillStyle = '#000000'
  //   ctx.textAlign = 'center'
  //   ctx.fillText(tile.value.toUpperCase(), (tile.x * tileSize) + (tileSize*0.5), (tile.y * tileSize) + (tileSize*0.85))
  // })
  Cursor.draw()
  Active.draw()
}


</script>

<template>
  <div class="tileset">
    <toolbar :horizontal="horizontal" />
    <canvas :width="canvasSize.width" :height="canvasSize.height" id="tileset" tabindex="0" />
  </div>
</template>

<style lang="stylus" scoped>

</style>