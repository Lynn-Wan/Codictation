import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter)

const routes = [
  {
    path: '/diff/:diffId',
    name: 'diff',
    component: () => import('../components/diff.vue')
  },
  {
    path: '/diff/:diffId/comment',
    name: 'comment',
    component: () => import('../components/comment.vue')
  }, 
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/basic/Home.vue')
  },
  {
    path: '/dictation',
    name: 'Dictation',
    component: () => import('../components/Dictation.vue')
  },
  {
    path: '/discussion',
    name: 'Discussion',
    component: () => import('../components/Discussion.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/basic/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/basic/Register.vue')
  },
  // {
  //   path: '/addUsers',
  //   name: 'addUsers',
  //   component: () => import('../components/profile/addUsers.vue')
  // },
  // {
  //   path: '/task',
  //   name: 'task',
  //   component: () => import('../components/profile/task.vue')
  // },
  // {
  //   path: '/profile/mytasks',
  //   name: 'mytasks',
  //   component: () => import('../components/profile/mytasks.vue')
  // },
  // {
  //   path: '/profile/mycomments',
  //   name: 'mycomments',
  //   component: () => import('../components/profile/mycomments.vue')
  // },
  // {
  //   path: '/profile/published',
  //   name: 'published',
  //   component: () => import('../components/profile/published.vue')
  // },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../components/profile/components/profileSideBar.vue'),
  },
  //co-dictation后台管理系统
  {
    path: '/admin',
    name: 'adminLogin',
    component: () => import('../components/back/adminLogin')
  },
  {
    path: '/index',
    component: () => import('../components/back/layout'),
    beforeEnter: (to, from, next) => {
      const isToken = localStorage.elementToken ? true : false
      if (to.path == '/admin') {
        next()
      } else {
        isToken ? next() : next('/admin')
      }
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../components/back/home')
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import('../components/back/editor')
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('../components/back/test')
      },
    ]
  },


]

const router = new VueRouter({
  routes
})

//解决页面跳转后滚动条消失的问题
router.afterEach((to, from, next) => {
  document.querySelector("body").setAttribute("style", "overflow: auto !important;")
});

//路由守卫
// router.beforeEach((to, from, next) => {
//   const isToken = sessionStorage.elementToken ? true : false
//   if (to.path == '/login' || to.path == '/register'){
//     next()
//   } else {
//     isToken ? next() : next('/login')
//   }
// })



export default router