import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeC from '../views/HomeC.vue'
import OrdersC from '../views/OrdersC.vue';
import EconomyC from '../views/EconomyC.vue';
import PaymentsC from '../views/PaymentsC.vue';
import MapboxC from '../views/MapboxC.vue';
//import MLModelC from '../views/MLModelC.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomeC',
    component: HomeC
  },
  
  {
    path: '/about',
    name: 'AboutC',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutC.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersC
  },
  {
    path: '/economy',
    name: 'Economy',
    component: EconomyC
  },
  {
    path: '/payments',
    name: 'Payments',
    component: PaymentsC
  },
  {
    path: '/mapbox',
    name: 'Mapbox',
    component: MapboxC
  },
  // {
  //   path: '/3.5',
  //   name: 'ML Model',
  //   component: MLModelC
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
