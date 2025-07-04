import type { App } from 'vue'
import { setupI18n } from './i18n'
import { default as Captcha } from './captcha'

const install = (app: App) => {
    setupI18n(app)
    app.use(Captcha)
    return app
}

export default {
    version: '1.0.0',
    install,
    Captcha
}
