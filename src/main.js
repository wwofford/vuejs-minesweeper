import Vue from 'vue'
import App from './App.vue'

Vue.component('font-awesome-icon', FontAwesomeIcon)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFlag } from '@fortawesome/free-solid-svg-icons'

library.add( faFlag )

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
