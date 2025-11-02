<template>
  <div class="sources">
    <div v-for="(src, idx) in sources" :key="idx" class="source-item">
      <a :href="src.url" target="_blank">
        📄 {{ src.title }} (Section {{ src.section }})
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({ sources: Array });
</script>

<style scoped>
.sources {
  margin-top: 5px;
  font-size: 0.9em;
  color: #555;
}
.source-item {
  margin: 3px 0;
}
</style>
