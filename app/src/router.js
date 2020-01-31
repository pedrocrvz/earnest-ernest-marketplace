import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue'),
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import(/* webpackChunkName: "demo" */ './views/Admin.vue'),
        },
        {
          path: '/my-stores',
          name: 'my-stores',
          component: () => import(/* webpackChunkName: "demo" */ './views/MyStores.vue'),
        },
        {
          path: '/my-stores/:id',
          name: 'my-store',
          component: () => import(/* webpackChunkName: "demo" */ './views/StoreOwner.vue'),
        },
        {
          path: '/store/:id',
          name: 'store',
          component: () => import(/* webpackChunkName: "demo" */ './views/Store.vue'),
        },
        {
          path: '/update-product/:id',
          name: 'update-product',
          component: () => import(/* webpackChunkName: "demo" */ './views/UpdateProduct.vue'),
        },
        {
          path: '/request-store',
          name: 'request',
          component: () => import(/* webpackChunkName: "demo" */ './views/RequestStore.vue'),
        },
      ],
    },
  ],
})
