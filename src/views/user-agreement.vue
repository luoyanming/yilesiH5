<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper" id="protocal">用户协议</div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import { protocol } from '../api/api';

    export default {
        data() {
            return {
                ready : false
            }
        },
        methods: {
            getProtocal: function() {
                protocol({}).then(res => {
                    document.getElementById('protocal').innerHTML = res;

                    this.ready = true;
                });
            }
        },
        mounted() {
            this.getProtocal();
        }
    }
</script>

<style lang="scss" scoped>

</style>