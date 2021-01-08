<template>
    <div class="mi-captchas">
        <mi-captcha></mi-captcha>
        <mi-captcha image="./bg.jpg" theme-color="#2F9688" border-color="#2F9688" box-shadow-color="#2F9688"></mi-captcha>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        methods: {
            initAfter(res) {
                console.log(res)
            }
        }
    })
</script>