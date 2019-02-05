import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
