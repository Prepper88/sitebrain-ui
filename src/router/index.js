import { createRouter, createWebHistory } from "vue-router";
import ChatView from "../views/ChatView.vue";
import DocumentsView from "../views/DocumentsView.vue";

const routes = [
  { path: "/", redirect: "/chat" },
  { path: "/chat", component: ChatView },
  { path: "/documents", component: DocumentsView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
