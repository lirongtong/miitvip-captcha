import { App } from 'vue'
import { version } from '../package.json'
import { default as Captcha } from './captcha'

const install = (app: App) => {
    app.use(Captcha)
    return app
}

export { Captcha }

export default {
    version,
    install
}
