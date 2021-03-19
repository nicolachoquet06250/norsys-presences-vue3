import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/Calendar.vue')
  },
  {
    path: '/recap/list',
    name: 'recapHistorique',
    component: () => import('../views/RecapHistorique')
  },
  {
    path: '/recap/:id',
    name: 'recap',
    component: () => import('../views/Recap'),
    props: true
  },
  {
    path: '/recap/edit',
    name: 'recapEdition',
    component: () => import('../views/NewRecap')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
