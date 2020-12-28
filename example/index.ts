import { createApp } from 'vue'
import MakeitCaptcha from 'makeit-captcha'
import App from './app.vue'
import 'makeit-captcha/style'
import './index.less'

const app = createApp(App)
app.use(MakeitCaptcha)
app.mount('#app')