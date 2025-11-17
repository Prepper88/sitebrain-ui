<script setup>
import emitter from "@/eventBus";
defineProps({ sources: Array });

function openDoc(src) {
  const filename = src.title.replace(/^docs\//, "");
  emitter.emit("open-document", filename);
}
</script>

<template>
  <div class="sources">
    <div v-for="(src, idx) in sources" :key="idx" class="source-item">
      <span class="link" @click="openDoc(src)">
        📄 {{ src.title }} (Section {{ src.section }})
      </span>
    </div>
  </div>
</template>

<style scoped>
.source-item .link {
  cursor: pointer;
  color: #0077ff;
  text-decoration: underline;
}
</style>
