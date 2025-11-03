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
/* Root layout */
.chat-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* fixed viewport height */
  background-color: #ffffff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden; /* prevent outer scroll */
}

/* Chat container */
.chat-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 100%; /* occupy full height */
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

/* Scrollable messages area */
.chat-messages {
  flex: 1;
  overflow-y: auto; /* internal scroll only */
  padding: 24px 32px;
  background-color: #ffffff;
  scroll-behavior: smooth;
}

/* Input area - fixed at bottom */
.chat-input {
  flex-shrink: 0; /* prevent from being pushed */
  display: flex;
  align-items: center;
  padding: 16px 32px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
}

/* Input field */
.chat-input input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: none;
  background-color: #f7f7f8;
  font-size: 15px;
  color: #111;
  outline: none;
}

/* Disabled input */
.chat-input input:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

/* Send button */
.chat-input button {
  margin-left: 12px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #10a37f;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Button hover */
.chat-input button:hover {
  background-color: #0e906f;
}

/* Disabled button */
.chat-input button.disabled,
.chat-input button:disabled {
  background-color: #c8e8df;
  cursor: not-allowed;
}
</style>
