<template>
  <div class="chat-page">
    <div class="chat-container">
      <!-- Messages area -->
      <div class="chat-messages" ref="chatContainer">
        <div v-for="(msg, index) in messages" :key="index">
          <ChatMessage
            :role="msg.role"
            :content="msg.content"
            :sources="msg.sources"
          />
        </div>
      </div>

      <!-- Input area -->
      <div class="chat-input">
        <input
          v-model="userInput"
          placeholder="Ask something..."
          @keyup.enter="sendMessage"
          :disabled="loading"
        />
        <button
          @click="sendMessage"
          :disabled="loading || !userInput.trim()"
          :class="{ disabled: loading || !userInput.trim() }"
        >
          {{ loading ? "Sending..." : "Send" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, reactive } from "vue";
import ChatMessage from "../components/ChatMessage.vue";
import { onMounted, onUnmounted, onActivated, onDeactivated } from "vue";

defineOptions({
  name: "ChatView",
});
onMounted(() => console.log("[ChatView] mounted"));
onUnmounted(() => console.log("[ChatView] unmounted"));
onActivated(() => console.log("[ChatView] activated (from cache)"));
onDeactivated(() => console.log("[ChatView] deactivated (kept alive)"));

const messages = ref([
  { role: "bot", content: "Hello! I'm your RAG assistant. Ask me anything." },
]);

const userInput = ref("");
const loading = ref(false);
const chatContainer = ref(null);

async function sendMessage() {
  if (loading.value || !userInput.value.trim()) return;

  const question = userInput.value.trim();
  messages.value.push({ role: "user", content: question });
  userInput.value = "";
  loading.value = true;

  const botMsg = reactive({ role: "bot", content: "Thinking...", sources: [] });
  messages.value.push(botMsg);

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.body) throw new Error("No response stream");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (readerDone) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;

      const endIndex = fullText.indexOf("__END__");
      if (endIndex === -1) {
        botMsg.content = fullText;
        await nextTick();
        scrollToBottomSmooth();
      } else {
        const answerText = fullText.slice(0, endIndex).trim();
        const metaStr = fullText.slice(endIndex + "__END__".length);
        botMsg.content = answerText;

        try {
          const meta = JSON.parse(metaStr);
          botMsg.sources.splice(
            0,
            botMsg.sources.length,
            ...(meta.related_chunks || [])
          );
        } catch (err) {
          console.warn("Failed to parse meta JSON:", err);
        }
        done = true;
      }
    }
  } catch (err) {
    console.error("Streaming error:", err);
    messages.value.push({
      role: "bot",
      content: "⚠️ Something went wrong while streaming response.",
    });
  } finally {
    loading.value = false;
    await nextTick();
    scrollToBottomSmooth();
  }
}

// Smooth auto-scroll
function scrollToBottomSmooth() {
  const el = chatContainer.value;
  if (!el) return;
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  if (atBottom) {
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }
}
</script>

<style scoped>
/* 整页背景：和顶部导航风格统一的淡灰白 */
.chat-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f7; /* 类似 macOS/iCloud 背景 */
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* 中间聊天容器：纯白、圆角 + 轻微阴影，有层次感 */
.chat-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 100%;
  position: relative;
  background-color: #ffffff; /* 一个颜色 */
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(209, 213, 219, 0.7);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.06),
    0 0 0 1px rgba(148, 163, 184, 0.18);
}

/* 消息区域：也是纯白，和容器融为一体 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background-color: #ffffff; /* 不再用渐变 */
  scroll-behavior: smooth;
  color: #111827;
}

/* 渐变滚动条：蓝 → 青色，保持一点科技感 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background-image: linear-gradient(180deg, #3b82f6, #06b6d4);
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.55);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(180deg, #2563eb, #0ea5e9);
}

/* 底部输入区：白色条，和顶部导航一致 */
.chat-input {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 16px 28px;
  background-color: #ffffff;
  border-top: 1px solid rgba(229, 231, 235, 1);
}

/* 输入框：浅灰背景 + 细描边 */
.chat-input input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 1);
  background-color: #f3f4f6;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.chat-input input::placeholder {
  color: rgba(148, 163, 184, 0.9);
}

.chat-input input:focus {
  background-color: #ffffff;
  border-color: #3b82f6;
  box-shadow:
    0 0 0 1px rgba(59, 130, 246, 0.25),
    0 0 0 6px rgba(59, 130, 246, 0.12);
}

/* Disabled input */
.chat-input input:disabled {
  background-color: #e5e7eb;
  border-color: #d1d5db;
  cursor: not-allowed;
  color: #9ca3af;
}

/* 发送按钮：和顶部蓝色主题统一 */
.chat-input button {
  margin-left: 14px;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background-image: linear-gradient(135deg, #3b82f6, #06b6d4);
  background-size: 200% 200%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow:
    0 10px 24px rgba(37, 99, 235, 0.22),
    0 0 0 1px rgba(129, 140, 248, 0.25);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background-position 0.25s ease,
    opacity 0.15s ease;
}

.chat-input button:hover:not(.disabled):not(:disabled) {
  background-position: 100% 0;
  transform: translateY(-1px);
  box-shadow:
    0 14px 32px rgba(37, 99, 235, 0.3),
    0 0 0 1px rgba(37, 99, 235, 0.45);
}

.chat-input button:active:not(.disabled):not(:disabled) {
  transform: translateY(0);
  box-shadow:
    0 10px 24px rgba(37, 99, 235, 0.22),
    0 0 0 1px rgba(37, 99, 235, 0.4);
}

/* Disabled button */
.chat-input button.disabled,
.chat-input button:disabled {
  background-image: linear-gradient(135deg, #cbd5e1, #e5e7eb);
  box-shadow: none;
  color: #6b7280;
  opacity: 0.9;
  cursor: not-allowed;
}
</style>

