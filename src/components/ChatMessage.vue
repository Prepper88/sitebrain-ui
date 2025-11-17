<template>
  <div class="chat-message" :class="role">
    <!-- User message -->
    <div v-if="role === 'user'" class="msg user-msg">
      <p>{{ content }}</p>
    </div>

    <!-- Bot message -->
    <div v-else class="msg bot-msg">
      <p v-html="content" class="bot-text"></p>

      <div v-if="sources?.length" class="sources">
        <div v-for="(src, idx) in sources" :key="idx" class="source-item">
          <!-- 用 span + click，而不是 a + href -->
          <span class="source-link" @click="openDocument(src)">
            📄 {{ src.chunk.doc }} ({{ src.chunk.page_number }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from "../eventBus"; // ChatMessage.vue 在 src/components 下，返回到 src

const props = defineProps({
  role: String,
  content: String,
  sources: Array,
});

// 点击引用时：发出 open-document 事件，携带文件名
function openDocument(src) {
  // 后端返回的 doc 现在是类似 "docs/646-668.pdf"
  const raw = src.chunk.doc || "";
  const filename = raw.replace(/^docs\//, ""); // 去掉 docs/

  emitter.emit("open-document", filename);
}
</script>

<style scoped>
.chat-message {
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  margin: 16px 0;
}

/* --- User message (right-aligned bubble, ChatGPT style) --- */
.chat-message.user {
  align-items: flex-end;
}

.user-msg {
  background-color: #f7f7f8; /* soft gray tone */
  color: #111;
  padding: 8px 12px; /* tighter padding like ChatGPT */
  border-radius: 18px; /* smooth rounded bubble */
  max-width: 70%;
  align-self: flex-end;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: none;
}

/* --- Bot message (no background, full width) --- */
.chat-message.bot {
  align-items: flex-start;
  width: 100%;
}

.bot-msg {
  width: 100%;
  background-color: transparent;
  color: #111;
}

.bot-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* --- Source links --- */
.sources {
  margin-top: 6px;
  font-size: 0.9em;
}

.source-item {
  margin: 3px 0;
}

.source-item a {
  color: #0048ff;
  text-decoration: none;
}

.source-item a:hover {
  text-decoration: underline;
}

.source-link {
  color: #0048ff;
  cursor: pointer;
  text-decoration: none;
}

.source-link:hover {
  text-decoration: underline;
}

.user-msg p {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
