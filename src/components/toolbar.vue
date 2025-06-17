<script setup lang="ts">
import Icon from "@/components/icon.vue";

const { direction } = defineProps({
  direction: { type: String, default: "horizontal" },
})
</script>

<template>
<div class="toolbar">
  <icon :class="['direction-icon', `--${direction}`]" name="double-arrow" size="1.4rem" />
  <button type="button" class="hint-btn">Hint</button>
</div>
</template>

<style scoped lang="stylus">
.toolbar
  padding 0.5rem 0.25rem
  border-radius $border-radius-sm $border-radius-sm 0 0
  background-color var(--theme-color)
  flexbox center flex-start row 0.5rem
  .hint-btn
    background-color var(--theme-color)
    border 1px solid var(--text-inverse-color)
    color var(--text-inverse-color)
    border-radius $border-radius-sm
    padding 0.35rem 0.55rem
  .direction-icon
    color white
    background-color #fff3
    border-radius 50%
    padding 0.325rem
    transition rotate $transition-speed ease-in-out
    &.--vertical
      rotate 90deg


</style>