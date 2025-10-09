import { createRouter, createWebHistory } from 'vue-router'
import Chat from '../views/Chat.vue'

const routes = [
  { path: '/chat', component: Chat },
  { path: '/', redirect: '/chat' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
