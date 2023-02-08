import { App } from 'vue'
import { default as Captcha } from './captcha'

const install = (app: App) => {
    app.use(Captcha)
    return app
}

export { Captcha }

export default {
    version: '2.0.4',
    install
}
