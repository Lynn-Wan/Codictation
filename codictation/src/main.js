import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store'
import axios from './axios'

Vue.prototype.$axios = axios
Vue.config.productionTip = false

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './quasar'
Vue.use(ElementUI);

new Vue({ 
  router,
  store,
  render: h => h(App)
}).$mount('#app')
