import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

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
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/AboutView.vue')
        },
        {
          path: '/sign-in',
          name: 'signIn',
          component: () => import('@/views/SignIn.vue')
        }        
      ],
    },
    {
      path: '/main',
      name: 'main',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/MainView.vue')
    },
    {
      path: '/workout-master',
      name: 'workoutMaster',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/workout/master/WorkoutMaster.vue')
    },
    {
      path: '/workout-program',
      name: 'workoutProgram',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/workout/program/WorkoutProgram.vue')
    },
    {
      path: '/workout-program/:programId/parts',
      name: 'workoutProgramPart',
      meta: {
        loginRequired: true,
      },
      props: true,
      component: () => import('@/views/workout/program/workoutProgramPart.vue')
    },
    {
      path: '/workout-program/:programId/parts/:partId/items/:itemId/sets',
      name: 'workoutProgramPartItemSet',
      meta: {
        loginRequired: true,
      },
      props: true,
      component: () => import('@/views/workout/program/workoutProgramPartItemSet.vue')
    },
    {
      path: '/program-selection',
      name: 'programSelection',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/workout/space/programSelection.vue')
    },
    {
      path: '/workout-space',
      name: 'workoutSpace',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/workout/space/workoutSpace.vue')
    },
    {
      path: '/workout-list',
      name: 'workoutList',
      meta: {
        loginRequired: true,
      },
      component: () => import('@/views/workout/space/workoutList.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  // if (to.name == 'programSelection') {

  //   const workoutStr = localStorage.getItem('workout');
  //   if (workoutStr) {
  //     const workout = JSON.parse(workoutStr);
  //     if (workout.id) {
  //       return '/workout-space';
  //     }
  //   }
  // }
})

export default router
