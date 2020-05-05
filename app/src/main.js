import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false

// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.
Vue.use(VueRouter);
// 1. Define route components.
// These can be imported from other files

const Game = () => import(/* webpackChunkName: "game" */ './components/Game.vue')
const Home = () => import(/* webpackChunkName: "home" */ './components/Home.vue')
const GameOver = () => import(/* webpackChunkName: "gameover" */ './components/GameOver.vue')
const YouWin = () => import(/* webpackChunkName: "youwin" */ './components/YouWin.vue')


// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/game', component: Game, name: 'game' },
  { path: '/gameover', component: GameOver, name: 'gameover' },
  { path: '/youwin', component: YouWin, name: 'youwin' },
  
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
new Vue({
  router,
  render: h => h(App),
  components: { App }
}).$mount('#app')
