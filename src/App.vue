<script setup>
import Tileset from "@/components/tileset.vue";
</script>

<template>
  <main>
    Run the tiles
    <tileset :width="12" :height="12" :tile-size="36" />
  </main>
</template>

<style lang="stylus" scoped>
main
  max-width $breakpoint-sm
  margin auto
</style>
