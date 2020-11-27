import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Login from '../pages/Login.vue'
import Lobby from '../pages/Lobby.vue'
import RoomAdmin from '../pages/RoomAdmin.vue'

Vue.use(VueRouter)


const routes: Array<RouteConfig> = [
  {
    path: '/lobby',
    name: 'Lobby',
    component: Lobby
  },
  {
    path: '/room/:roomId',
    name: 'RoomAdmin',
    component: RoomAdmin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
