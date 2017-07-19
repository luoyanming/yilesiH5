<template>
    <div class="app-container">
        <div class="container-wrapper">
            <section class="pay-failure">
                <img src="/static/icon_fail_a@2x.png"/>
                <div class="pay-failure-info">
                    <p>支付失败</p>
                    <p>呃...到底哪里出问题了呢？</p>
                </div>
                <mt-button class="go-back-btn" v-bind:class="buttonSkin" @click.native="goBack()">返回</mt-button>
            </section>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        computed: {
            buttonSkin: function() {
                if(!localStorage.getItem('source') || localStorage.getItem('source') == '') {
                    return false;
                }

                let buttonSkinSoure = 'button-skin-' + localStorage.getItem('source');

                return buttonSkinSoure;
            }
        },
        methods : {
            goBack : function() {
                this.$router.push({ path: '/hoteducationdetail', query: { id: this.$route.query.id } });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pay-failure {
        padding: 11.5% 15% 0;
        background: #ffffff;
        height: 100%;

        img {
            width: 100%;
            margin-bottom: 5.2%;
        }

        .pay-failure-info{
            text-align: center;
            p:nth-of-type(1){
                font-size: 0.75rem;
                color: #333333;
                line-height: 1.05rem;
            }
            p:nth-of-type(2){
                font-size: 0.7rem;
                color: #999999;
                line-height: 1rem;
            }
        }

        button.go-back-btn{
            display: block;
            width:100%;
            height:2.5rem;
            background: #20B681;
            border-radius: 6px;
            font-size: 0.75rem;
            color: #FFFFFF;
            line-height: 1.05rem;
            text-align: center;
            margin-top: 22%;
        }

    }
</style>