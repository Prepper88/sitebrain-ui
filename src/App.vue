<script setup>
</script>

<template>
  <div class="container">
    <!-- Top Navigation Tabs -->
    <div class="tabs">
      <span class="active">Q&A</span>
      <span>Discrepancy Checker</span>
      <span>Project Documents</span>
      <span>Project Overview</span>
      <div class="integrations">
        <span class="green-dot"></span> Procore
        <span class="green-dot"></span> Autodesk Docs
        <span class="green-dot"></span> Gmail
      </div>
    </div>

    <!-- Q&A Section -->
    <div class="qa-box">
      <input class="question" placeholder="Ask a question about the project..." />
      <div class="answer-box">
        <p class="question-text">
          What’s the fire rating requirement for the wall assembly in Section 3
        </p>
        <p class="answer-text">
          The fire rating requirement for the wall assembly in Section 3 is <strong>2 hours</strong>.
          <a href="#">Spec-12345, Section 3.1</a>
        </p>
      </div>
    </div>

    <!-- Files and Specification Section -->
    <div class="bottom-box">
      <div class="files">
        <p><strong>Files</strong></p>
        <button class="upload">+ Upload files</button>
        <ul>
          <li>📄 Blueprint_A.pdf</li>
          <li>📄 Spec-12345.pdf</li>
        </ul>
      </div>
      <div class="spec">
        <p><strong>Specification</strong></p>
        <p>3. Fire-Resistive Assemblies</p>
        <p>3.1 Wall Assemblies</p>
        <p>
          Wall assemblies must have a minimum fire-resistive rating of
          <span class="">2 hours.</span>
        </p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="buttons">
      <button>Generate RFI</button>
      <button>Export as PDF</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.tabs span.active {
  color: black;
  border-bottom: 2px solid black;
  padding-bottom: 3px;
}

.integrations {
  margin-left: auto;
  display: flex;
  gap: 15px;
  font-weight: normal;
  font-size: 14px;
  align-items: center;
}

.green-dot {
  width: 8px;
  height: 8px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.qa-box {
  margin-bottom: 20px;
}

.question {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
}

.answer-box {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
}

.question-text {
  font-weight: bold;
}

.answer-text a {
  margin-left: 10px;
  color: #0077cc;
}

.bottom-box {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.files,
.spec {
  flex: 1;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
}

.upload {
  margin: 10px 0;
}

.highlight {
  background: yellow;
  font-weight: bold;
}

.buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
