import { onMounted, onUnmounted } from 'vue'
import { $tools } from './tools'

export default function (moduleStyled: any, destroy = false) {
    onMounted(() => {
        $tools.applyThemeModuleProperties(
            moduleStyled,
            $tools.assignThemeModuleProperties(moduleStyled, {})
        )
    })

    onUnmounted(() => {
        if (destroy) $tools.destroyThemeModuleProperties(moduleStyled)
    })
}
