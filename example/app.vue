<template>
    <div class="mi-captchas">
        <mi-captcha></mi-captcha>
        <mi-captcha theme-color="#2F9688" border-color="#2F9688" box-shadow-color="#2F9688"></mi-captcha>
        <mi-captcha theme-color="#be6be0" init-action="v1/captcha/init" @init="initAfter" verify-action="v1/captcha/verification" :verify-params="verifyParams"></mi-captcha>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        data() {
            return {
                verifyParams: {}
            }
        },
        methods: {
            initAfter(res) {
                if (res.ret.code === 1) {
                    localStorage.setItem('mi-captcha-key', res.data.key)
                    this.verifyParams = {key: res.data.key}
                }
            }
        }
    })
</script>