import { createSSRApp } from 'vue'
import { App } from './app.mjs'

createSSRApp(App).mount('#app')
document.documentElement.dataset.hydrated = 'true'
