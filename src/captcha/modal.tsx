import { ref, defineComponent, onMounted, onUnmounted, nextTick, Fragment, Transition } from 'vue'
import { CaptchaModalProps, type CaptchaModalBlockPosition } from './props'
import { getPrefixCls } from '../utils/props'
import { $g } from '../utils/global'
import { $tools } from '../utils/tools'
import { $request } from '../utils/request'
import useWindowResize from '../hooks/useWindowResize'
import type { CanvasOperation, ResponseData } from '../utils/types'
import { useI18n } from 'vue-i18n'
import { Tooltip } from 'ant-design-vue'
import { CloseCircleOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import styled from './style/modal.module.less'

const MiCaptchaModal = defineComponent({
    name: 'MiCaptchaModal',
    inheritAttrs: false,
    props: CaptchaModalProps(),
    emits: ['close', 'update:open'],
    setup(props, { emit }) {
        const { width } = useWindowResize()
        const { t, te, locale } = useI18n()

        const modalRef = ref(null)
        const maskRef = ref(null)
        const contentRef = ref(null)
        const sliderRef = ref(null)
        const sliderBtnRef = ref(null)
        const imageRef = ref(null)
        const blockRef = ref(null)
        const resultRef = ref(null)
        const open = ref<boolean>(props.open)

        const anim = ref(getPrefixCls('anim-scale'))
        const loading = ref(true)
        const _background = ref('')
        const background = ref($g.background)
        const site = ref($g.site)
        const powered = ref($g.powered)

        const check = ref({
            tries: props.maxTries || 5,
            num: 0,
            correct: false,
            tip: undefined as string | undefined,
            show: false,
            being: false,
            value: null as number | null
        })

        const drag = ref({
            moving: false,
            originX: 0,
            originY: 0,
            offset: 0
        })

        const size = ref({ width: 260, height: 160 })

        const elements = ref({
            slider: null as HTMLElement | null,
            block: null as HTMLElement | null
        })

        const block = ref({
            size: 42,
            radius: 8,
            PI: Math.PI,
            real: 0
        })

        const ctx = ref({
            image: null as CanvasRenderingContext2D | null,
            block: null as CanvasRenderingContext2D | null
        })

        const coordinate = ref({
            x: 0,
            y: 0,
            offset: 6
        })

        const time = ref({
            start: null as number | null,
            end: null as number | null
        })

        const tt = (key: string, fallback: string) => (te(key) ? t(key) : fallback)

        const handlePointerUp = () => dragEnd()
        const handleTouchEnd = () => dragEnd()

        const init = () => {
            _background.value = props.image ?? background.value
            initModal()
        }

        const initModal = () => {
            elements.value = {
                slider: sliderBtnRef.value as unknown as HTMLElement,
                block: blockRef.value as unknown as HTMLElement
            }
            block.value.real = block.value.size + block.value.radius * 2 + 2
            setCheckData()
            initCaptcha()
            $tools.on(elements.value.slider!, 'pointerdown', dragStart)
            $tools.on(elements.value.slider!, 'touchstart', dragStart)
            $tools.on(modalRef.value!, 'pointermove', dragMoving)
            $tools.on(modalRef.value!, 'touchmove', dragMoving)
            $tools.on(window, 'pointerup', handlePointerUp)
            $tools.on(window, 'touchend', handleTouchEnd)
        }

        const setCheckData = () => {
            check.value = {
                tries: props.maxTries || 5,
                num: 0,
                being: false,
                value: null,
                correct: false,
                tip: tt('captcha.dragging', 'Drag'),
                show: false
            }
        }

        const initCaptcha = () => {
            const image = imageRef.value as unknown as HTMLCanvasElement
            const block = blockRef.value as unknown as HTMLCanvasElement
            const imageCtx = image ? image.getContext('2d', { willReadFrequently: true }) : null
            const blockCtx = block ? block.getContext('2d', { willReadFrequently: true }) : null
            ctx.value = { image: imageCtx, block: blockCtx }
            /**
             * 图片统一转为 base64, 避免跨域问题.
             * 也可采用xhr异步请求图片地址.
             * ```
             * if ($tools.isUrl(this.background)) {
             *     const xhr = new XMLHttpRequest()
             *     xhr.onload = function() {
             *         if (this.status === 200) {
             *             // 注意 this 指向.
             *             const url = URL.createObjectURL(this.response)
             *             params.background = url
             *             initImageElem()
             *             // ...
             *             URL.revokeObjectURL(url)
             *         }
             *     }
             *     xhr.open('GET', this.background, true)
             *     xhr.responseType = 'blob'
             *     xhr.send()
             * } else initImageElem()
             * ```
             */
            if ($tools.isUrl(_background.value)) image2Base64(initImageElem)
            else initImageElem()
        }

        const image2Base64 = (callback: (...args: unknown[]) => unknown) => {
            const elem = new Image() as HTMLImageElement
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d', {
                willReadFrequently: true
            }) as CanvasRenderingContext2D
            canvas.width = size.value.width
            canvas.height = size.value.height
            elem.crossOrigin = ''
            elem.src = _background.value
            elem.onload = () => {
                ctx.drawImage(elem, 0, 0, size.value.width, size.value.height)
                _background.value = canvas.toDataURL()
                callback?.()
            }
        }

        const initImage = (elem: CanvasImageSource) => {
            if (ctx.value.image && ctx.value.block) {
                /** image */
                ctx.value.image.drawImage(elem, 0, 0, size.value.width, size.value.height)
                /** text */
                ctx.value.image.beginPath()
                ctx.value.image.fillStyle = '#FFF'
                ctx.value.image.shadowColor = 'transparent'
                ctx.value.image.shadowBlur = 0
                ctx.value.image.font = 'bold 24px MicrosoftYaHei'
                ctx.value.image.fillText(t('captcha.flatten'), 12, 30)
                ctx.value.image.font = '16px MicrosoftYaHei'
                ctx.value.image.fillText(t('captcha.verify'), 12, 55)
                ctx.value.image.closePath()
                /** block */
                ctx.value.block.save()
                ctx.value.block.globalCompositeOperation = 'destination-over'
                drawBlockPosition()
                ctx.value.block.drawImage(elem, 0, 0, size.value.width, size.value.height)
                /** image data */
                const coordinateY = coordinate.value.y - block.value.radius * 2 + 1
                const imageData = ctx.value.block.getImageData(
                    coordinate.value.x,
                    coordinateY,
                    block.value.real,
                    block.value.real
                )
                const blockElem = blockRef.value as unknown as HTMLCanvasElement
                if (blockElem) blockElem.width = block.value.real
                ctx.value.block.putImageData(imageData, coordinate.value.offset, coordinateY)
                ctx.value.block.restore()
                loading.value = false
            }
        }

        const initImageElem = () => {
            const elem = new Image()
            elem.src = _background.value
            elem.onload = () => initImage(elem)
        }

        const drawBlock = (
            ctx: CanvasRenderingContext2D,
            direction: Partial<CaptchaModalBlockPosition> = {},
            operation: CanvasOperation
        ) => {
            ctx.beginPath()
            ctx.moveTo(coordinate.value.x, coordinate.value.y)
            const direct = direction?.direction
            const type = direction?.type
            /** top */
            if (direct === 'top') {
                ctx.arc(
                    coordinate.value.x + block.value.size / 2,
                    coordinate.value.y,
                    block.value.radius,
                    -block.value.PI,
                    0,
                    type === 'inner'
                )
            }
            ctx.lineTo(coordinate.value.x + block.value.size, coordinate.value.y)
            /** right */
            if (direct === 'right') {
                ctx.arc(
                    coordinate.value.x + block.value.size,
                    coordinate.value.y + block.value.size / 2,
                    block.value.radius,
                    1.5 * block.value.PI,
                    0.5 * block.value.PI,
                    type === 'inner'
                )
            }
            ctx.lineTo(coordinate.value.x + block.value.size, coordinate.value.y + block.value.size)
            /** bottom */
            ctx.arc(
                coordinate.value.x + block.value.size / 2,
                coordinate.value.y + block.value.size,
                block.value.radius,
                0,
                block.value.PI,
                true
            )
            ctx.lineTo(coordinate.value.x, coordinate.value.y + block.value.size)
            /** left */
            ctx.arc(
                coordinate.value.x,
                coordinate.value.y + block.value.size / 2,
                block.value.radius,
                0.5 * block.value.PI,
                1.5 * block.value.PI,
                true
            )
            ctx.lineTo(coordinate.value.x, coordinate.value.y)
            ctx.shadowColor = 'rgba(0, 0, 0, .001)'
            ctx.shadowBlur = 20
            ctx.lineWidth = 1.5
            ctx.fillStyle = 'rgba(0, 0, 0, .4)'
            ctx.strokeStyle = 'rgba(255, 255, 255, .8)'
            ctx.stroke()
            ctx.closePath()
            ctx[operation]()
        }

        const drawBlockPosition = () => {
            const x = $tools.randomNumberInRange(
                block.value.real + 20,
                size.value.width - (block.value.real + 20)
            )
            const y = $tools.randomNumberInRange(55, size.value.height - 55)
            const direction = drawBlockDirection()
            coordinate.value.x = x
            coordinate.value.y = y
            drawBlock(ctx.value.image!, direction, 'fill')
            drawBlock(ctx.value.block!, direction, 'clip')
        }

        const drawBlockDirection = (): CaptchaModalBlockPosition => {
            const direction = { top: 'top', right: 'right' } as const
            const from = ['inner', 'outer'] as const
            const keys = Object.keys(direction) as Array<keyof typeof direction>
            const key = keys[Math.floor(Math.random() * keys.length)]
            const result: CaptchaModalBlockPosition = {
                direction: direction[key],
                type: from[Math.floor(Math.random() * from.length)]
            }
            return result
        }

        const getBoundingClientRect = (elem: HTMLElement, specific = null) => {
            const rect = elem.getBoundingClientRect()
            if (specific && rect[specific]) return rect[specific]
            return rect
        }

        const dragStart = (evt: any) => {
            evt.preventDefault()
            evt.stopPropagation()
            const x = evt.clientX || evt.touches[0].clientX
            const sliderRect = getBoundingClientRect(sliderRef.value as any)
            const sliderBtnRect = getBoundingClientRect(sliderBtnRef.value as any)
            drag.value.originX = Math.round(sliderRect.left * 10) / 10
            drag.value.originY = Math.round(sliderRect.top * 10) / 10
            drag.value.offset = Math.round((x - sliderBtnRect.left) * 10) / 10
            drag.value.moving = true
            time.value.start = Date.now()
        }

        const dragMoving = (evt: any) => {
            if (!drag.value.moving || check.value.being) return

            const x = evt.clientX || evt.touches[0].clientX
            let moveX = Math.round((x - drag.value.originX - drag.value.offset) * 10) / 10
            moveX = Math.max(0, Math.min(moveX, size.value.width - 54))

            elements.value.slider!.style.left = `${moveX}px`
            elements.value.block!.style.left = `${moveX}px`
            check.value.value = moveX
        }

        const dragEnd = (forcedStop = false) => {
            if (!drag.value.moving) return
            time.value.end = Date.now()
            drag.value.moving = false

            if (forcedStop) {
                dragReset()
                return
            }

            handleVerify()
        }

        const dragReset = () => {
            elements.value.slider!.style.left = '0'
            elements.value.block!.style.left = '0'
            drag.value.originX = 0
            drag.value.originY = 0
        }

        const handleVerify = async () => {
            const coordinateX = Math.round((check.value.value || 0) + coordinate.value.offset)
            if (check.value.being) return
            check.value.being = true
            const error = (msg = '') => {
                setTimeout(() => dragReset(), 1000)
                check.value.num++
                check.value.correct = false
                if (msg) check.value.tip = msg
            }
            if (
                coordinate.value.x - props.offset <= coordinateX &&
                coordinate.value.x + props.offset >= coordinateX
            ) {
                const succcess = (data: any = {}) => {
                    setTimeout(() => handleClose('success', data), 400)
                }
                const take =
                    Math.round(((time.value.end ?? 0) - (time.value.start ?? 0)) / 10) / 100
                check.value.tip = t('captcha.success', { take })
                if (props.verifyAction) {
                    if (typeof props.verifyAction === 'string') {
                        await $request[(props.verifyMethod || 'POST').toLowerCase()](
                            props.verifyAction,
                            props.verifyParams,
                            props.actionConfig
                        )
                            .then((res: ResponseData) => {
                                if (res?.ret?.code === 200) {
                                    check.value.correct = true
                                    succcess(res?.data)
                                } else error()
                            })
                            .catch((err: any) => error(err?.message))
                    } else if (typeof props.verifyAction === 'function') {
                        const result = await props.verifyAction()
                        if (result === true) succcess()
                        else error(typeof result === 'string' ? result : '')
                    }
                } else {
                    check.value.correct = true
                    succcess()
                }
            } else error()
            const result = resultRef.value as unknown as HTMLElement
            if (result) result.style.bottom = '0'
            if (check.value.num <= check.value.tries) check.value.show = true
            setTimeout(() => {
                drag.value.moving = false
                if (result)
                    result.style.bottom =
                        (locale as unknown as string) === 'en-us'
                            ? $tools.convert2rem(-48)
                            : $tools.convert2rem(-32)
            }, 1000)
            setTimeout(() => {
                check.value.show = false
                check.value.being = false
                if (check.value.num >= check.value.tries) handleClose('frequently')
            }, 1600)
        }

        const handleClose = (status?: any, data?: any) => {
            loading.value = true
            if (typeof status !== 'string') status = 'close'
            if (props.maskClosable) {
                open.value = false
                emit('update:open', open.value)
                setTimeout(() => {
                    emit('close', { status, data })
                }, 400)
            }
        }

        const handleRefresh = () => {
            loading.value = true
            setCheckData()
            const block = blockRef.value as any
            block.width = size.value.width
            ctx.value.image!.clearRect(0, 0, size.value.width, size.value.height)
            ctx.value.block!.clearRect(0, 0, size.value.width, size.value.height)
            initImageElem()
        }

        const renderMaks = () => {
            return props.mask && open.value ? (
                <div
                    ref={maskRef}
                    class={`${styled.mask}${
                        width.value < $g.breakpoints.md ? ` ${styled.maskMobile}` : ''
                    }`}
                    onClick={handleClose}
                    style={{ zIndex: Date.now() }}
                />
            ) : null
        }

        const renderArrow = () => {
            const border = {
                borderColor: props.color
                    ? `transparent ${props.color} transparent transparent`
                    : undefined
            }
            return width.value >= $g.breakpoints.md && props.captchaVisible ? (
                <div class={styled.arrow}>
                    <div class={styled.arrowOut} style={border}></div>
                    <div class={styled.arrowIn} style={border}></div>
                </div>
            ) : null
        }

        const renderContentLoading = () => {
            return loading.value ? (
                <div class={styled.loading}>
                    <div class={styled.loadingSpinner}>
                        <div class={styled.loadingLoad}>
                            <div>
                                <div>
                                    <div style={{ borderColor: props.color ?? null }}></div>
                                    <div style={{ background: props.color ?? null }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class={styled.loadingTip}
                        innerHTML={tt('captcha.loading', 'Loading ···')}
                    />
                </div>
            ) : null
        }

        const renderContentInfo = () => {
            return (
                <div class={styled.info}>
                    <canvas ref={imageRef} width={size.value.width} height={size.value.height} />
                    <canvas ref={blockRef} width={size.value.width} height={size.value.height} />
                </div>
            )
        }

        const renderContentResult = () => {
            return (
                <div
                    ref={resultRef}
                    class={`${styled.result} ${
                        check.value.correct ? `${styled.resultSuccess}` : `${styled.resultError}`
                    }`}
                    innerHTML={check.value.tip}
                />
            )
        }

        const renderSliderTrack = () => {
            return (
                <div class={styled.sliderTrack} style={{ borderColor: props.color ?? null }}>
                    <span
                        class={`${styled.sliderTrackTip}${
                            drag.value.moving ? ` ${styled.sliderTrackTipHide}` : ''
                        }`}>
                        {tt('captcha.drag', 'Drag')}
                    </span>
                </div>
            )
        }

        const renderSliderBtn = () => {
            return (
                <div
                    ref={sliderBtnRef}
                    class={styled.sliderBtn}
                    style={{ borderColor: props.color ?? null }}>
                    <div class={styled.sliderBtnIcon} style={{ borderColor: props.color ?? null }}>
                        <div class={styled.sliderBtnVertical} />
                        <div
                            class={styled.sliderBtnHorizontal}
                            style={{ background: props.color ?? null }}
                        />
                    </div>
                </div>
            )
        }

        const renderPanelAction = () => {
            return (
                <div class={styled.panelAction}>
                    <Tooltip
                        title={tt('captcha.close', 'Close')}
                        color={props.color}
                        arrowPointAtCenter={true}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        style={{ zIndex: Date.now() }}>
                        <CloseCircleOutlined onClick={handleClose} />
                    </Tooltip>
                    <Tooltip
                        title={tt('captcha.refresh', 'Refresh')}
                        color={props.color}
                        arrowPointAtCenter={true}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        style={{ zIndex: Date.now() }}>
                        <ReloadOutlined onClick={handleRefresh} />
                    </Tooltip>
                    <Tooltip
                        title={tt('captcha.feedback', 'Feedback')}
                        color={props.color}
                        arrowPointAtCenter={true}
                        autoAdjustOverflow={false}
                        overlayClassName={styled.panelActionTooltip}
                        style={{ zIndex: Date.now() }}>
                        <a href={site.value} target="_blank">
                            <QuestionCircleOutlined />
                        </a>
                    </Tooltip>
                </div>
            )
        }

        const renderPanelCopyright = () => {
            return (
                <div class={styled.panelCopyright}>
                    <div
                        class={styled.panelCopyrightText}
                        style={{ borderColor: props.color ?? null }}>
                        <Tooltip
                            title={tt('captcha.provide', '')}
                            color={props.color}
                            arrowPointAtCenter={true}
                            autoAdjustOverflow={false}
                            overlayClassName={styled.panelActionTooltip}
                            style={{ zIndex: Date.now() }}>
                            <a href={site.value} target="_blank">
                                <img src={$g.logo || $g.logo} alt={powered.value} />
                            </a>
                        </Tooltip>
                    </div>
                </div>
            )
        }

        const renderContent = () => {
            return (
                <div
                    ref={contentRef}
                    class={styled.content}
                    style={{ borderColor: props?.color ?? null }}>
                    <div class={styled.contentInner}>
                        <div class={styled.embed}>
                            {renderContentLoading()}
                            {renderContentInfo()}
                            {renderContentResult()}
                        </div>
                        <div ref={sliderRef} class={styled.slider}>
                            {renderSliderTrack()}
                            {renderSliderBtn()}
                        </div>
                    </div>
                    <div class={styled.panel}>
                        {renderPanelAction()}
                        {renderPanelCopyright()}
                    </div>
                </div>
            )
        }

        onMounted(() => nextTick().then(() => init()))

        onUnmounted(() => {
            $tools.off(elements.value.slider!, 'pointerdown', dragStart)
            $tools.off(elements.value.slider!, 'touchstart', dragStart)
            $tools.off(modalRef.value!, 'pointermove', dragMoving)
            $tools.off(modalRef.value!, 'touchmove', dragMoving)
            $tools.off(window, 'pointerup', handlePointerUp)
            $tools.off(window, 'touchend', handleTouchEnd)
        })

        return () => (
            <Fragment>
                {renderMaks()}
                <Transition name={anim.value} appear={true}>
                    <div
                        ref={modalRef}
                        class={`${styled.container} ${getPrefixCls(`modal-${locale.value}`)}${
                            !check.value.correct && check.value.show ? ` ${styled.error}` : ''
                        }${width.value < $g.breakpoints.md ? ` ${styled.mobile}` : ''}`}
                        style={{
                            ...$tools.wrapPositionOrSpacing(props.position || {}),
                            zIndex: Date.now()
                        }}
                        v-show={open.value}>
                        {renderArrow()}
                        {renderContent()}
                    </div>
                </Transition>
            </Fragment>
        )
    }
})

export default MiCaptchaModal
