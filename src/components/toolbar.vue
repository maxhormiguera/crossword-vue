<script setup lang="ts">

import Icon from "@/components/icon.vue";
</script>

<template>
<div class="toolbar">
  <button type="button" class="hint-btn">Hint</button>
  <icon name="double-arrow"  size="2rem"/>
</div>
</template>

<style scoped lang="stylus">
.toolbar
  padding 0.5rem 0.25rem
  border-radius $border-radius-sm $border-radius-sm 0 0
  background-color var(--theme-color)
  .hint-btn
    background-color var
</style>