import { defineComponent } from 'vue'
import axios from 'axios'
import PropTypes from '../utils/props'
import tools from '../utils/tools'

export default defineComponent({
    name: 'MiCaptcha',
    props: {
        width: PropTypes.number.def(320),
        height: PropTypes.number.def(42),
        radius: PropTypes.number.def(4),
        themeColor: PropTypes.string,
        bgColor: PropTypes.string,
        borderColor: PropTypes.string.def('#f6ca9d'),
        textColor: PropTypes.string,
        boxShadow: PropTypes.bool.def(true),
        boxShadowColor: PropTypes.string.def('#f6ca9d'),
        boxShadowBlur: PropTypes.number.def(4),
        image: PropTypes.string,
        logo: PropTypes.string,
        maxTries: PropTypes.number.def(5),
        initAction: PropTypes.string,
        initParams: PropTypes.object.def({}),
        verifyAction: PropTypes.string,
        onSuccess: PropTypes.func,
        onInit: PropTypes.func
    },
    computed: {
        getThemeColorStyle() {
            return this.themeColor ? {
                backgroundColor: this.themeColor,
                boxShadow: `inset 0 0 0 1px ${this.themeColor}`
            } : null;
        }
    },
    data() {
        return {
            prefixCls: 'mi-captcha',
            target: 'https://admin.makeit.vip/components/captcha',
            avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png',
            powered: 'Powered By makeit.vip',
            init: false,
            failed: false,
            tip: this.initAction ? '正在初始化验证码 ...' : '点击按钮进行验证',
            status: {
                ready: true,
                scanning: false,
                being: false,
                success: false
            }
        }
    },
    mounted() {
        this.initCaptcha()
    },
    methods: {
        initCaptcha() {
            if (this.initAction) {
                this.tip = '正在初始化验证码 ...'
                axios.get(this.initAction, this.initParams).then((res: any) => {
                    this.failed = false
                    this.init = true
                    this.tip = '点击按钮进行验证'
                    this.$emit('init', res.data)
                }).catch(() => {
                    this.init = false
                    this.failed = true
                    this.tip = '初始化接口有误，请稍候再试'
                })
            } else {
                this.failed = false
                this.init = true
                this.tip = '点击按钮进行验证'
            }
        },
        showCaptcha() {
            if (!this.init || this.status.success) return
            this.tip = '智能检测中 ...'
            this.status.ready = false
            this.status.scanning = true
        },
        getRadarReadyElem() {
            return this.status.ready ? (
                <div class={`${this.prefixCls}-radar-ready`}>
                    <div
                        class={`${this.prefixCls}-radar-ring`}
                        style={this.getThemeColorStyle}>
                    </div>
                    <div
                        class={`${this.prefixCls}-radar-dot`}
                        style={this.getThemeColorStyle}
                        ref={`${this.prefixCls}-radar-dot`}>
                    </div>
                </div>
            ) : null
        },
        getRadarScanElem() {
            const borderColor = this.themeColor ? `${this.themeColor} transparent ${this.themeColor} transparent` : null
            const borderColor2 = this.themeColor ? `transparent ${this.themeColor} transparent ${this.themeColor}` : null
            return this.status.scanning ? (
                <div class={`${this.prefixCls}-radar-scan`}>
                    <div class="double-ring">
                        <div style={{borderColor}}></div>
                        <div style={{borderColor: borderColor2}}></div>
                    </div>
                </div>
            ) : null
        },
        getRadarTipElem() {
            const cls =  `${this.prefixCls}-radar-tip${this.failed ? ` ${this.prefixCls}-radar-tip-error` : ''}`
            return <div class={cls} innerHTML={this.tip}></div>
        },
        getRadarLogoElem() {
            return (
                <div class={`${this.prefixCls}-radar-logo`}>
                    <a href={this.target} target="_blank">
                        <img src={this.logo ?? this.avatar} alt={this.powered} />
                    </a>
                </div>
            )
        },
        getRadarElem() {
            const cls = `${this.prefixCls}-radar${this.status.success
                ? `${this.prefixCls}-radar-pass`
                : ''}`
            const style = {
                borderRadius: this.radius
                    ? `${tools.pxToRem(this.radius)}rem`
                    : null,
                borderColor: this.borderColor ?? null,
                backgroundColor: this.bgColor ?? null,
                boxShadow: this.boxShadow ? `0 0 ${tools.pxToRem(this.boxShadowBlur)}rem ${this.boxShadowColor}` : null,
                background: this.image
            }
            return (
                <div class={cls} style={style}>
                    { this.getRadarReadyElem() }
                    { this.getRadarScanElem() }
                    { this.getRadarTipElem() }
                    { this.getRadarLogoElem() }
                </div>
            )
        },
        resetStatus() {
            this.status.being = false
            this.status.success = false
            this.status.scanning = false
            this.status.ready = true
        }
    },
    render() {
        const cls = `${this.prefixCls}${tools.isMobile() ? ` ${this.prefixCls}-mobile` : ''}`
        const width = tools.isNumber(this.width) ? tools.pxToRem(this.width) : null
        const height = tools.isNumber(this.height) ? tools.pxToRem(this.height) : null
        const style = {width: `${width}rem`, height: `${height}rem`}
        return (
            <div class={cls} onClick={this.showCaptcha} ref={this.prefixCls}>
                <div class={`${this.prefixCls}-content`} style={style}>
                    { this.getRadarElem() }
                </div>
            </div>
        )
    }
})