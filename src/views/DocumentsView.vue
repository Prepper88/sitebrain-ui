<template>
  <div class="documents-page">
    <!-- 左侧：文件上传与列表 -->
    <div class="doc-sidebar">
      <h2>📄 Document Manager</h2>

      <!-- 文件上传 -->
      <div class="upload-box">
        <input
          ref="fileInput"
          type="file"
          accept=".pdf,.docx,.txt"
          @change="handleFileSelect"
          hidden
        />
        <button class="upload-btn" @click="triggerUpload">
          📤 Upload Document
        </button>
      </div>

      <!-- 文件列表 -->
      <ul class="file-list">
        <li
          v-for="(file, index) in files"
          :key="index"
          :id="`file-${file.name}`"
          :class="{ active: selectedFile && selectedFile.name === file.name }"
          @click="selectFile(file)"
        >
          <div class="file-header">
            <div class="file-name">{{ file.name }}</div>
            <button class="delete-btn" @click.stop="confirmDelete(file)">
              🗑
            </button>
          </div>
          <div class="file-meta">
            <span>{{ formatSize(file.size) }}</span>
            <span>{{ file.time }}</span>
          </div>
        </li>
      </ul>
    </div>

    <!-- 右侧：PDF 预览 -->
    <div class="doc-preview">
      <div v-if="!selectedFile" class="no-file">
        <p>👈 Select or upload a PDF to preview</p>
      </div>

      <div v-else class="pdf-viewer">
        <h3>{{ selectedFile.name }}</h3>
        <embed
          v-if="selectedFile.url"
          :src="selectedFile.url"
          type="application/pdf"
          width="100%"
          height="100%"
        />
        <div v-else class="no-preview">Preview not available</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted, onUnmounted, onActivated, onDeactivated } from "vue";

import emitter from "../eventBus";
import { nextTick } from "vue";

// emitter.on("select-document", (filename) => {
//   const file = files.value.find((f) => f.name === filename);
//   if (file) {
//     selectFile(file);

//     // 可选：滚动定位
//     setTimeout(() => {
//       const el = document.getElementById(filename);
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     }, 100);
//   }
// });

// 监听来自 Chat 的“选中文件”事件
emitter.on("select-document", (filename) => {
  if (!filename) return;

  // 找到对应的文件（后端返回 name 如 "646-668.pdf"）
  const target = files.value.find((f) => f.name === filename);

  if (target) {
    selectFile(target);

    // 可选：让左侧列表滚动到该文件位置
    nextTick(() => {
      const el = document.getElementById(`file-${target.name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
});

defineOptions({
  name: "DocumentsView",
});

onMounted(async () => {
  const res = await fetch("/api/files/list");
  files.value = await res.json();
});
onUnmounted(() => console.log("[DocumentsView] unmounted"));
onActivated(() => console.log("[DocumentsView] activated (from cache)"));
onDeactivated(() => console.log("[DocumentsView] deactivated (kept alive)"));

const files = ref([]);
const selectedFile = ref(null);
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value.click();
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/files/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  files.value.push({
    name: data.name,
    size: data.size,
    url: data.url,
    time: new Date().toLocaleTimeString(),
  });

  selectedFile.value = files.value[files.value.length - 1];
}

function selectFile(file) {
  selectedFile.value = file;
}

function confirmDelete(file) {
  if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
    deleteFile(file);
  }
}

async function deleteFile(file) {
  await fetch(`/api/files/delete/${encodeURIComponent(file.name)}`, {
    method: "DELETE",
  });

  const index = files.value.findIndex((f) => f.name === file.name);
  if (index !== -1) {
    files.value.splice(index, 1);

    selectedFile.value = files.value.length ? files.value[0] : null;
  }
}

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  return (kb / 1024).toFixed(2) + " MB";
}
</script>

<style scoped>
.documents-page {
  display: flex;
  height: 100vh;
  background-color: #fff;
  font-family: "Inter", system-ui, sans-serif;
}

/* 左侧文件栏 */
.doc-sidebar {
  width: 320px;
  border-right: 1px solid #eee;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f8;
}

.doc-sidebar h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.upload-box {
  margin-bottom: 20px;
}

.upload-btn {
  width: 100%;
  padding: 10px 0;
  background-color: #10a37f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}

.upload-btn:hover {
  background-color: #0e906f;
}

/* 文件列表 */
.file-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.file-list li {
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 6px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
}

.file-list li:hover {
  background-color: #eafaf4;
}

.file-list li.active {
  background-color: #d7f3ea;
  border-left: 3px solid #10a37f;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;
  word-break: break-all;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 16px;
  margin-left: 6px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #e74c3c;
}

.file-meta {
  font-size: 12px;
  color: #888;
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

/* 右侧 PDF 预览 */
.doc-preview {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.no-file {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 15px;
}

.pdf-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-viewer h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

embed {
  border: 1px solid #ddd;
  border-radius: 6px;
}
</style>
