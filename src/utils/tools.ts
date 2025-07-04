import type { App } from 'vue'
import type { DeviceSize, Position, KeyValue } from './types'
import { $g } from './global'

class MiTools {
    /**
     * Whether the `element / params` is valid.
     * @param value
     */
    isValid(value: unknown): boolean {
        return value !== undefined && value !== null && value !== ''
    }

    /**
     * 是否为数字
     * @param number
     * @returns
     */
    isNumber(number: any): boolean {
        return typeof number === 'number' && isFinite(number)
    }

    /**
     * 单位转换 px -> rem
     * @param value
     * @param base
     */
    px2rem(value: number | string, base?: number): number {
        const val = parseInt((value || '').toString().replace('px', ''))
        return this.isNumber(val) ? Math.round((val / (base || 16)) * 1000) / 1000 : 0
    }

    /**
     * 转 rem
     * @param num
     * @returns
     */
    convert2rem(num: any): any {
        return this.isNumber(num)
            ? `${this.px2rem(num)}rem`
            : num
              ? /%|px|rem|em|rpx|auto/g.test(num)
                  ? num
                  : `${this.px2rem(parseInt(num))}rem`
              : null
    }

    /**
     * 根据窗口尺寸获取配置的大小值
     * @param value 大小值
     *
     * @see DeviceSize
     * @see Breakpoints
     */
    distinguishSize(value?: string | number | DeviceSize, dynamicWidth?: number) {
        if (value === undefined) return null
        if (typeof value !== 'object') return value
        const width = dynamicWidth ?? ($g?.winSize?.width || 0)
        if (!width) return null
        const { md = 768, lg = 992 } = $g?.breakpoints ?? {}
        return width < md
            ? (value.mobile ?? Object.values(value)[0])
            : width < lg
              ? (value.tablet ?? Object.values(value)[0])
              : (value.laptop ?? value.tablet ?? Object.values(value)[0])
    }

    /**
     * 随机生成字符串.
     * @returns {string}
     */
    random(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    /**
     * 生成唯一的 UID.
     * @param upper
     * @returns {string}
     */
    uid(upper = false, prefix?: string): string {
        let str = (
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random()
        ).toLocaleUpperCase()
        str = (prefix ?? $g.prefix) + str
        return upper ? str.toUpperCase() : str.toLowerCase()
    }

    /**
     * 添加事件监听.
     * 注: scroll 事件的监听等请务必使用此方法设定.
     * 避免多人重复定义被覆盖.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.addEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * 移除事件监听.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.removeEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * 颜色转换 hex -> rgba
     * @param color
     * @param opacity
     * @returns
     */
    colorHex2Rgba(color: string, opacity = 1): string {
        if (color) {
            if ($g.regExp.hex.test(color)) {
                if (color.length === 4) {
                    if (color.length === 4) {
                        let newColor = '#'
                        for (let i = 1; i < 4; i++) {
                            newColor += color.slice(i, i + 1).concat(color.slice(i, i + 1))
                        }
                        color = newColor
                    }
                    const changeColor: number[] = []
                    for (let i = 1; i < 7; i += 2) {
                        changeColor.push(parseInt('0x' + color.slice(i, i + 2)))
                    }
                    return `rgba(${changeColor.join(',')}, ${opacity})`
                }
            }
        }
        return color
    }

    /**
     * 颜色转换 rgb -> hex
     * @param color
     * @returns
     */
    colorRgb2Hex(color: string): string {
        if (color) {
            if ($g.regExp.rgb.test(color)) {
                const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
                let strHex = '#'
                for (let i = 0; i < aColor.length; i++) {
                    let hex = Number(aColor[i]).toString(16)
                    if (hex === '0') hex += hex
                    strHex += hex
                }
                if (strHex.length !== 7) strHex = color
                return strHex
            } else if ($g.regExp.hex.test(color)) {
                const aNum = color.replace(/#/, '').split('')
                if (aNum.length === 6) {
                    return color
                } else if (aNum.length === 3) {
                    let numHex = '#'
                    for (let i = 0; i < aNum.length; i += 1) {
                        numHex += aNum[i] + aNum[i]
                    }
                    return numHex
                }
            }
        }
        return color
    }

    /**
     * 判断是否为 URL
     * @param url
     * @returns
     */
    isUrl(url: string): boolean {
        try {
            const info = new URL(url)
            if (
                ($g.protocols || ['https', 'http', 'ftp', 'mms', 'rtsp']).includes(
                    info.protocol.replace(':', '')
                )
            )
                return true
            return false
        } catch {
            return false
        }
    }

    /**
     * 生成范围内的随机数.
     * @param start
     * @param end
     * @returns {number}
     */
    randomNumberInRange(start: number, end: number): number {
        return Math.round(Math.random() * (end - start) + start)
    }

    /**
     * 封装定位或间距
     * @param [string, number] value 数值
     * @param prefix 前缀 (如: margin)
     */
    wrapPositionOrSpacing(data: Position, prefix?: string) {
        const position: Record<string, string> = {}
        if (Object.keys(data).length > 0) {
            const defaultPosition = ['top', 'bottom', 'left', 'right'] as const

            const ucfirst = (letter: string): string => {
                return letter.slice(0, 1).toUpperCase() + letter.slice(1).toLowerCase()
            }

            const getKeys = (): KeyValue[] => {
                return defaultPosition.map((pos) => ({
                    key: pos,
                    value: prefix ? `${prefix}${ucfirst(pos)}` : pos
                }))
            }
            const items = getKeys()
            items.forEach((item: KeyValue) => {
                const v = data[item.key as keyof Position]
                position[item.value] =
                    typeof v !== 'undefined'
                        ? v !== 'unset'
                            ? $tools.convert2rem($tools.distinguishSize(v))
                            : v
                        : null
            })
        }
        return position
    }
}

export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
