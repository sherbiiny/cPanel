import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
import Home from '@/views/Home'
import ShopInput from '@/views/ShopInput'
import ClientInput from '@/views/ClientInput'
import ViewerInput from '@/views/ViewerInput'
import ShopsList from '@/views/ShopsList'
import ClientsList from '@/views/ClientsList'
import Shop from '@/views/Shop'
import Client from '@/views/Client'
import Numbers from '@/views/Numbers'
import Login from '@/views/Login'
import Viewer from '@/views/Viewer'

Vue.use(VueRouter)

const routes = [
 {
   path: '/shop-input',
   component: ShopInput,
   name: 'ShopInput',
   meta: { requiresAuth: true }
 },
 {
   path: '/',
   component: Home,
   name: 'Home',
   meta: { requiresAuth: true }
 },
 {
   path: '/client-input/:shop_id?',
   component: ClientInput,
   name: 'ClientInput',
   meta: { requiresAuth: true }
 },
 {
   path: '/viewer-input',
   component: ViewerInput,
   name: 'ViewerInput',
   meta: { requiresAuth: true }
 },
 {
   path: '/shops-list',
   component: ShopsList,
   name: 'ShopsList',
   meta: { requiresAuth: true }
 },
 {
   path: '/shop/:shop_id',
   component: Shop,
   name: 'Shop',
   meta: { requiresAuth: true }
 },
 {
   path: '/clients-list',
   component: ClientsList,
   name: 'ClientsList',
   meta: { requiresAuth: true }
 },
 {
   path: '/numbers',
   component: Numbers,
   name: 'Numbers',
   meta: { requiresAuth: true }
 },
 {
   path: '/login',
   component: Login,
   name: 'Login',
 },
 {
   path: '/client/:client_id',
   component: Client,
   name: 'Client',
   meta: { requiresAuth: true }
 },
 {
   path: '/viewer/:client_id',
   component: Viewer,
   name: 'Viewer',
   props: true,
   meta: { requiresAuth: true }
 },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let user = firebase.auth().currentUser
    if (!user) next({name: 'Login'})
       else next()
  } else next()
})

export default router
