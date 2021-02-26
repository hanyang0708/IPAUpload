import Vue from 'vue'
import '@/style/reset.less'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '@/style/element-variables.scss';

import Storage from 'vue-ls';

let options = {
  namespace: 'ipa_', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
};

Vue.use(Storage, options);


Vue.use(ElementUI);

Vue.config.productionTip = false


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
