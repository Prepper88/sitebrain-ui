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
import { ref, nextTick } from "vue";
import ChatMessage from "../components/ChatMessage.vue";
import { reactive } from "vue";

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

  // Add a placeholder bot message
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

      // ✅ Real-time rendering
      const endIndex = fullText.indexOf("__END__");
      if (endIndex === -1) {
        botMsg.content = fullText; // progressively update
        await scrollToBottom();
      } else {
        // ✅ split answer and meta
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
    await scrollToBottom();
  }
}

// Auto scroll to bottom
async function scrollToBottom() {
  await nextTick();
  const el = chatContainer.value;
  if (el) el.scrollTop = el.scrollHeight;
}
</script>

<style scoped>
.chat-page {
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: #ffffff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Helvetica, Arial, sans-serif;
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 800px;
  background-color: #ffffff;
  border-radius: 8px;
  height: 100%;
}

/* Messages area */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  background-color: #ffffff;
}

/* Input area */
.chat-input {
  display: flex;
  align-items: center;
  padding: 16px 32px;
  background-color: #ffffff;
  border-top: none;
}

.chat-input input {
  flex: 1;
  padding: 12px 14px;
  border-radius: 6px;
  border: none;
  background-color: #f7f7f8;
  font-size: 15px;
  color: #111;
}

.chat-input input:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

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

.chat-input button:hover {
  background-color: #0e906f;
}

.chat-input button.disabled,
.chat-input button:disabled {
  background-color: #c8e8df;
  cursor: not-allowed;
}
</style>
