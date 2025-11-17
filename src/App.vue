<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="top-nav">
      <h2 class="logo">SiteBrain</h2>
      <nav class="tabs">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </header>
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, onBeforeUnmount } from "vue";
import emitter from "./eventBus";

const route = useRoute();
const router = useRouter();

const menu = [
  { label: "Chat", path: "/chat" },
  { label: "Documents", path: "/documents" },
];

// 监听 open-document 事件：切换到 Documents，再把文件名转发给 DocumentsView
function handleOpenDocument(filename) {
  // 切换到 Documents 页
  router.push("/documents");
  // 通知 DocumentsView 去选中这个文件
  emitter.emit("select-document", filename);
}

onMounted(() => {
  emitter.on("open-document", handleOpenDocument);
});

onBeforeUnmount(() => {
  emitter.off("open-document", handleOpenDocument);
});
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
  font-family: "Segoe UI", Arial, sans-serif;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e2e2;
  padding: 0 30px;
  height: 60px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

.tabs {
  display: flex;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  padding: 10px 0;
  border-bottom: 2px solid transparent;
  transition: 0.2s;
}

.nav-item:hover {
  color: #007bff;
}

.nav-item.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

/* 主体区域 */
.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
