import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/sign-in',
          name: 'signIn',
          component: () => import('../views/SignIn.vue')
        }        
      ],
    },
    {
      path: '/main',
      name: 'main',
      meta: {
        loginRequired: true,
      },
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/workout-master',
      name: 'workoutMaster',
      meta: {
        loginRequired: true,
      },
      component: () => import('../views/workout/master/workoutMaster.vue')
    },
    {
      path: '/workout-program',
      name: 'workoutProgram',
      meta: {
        loginRequired: true,
      },
      component: () => import('../views/workout/program/workoutProgram.vue')
    },
    {
      path: '/workout-space',
      name: 'workoutSpace',
      meta: {
        loginRequired: true,
      },
      component: () => import('../views/workout/space/WorkoutSpace.vue')
    }
  ]
})

export default router
