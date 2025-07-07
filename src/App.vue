<script setup>
import Tilemap from "@/components/tilemap.vue";
</script>

<template>
  <main>
    <tilemap :width="16" :height="16" :tile-size="36" />
  </main>
</template>

<style lang="stylus" scoped>
main
  max-width $breakpoint-sm
  margin auto
</style>
