import Vue from 'vue'
import App from './App.vue'

Vue.component('font-awesome-icon', FontAwesomeIcon)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCat, faStopwatch, faUndo, faCog, faPaw } from '@fortawesome/free-solid-svg-icons'

library.add( faCat, faStopwatch, faUndo, faCog, faPaw )

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
