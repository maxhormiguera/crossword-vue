<script setup>
import Tileset from "@/components/tileset.vue";
</script>

<template>
  <main>
    Run the tiles
    <tileset :width="8" :height="10" />
  </main>
</template>

<style lang="stylus" scoped>
main
  max-width $breakpoint-sm
  margin auto
</style>
