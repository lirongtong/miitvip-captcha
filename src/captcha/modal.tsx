import { defineComponent } from 'vue'
import { Tooltip } from 'makeit-tooltip'
import PropTypes from '../utils/props'
import tools from '../utils/tools'

export default defineComponent({
    name: 'MiCaptchaModal',
    props: {
        show: PropTypes.bool.def(false),
        image: PropTypes.string,
        position: PropTypes.object,
        mask: PropTypes.bool.def(true),
        maskClosable: PropTypes.bool.def(true),
        themeColor: PropTypes.string,
        bgColor: PropTypes.string,
        boxShadow: PropTypes.bool.def(true),
        boxShadowColor: PropTypes.string,
        boxShadowBlur: PropTypes.number,
        maxTries: PropTypes.number.def(5),
        onModalClose: PropTypes.func
    },
    data() {
        return {
            prefixCls: 'mi-captcha-modal',
            loading: true,
            target: 'https://admin.makeit.vip/components/captcha',
            avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png',
            powered: 'Powered By makeit.vip',
            size: {
                width: 260,
                height: 160
            },
            drag: {
                moving: false,
                originX: 0,
                originY: 0,
                offset: 0
            },
            check: {}
        }
    },
    methods: {
        closeModal() {
            if (this.maskClosable) this.$emit('modalClose', 'close')
        },
        getArrowElem() {
            const arrowCls = `${this.prefixCls}-arrow`
            const inStyle = {
                borderColor: this.bgColor
                    ? `transparent ${this.bgColor} transparent transparent`
                    : null
            }
            const outStyle = {
                borderColor: this.themeColor
                    ? `transparent ${this.themeColor} transparent transparent`
                    : null
            }
            return (
                <div class={arrowCls}>
                    <div class={`${arrowCls}-out`} style={outStyle}></div>
                    <div class={`${arrowCls}-in`} style={inStyle}></div>
                </div>
            )
        },
        getMaskElem() {
            return this.mask && this.show ? (
                <div class={`${this.prefixCls}-mask`}
                    onClick={this.closeModal}
                    ref={`${this.prefixCls}-mask`}>
                </div>
            ) : null
        },
        getContentLoadingElem() {
            const loadingCls = `${this.prefixCls}-loading`
            const style1 = {borderColor: this.themeColor ?? null}
            const style2 = {background: this.themeColor ?? null}
            return this.loading ? (
                <div class={loadingCls}>
                    <div class={`${loadingCls}-spinner`}>
                        <div class="load">
                            <div>
                                <div>
                                    <div style={style1}></div>
                                    <div style={style2}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class={`${loadingCls}-tip`}>正在加载验证码</div>
                </div>
            ) : null
        },
        getContentInfoElem() {
            return (
                <div class={`${this.prefixCls}-info`}>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${this.prefixCls}-image`}>
                    </canvas>
                    <canvas
                        width={this.size.width}
                        height={this.size.height}
                        ref={`${this.prefixCls}-block`}>
                    </canvas>
                </div>
            )
        },
        getContentResultElem() {
            const resultCls = `${this.prefixCls}-result`
            const cls = `${resultCls} ${this.check.correct ? `${resultCls}-success` : `${resultCls}-error`}`
            return <div class={cls} ref={resultCls} innerHTML={this.check.tip}></div>
        },
        getSliderTrackElem() {
            const sliderTrackCls = `${this.prefixCls}-slider-track`
            const style = {borderColor: this.themeColor ?? null}
            return (
                <div class={sliderTrackCls} style={style}>
                    <span class={`${sliderTrackCls}-tip`}>拖动左边滑块完成上方拼图</span>
                </div>
            )
        },
        getSliderBtnElem() {
            const sliderBtnCls = `${this.prefixCls}-slider-btn`
            const style = {borderColor: this.themeColor ?? null}
            return (
                <div class={sliderBtnCls} style={style} ref={sliderBtnCls}>
                    <div class={`${sliderBtnCls}-icon`}>
                        <div class={`${sliderBtnCls}-vertical`}></div>
                        <div class={`${sliderBtnCls}-horizontal`}></div>
                    </div>
                </div>
            )
        },
        getPanelActionElem() {
            const panelActionCls = `${this.prefixCls}-panel-action`
            return (
                <div class={panelActionCls}>
                    <Tooltip title="关闭验证" autoAdjust={false} bgColor={this.themeColor}>
                        <i class="mi-icon icon-close" onClick={this.closeModal}></i>
                    </Tooltip>
                    <Tooltip title="刷新验证" autoAdjust={false} bgColor={this.themeColor}>
                        <i class="mi-icon icon-refresh"></i>
                    </Tooltip>
                    <Tooltip title="帮助反馈" autoAdjust={false} bgColor={this.themeColor}>
                        <a href={this.target} target="_blank">
                            <i class="mi-icon icon-question"></i>
                        </a>
                    </Tooltip>
                </div>
            )
        },
        getPanelCopyrightElem() {
            const copyrightCls = `${this.prefixCls}-copyright`
            return (
                <div class={copyrightCls}>
                    <div class={`${copyrightCls}-text`}>
                        <a href={this.target} target="_blank">
                            <img src={this.avatar} alt={this.powered} />
                        </a>
                        <span>提供技术支持</span>
                    </div>
                </div>
            )
        },
        getContentElem() {
            const contentCls = `${this.prefixCls}-content`
            const sliderCls = `${this.prefixCls}-slider`
            const style = {
                borderColor: this.themeColor ?? null,
                background: this.bgColor ?? null,
                boxShadow: this.boxShadow ? `0 0 ${tools.pxToRem(this.boxShadowBlur)}rem ${this.boxShadowColor}` : null,
            }
            return (
                <div class={contentCls} style={style} ref={contentCls}>
                    <div class={`${this.prefixCls}-wrap`}>
                        <div class={`${this.prefixCls}-embed`}>
                            { this.getContentLoadingElem() }
                            { this.getContentInfoElem() }
                            { this.getContentResultElem() }
                        </div>
                        <div class={`${sliderCls}${this.drag.moving ? ` ${sliderCls}-moving` : ''}`} ref={sliderCls}>
                            { this.getSliderTrackElem() }
                            { this.getSliderBtnElem() }
                        </div>
                    </div>
                    <div class={`${this.prefixCls}-panel`}>
                        { this.getPanelActionElem() }
                        { this.getPanelCopyrightElem() }
                    </div>
                </div>
            )
        }
    },
    render() {
        const style = {
            top: `${tools.pxToRem(this.position.top)}rem`,
            left: `${tools.pxToRem(this.position.left)}rem`
        }
        const cls = `${this.prefixCls}${
            !this.check.correct && this.check.show
                ? ` ${this.prefixCls}-error`
                : ''
        }`
        return this.show ? <>
            { this.getMaskElem() }
            <div class={cls} style={style} ref={this.prefixCls}>
                { this.getArrowElem() }
                { this.getContentElem() }
            </div>
        </> : null
    }
})