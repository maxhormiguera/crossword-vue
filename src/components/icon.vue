<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const { name } = defineProps({
  name: { type: String, required: true },
  size: { type: String, required: true },
})

const icon = defineAsyncComponent(() => import(`../assets/icons/${name}.svg`))
</script>

<template>
  <span class="icon-wrapper">
    <component :is="icon" class="icon" fill="currentColor" />
  </span>
</template>

<style scoped lang="stylus">
.icon-wrapper
  display inline-block
  width v-bind(size)
  height v-bind(size)
  .icon
    width-height 100%
</style>
