<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import Toolbar from "@/components/toolbar.vue";

interface TileType {
  x: number,
  y: number,
  value?: string,
  state?: 'hover' | 'active' | 'disabled' | 'blank' | 'filled'
}

const { width, height, tileSize } = defineProps({
  width: { type: Number, default: 6 },
  height: { type: Number, default: 6 },
  tileSize: { type: Number, default: 40 },
})
let canvasSize = { width: (tileSize * width) + 2, height: (tileSize * height) + 2 }
let cwTiles:TileType[] = reactive(setTiles('new'))
let cursorTile = { x: 0, y: 0 }
let activeTile = { x: 0, y: 0 }
const horizontal = ref<Boolean>(true)
let selectedWord:{x:number, y:number}[] = []
console.log('::::: tiles ', cwTiles[0])

function findWord(nextTile: TileType|null = null) {
  let foreTiles = []
  let backTiles = []

  if (horizontal.value) {
    for(let rx = activeTile.x; getTile({x: rx, y: activeTile.y})?.value != '1' && rx < width; rx++) {
      foreTiles.push({x: rx, y: activeTile.y})
    }
    for(let rx = activeTile.x-1; getTile({x: rx, y: activeTile.y})?.value != '1' && rx >= 0; rx--) {
      backTiles.unshift({x: rx, y: activeTile.y})
    }
  }
  else {
    for(let ry = activeTile.y; getTile({x: activeTile.x, y: ry})?.value != '1' && ry < height; ry++) {
      foreTiles.push({x: activeTile.x, y: ry})
    }
    for(let ry = activeTile.y-1; getTile({x: activeTile.x, y: ry})?.value != '1' && ry >= 0; ry--) {
      backTiles.unshift({x: activeTile.x, y: ry})
    }
  }
  if (foreTiles.length == 1 && backTiles.length < 1) {
    horizontal.value = !horizontal.value
    return findWord()
  }

  // if nextTile is not null, move activeTile
  if (nextTile) {
    activeTile.x = nextTile.x
    activeTile.y = nextTile.y
  }
  return [...foreTiles, ...backTiles].sort((a,b) => a.x - b.x)
}

function getTile ({x, y}:TileType) {
  return cwTiles.find(tile => tile.x === x && tile.y === y)
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

  // draw the selected word tiles -- s
  selectedWord.forEach(tile => {
    ctx.fillStyle = '#00aa0044'
    ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
  })
  // draw the selected word tiles -- e

  // draw the tiles -- s
  cwTiles.forEach(tile => {
    if (tile.x === cursorTile.x && tile.y === cursorTile.y) {
      ctx.lineWidth = 2
      ctx.strokeStyle = '#f6a05a'
      ctx.strokeRect((tile.x * tileSize) + 1, (tile.y * tileSize) + 1, tileSize, tileSize)
    }
    if (tile.x === activeTile.x && tile.y === activeTile.y) {
      ctx.fillStyle = '#f6a05a66'
      ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
    }
    if (tile.value === '1') {
      ctx.fillStyle = '#00000088'
      ctx.fillRect((tile.x * tileSize) + 2, (tile.y * tileSize) + 2, tileSize - 2, tileSize - 2)
    }
    else {
      ctx.font = `${tileSize*0.75}px sans-serif`
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.fillText(<string>tile.value, (tile.x * tileSize) + (tileSize*0.5), (tile.y * tileSize) + (tileSize*0.825))
    }
  })
  // draw the tiles -- e

}

onMounted(() => {
  const canvas = document.getElementById('tileset') as HTMLCanvasElement
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')
    // Cursor.ctx = ctx
    // Active.ctx = ctx
    drawBackGround(canvas, ctx)

    canvas.addEventListener('mousemove', (evt: MouseEvent) => {
      const pos = getPos(evt, canvas)
      // Cursor.x = pos.x
      // Cursor.y = pos.y
      const thisTile:TileType|undefined = getTile({x: pos.x, y: pos.y})
      cursorTile.x = pos.x
      cursorTile.y = pos.y
      drawBackGround (canvas, ctx)
    })

    canvas.addEventListener('click', (evt: MouseEvent) => {
      const pos = getPos(evt, canvas)
      if (activeTile.x == pos.x && activeTile.y == pos.y) {
        horizontal.value = !horizontal.value
      }
      activeTile.x = pos.x
      activeTile.y = pos.y
      if (getTile(activeTile)?.value !== 'blocked') {
        selectedWord = findWord()
      }
      drawBackGround (canvas, ctx)
    })

    canvas.addEventListener('keyup', (evt: KeyboardEvent) => {
      const thisTile: TileType | undefined = getTile(activeTile)
      let nextTile = horizontal.value ? {x: activeTile.x + 1, y: activeTile.y} : {x: activeTile.x, y: activeTile.y + 1}
      let moveActiveTile = false
      if (!thisTile) return // tile not found
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(evt.code)) {
        nextTile = evt.code === 'ArrowLeft' ? {x: activeTile.x - 1, y: activeTile.y} :
          evt.code === 'ArrowRight' ? { x: activeTile.x + 1, y: activeTile.y } :
          evt.code === 'ArrowUp' ? {x: activeTile.x, y: activeTile.y - 1} :
          {x: activeTile.x, y: activeTile.y + 1}
        moveActiveTile = true
      } else if (evt.code === 'Digit1' || evt.code === 'Numpad1') {
        thisTile.value = '1'
        moveActiveTile = true

      } else if (evt.code === `Key${evt.key.toUpperCase()}`) {
        thisTile.value = evt.key.toUpperCase()
        moveActiveTile = true
      }
      if (moveActiveTile) {
        const nextTileValue = getTile({x: nextTile.x, y: nextTile.y})?.value
        if (nextTileValue || nextTileValue === '' || nextTileValue === ' ') {
          activeTile.x = nextTile.x
          activeTile.y = nextTile.y
          selectedWord = findWord(nextTile)
        }
      }
      drawBackGround(canvas, ctx)
    })
  }
})

function setTiles (action: 'new'|'clear') {
  const tiles = []
  console.log('::: new ')
  if (action === 'new') {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        tiles.push({ x: x, y: y, value: '', state: 'blank' });
      }
    }
  }
  return tiles
}


</script>

<template>
  <div class="tileset">
    <toolbar :horizontal="horizontal" @clear="setTiles('new')" />
    <canvas :width="canvasSize.width" :height="canvasSize.height" id="tileset" tabindex="0" />
  </div>
</template>

<style lang="stylus" scoped>

</style>