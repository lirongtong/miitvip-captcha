<template>
    <div class="mi-captchas">
        <mi-captcha ref="captcha" />
        <a @click="reset" style="margin-bottom: 24px;text-align: center;display: block;">重置</a>
        <mi-captcha theme-color="#2F9688"
            border-color="#2F9688"
            box-shadow-color="#2F9688" />
        <mi-captcha theme-color="#be6be0"
            init-action="v1/captcha/init"
            @init="initAfter"
            verify-action="v1/captcha/verification"
            :verify-params="params.verify" />
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'

    const captcha = ref(null)

    const params = reactive({
        verify: { key: null }
    })
    
    const initAfter = (res) => {
        if (res?.ret?.code === 200) {
            localStorage.setItem('mi-captcha-key', res?.data?.key)
            params.verify.key = res?.data?.key
        }
    }

    const reset = () => {
        console.log('reinitialize')
        captcha.value?.reset(false)
    }
</script>