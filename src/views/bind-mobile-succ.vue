<template>
    <div class="app-container">
        <div class="container-wrapper">
            <p class="text">已绑定手机号</p>
            <p class="mobile">{{ mobile }}</p>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';

    export default {
        data() {
            return {
                mobile: ''
            };
        },
        methods: {
            getMobile: function() {
                this.mobile = localStorage.getItem('mobile');
            }
        },
        mounted() {
            this.getMobile();
        }
    }
</script>

<style lang="scss" scoped>
    .text{
        margin-top: 6.4rem;
        font-size: .7rem;
        color: #333;
        line-height: 1rem;
        text-align: center;
    }

    .mobile{
        margin-top: .5rem;
        font-size: .9rem;
        line-height: 1.25rem;
        color: #20B681;
        text-align: center;
    }
</style>