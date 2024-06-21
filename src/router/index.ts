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
      component: () => import('../views/PLNE.vue'),
      children: [
        {
          path: '',
          name: 'plne_index',
          component: () => import('../views/PLNE/Index.vue')
        },
        {
          path: 'data',
          name: 'plne_data',
          component: () => import('../views/PLNE/Data.vue')
        },
        {
          path: 'result',
          name: 'plne_result',
          component: () => import('../views/PLNE/Result.vue')
        },
      ]
    }
  ]
})

export default router
