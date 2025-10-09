<template>
  <div id="app">
    <!-- 全局顶部导航 -->
    <header class="top-bar">
      <h1 class="logo">🏗️ Construction AI Assistant</h1>
      <nav class="nav-links">
        <router-link to="/chat" active-class="active">Q&A</router-link>
        <router-link to="/discrepancy" active-class="active">Discrepancy Checker</router-link>
        <router-link to="/documents" active-class="active">Project Documents</router-link>
        <router-link to="/dashboard" active-class="active">Project Overview</router-link>
      </nav>
      <div class="integrations">
        <span class="green-dot"></span> Procore
        <span class="green-dot"></span> Autodesk Docs
        <span class="green-dot"></span> Gmail
      </div>
    </header>

    <!-- 页面内容 -->
    <main class="main-view">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: sans-serif;
  background-color: #fff;
  color: #333;
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  border-bottom: 1px solid #ddd;
  background-color: #fafafa;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 导航链接 */
.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
}

.nav-links a.active {
  color: black;
  border-bottom: 2px solid black;
  padding-bottom: 3px;
}

/* 集成状态 */
.integrations {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

.green-dot {
  width: 8px;
  height: 8px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

/* 主内容区域 */
.main-view {
  padding: 20px 30px;
}
</style>
