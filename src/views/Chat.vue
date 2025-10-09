<script setup>
import { ref } from 'vue'

// 模拟问答数据
const messages = ref([
  { role: 'user', text: "What's the fire rating requirement for the wall assembly in Section 3?" },
  { role: 'assistant', text: "The fire rating requirement for the wall assembly in Section 3 is **2 hours**.", citation: "Spec-12345, Section 3.1" }
])

const userInput = ref('')

// 模拟发送问题
function sendMessage() {
  if (!userInput.value.trim()) return
  messages.value.push({ role: 'user', text: userInput.value })
  
  // 模拟AI回复
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      text: "This is a sample AI response related to your project question.",
      citation: "Mock Spec Document, Section 2.4"
    })
  }, 800)
  
  userInput.value = ''
}

// 模拟导出操作
function generateRFI() {
  alert("✅ RFI draft generated (mock). This will be replaced by backend output later.")
}

function exportPDF() {
  alert("📄 Exported as PDF (mock).")
}
</script>

<template>
  <div class="chat-wrapper">
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index"
           :class="['message', msg.role === 'user' ? 'user' : 'assistant']">
        <p v-html="msg.text"></p>
        <small v-if="msg.citation" class="citation">📎 {{ msg.citation }}</small>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-area">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ask about your project..." />
      <button @click="sendMessage">Send</button>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button class="rfi" @click="generateRFI">Generate RFI</button>
      <button class="pdf" @click="exportPDF">Export as PDF</button>
    </div>
  </div>
</template>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

/* 聊天区 */
.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 20px;
}

.message {
  max-width: 80%;
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  line-height: 1.5;
  word-break: break-word;
}

.message.user {
  background: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.message.assistant {
  background: #f1f3f4;
  margin-right: auto;
}

.citation {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #0077cc;
}

/* 输入区 */
.input-area {
  display: flex;
  gap: 10px;
}

.input-area input {
  flex: 1;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.input-area button {
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: #1565c0;
}

/* 底部操作按钮 */
.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.actions button {
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.actions .rfi {
  background: #388e3c;
  color: #fff;
}

.actions .rfi:hover {
  background: #2e7d32;
}

.actions .pdf {
  background: #fbc02d;
  color: #000;
}

.actions .pdf:hover {
  background: #f9a825;
}
</style>
