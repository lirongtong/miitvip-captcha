import { App } from 'vue'
import { default as Captcha } from './captcha'

const install = (app: App) => {
    app.use(Captcha)
    return app
}

export default {
    version: `${process.env.VERSION}`,
    install
}
