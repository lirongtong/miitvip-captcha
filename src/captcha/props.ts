import PropTypes from '../utils/props-types'
import { tuple } from '../utils/props-tools'
import { $g } from '../utils/global'

export const captchaProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).def(320),
    height: PropTypes.number,
    radius: PropTypes.number.def(48),
    themeColor: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(true),
    boxShadowColor: PropTypes.string,
    boxShadowBlur: PropTypes.number.def(4),
    modalBgColor: PropTypes.string,
    modalBoxShadow: PropTypes.bool.def(true),
    modalBoxShadowColor: PropTypes.string,
    modalBoxShadowBlur: PropTypes.number,
    image: PropTypes.string,
    logo: PropTypes.string,
    mask: PropTypes.bool.def(true),
    maskClosable: PropTypes.bool.def(true),
    maxTries: PropTypes.number.def(5),
    initParams: PropTypes.object.def({}),
    initAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    initMethod: PropTypes.oneOf(tuple(...$g.methods)).def('get'),
    verifyParams: PropTypes.object.def({}),
    verifyAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    verifyMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post'),
    checkParams: PropTypes.object.def({}),
    checkAction: PropTypes.string,
    checkMethod: PropTypes.oneOf(tuple(...$g.methods)).def('post')
})
