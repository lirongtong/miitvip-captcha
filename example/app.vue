<template>
    <div class="mi-captchas">
        <mi-captcha></mi-captcha>
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