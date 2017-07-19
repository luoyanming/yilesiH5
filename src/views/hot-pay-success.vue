<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">
            <section class="pay-success">
                <img src="/static/icon_success_a@2x.png"/>
                <div class="pay-success-info">
                    <p>支付成功</p>
                    <p>您可以去“热门教育”</p>
                    <p>查看您的会员码和使用规则哦~</p>
                </div>
                <mt-button class="see-now-btn" v-bind:class="buttonSkin" @click.native="seeNow()">立即查看</mt-button>
                <mt-button class="known-btn" @click.native="seeNow()">知道了</mt-button>
            </section>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                ready: true
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
            seeNow : function() {
                this.$router.push({ path: '/hoteducationdetail', query: { id: this.$route.query.id } });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pay-success{
        padding:11.5% 15% 0;
        background: #ffffff;
        height:100%;
        img{
            width:100%;
            margin-bottom: 5.2%;
        }
        .pay-success-info{
            text-align: center;
            p:nth-of-type(1){
                font-size: 0.75rem;
                color: #333333;
                line-height: 1.05rem;
            }
            p:nth-of-type(2),p:nth-of-type(3){
                font-size: 0.7rem;
                color: #999999;
                line-height: 1rem;
            }
        }
        button{
            display: block;
            width:100%;
            height:2.5rem;
            border-radius: 6px;
            line-height: 1.05rem;
            text-align: center;
            font-size: 0.75rem;
            &.see-now-btn{
                 background: #20B681;
                 color: #FFFFFF;
                 margin:14% auto 10%;
             }
             &.known-btn{
                  background: #F5F5F8;
                  color: #666666;
              }
        }
    }
</style>