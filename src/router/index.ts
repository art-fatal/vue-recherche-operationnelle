import { createRouter, createWebHistory } from 'vue-router'
import FlowMax from '../views/FlowMax.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'flot_maximal'
    },
    {
      path: '/flot_maximal',
      name: 'flot_maximal',
      component: FlowMax
    },
    {
      path: '/djikstra',
      name: 'djikstra',
      component: () => import('../views/Djikstra.vue')
    },
    {
      path: '/coloration',
      name: 'coloration',
      component: () => import('../views/Coloration.vue')
    },
    {
      path: '/plne',
      name: 'plne',
      component: () => import('../views/PLNE.vue')
    }
  ]
})

export default router
