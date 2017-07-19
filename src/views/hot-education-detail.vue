<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v">
            <div class="iframe-wrapper flex-a-i">
                <iframe :src="detailUrl"></iframe>
            </div>

            <section class="download-area flex-h" v-if="showPayBar == 1">
                <div class="collect-btn">
                    <mt-button plain class="has-collect" v-if="hasCollectBtn" @click.native="cancelCollectLesson()">已收藏</mt-button>
                    <mt-button plain class="no-collect" v-if="!hasCollectBtn" @click.native="collectLesson()">收藏</mt-button>
                </div>
                <div class="download-btn flex-a-i" v-bind:class="buttonSkin" @click="goYingyongbao()" v-if="!priceType">立即下载</div>
                <div class="buy-btn flex-a-i" @click="choosePay()" v-if="priceType">立即购买(￥{{money}} )</div>
            </section>
        </div>

        <mt-actionsheet
                :actions="actions"
                v-model="sheetVisible">
        </mt-actionsheet>

    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { isLogin, educationHotDetail , hotEducationCollect , hotEducationCancel, downUrl, getJsApi, getPayChannel, buyHotEducation, orderCallback, buyHotEducationAlipay, ratelevelPrice } from "../api/api";

    let that = '';

    export default {
        data() {
            return {
                islogin: false,
                ready: false,
                detailUrl : '',
                useUrl: '',
                hasCollectBtn : false,
                sheetVisible : false,
                priceType : 1,
                money : 1,
                showPayBar: 1,
                actions : [],
                outTradeNo: ''
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
            checkIsLogin: function() {
                isLogin({}).then(res => {
                    let { code, msg, data } = res;

                    if (code == 0) {
                        this.islogin = true;
                        this.getWXApi();
                    } else {
                        this.islogin = false;
                    }
                });
            },
            goYingyongbao : function() {
                window.location.href = this.useUrl;
            },
            choosePay : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }
                
                this.getRatelevelPrice();
            },
            collectLesson : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }

                let param = { popular_education_id : this.$route.query.id };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                hotEducationCollect(param).then(res => {
                    Indicator.close();
                    this.hasCollectBtn = true;

                    let { code , msg , data } = res;

                    if(code != 0) {
                        Toast({ message: msg, position: 'center', duration: 2000 });
                    } else {
                        Toast({ message: '已收藏', position: 'center', duration: 2000 });
                    }
                })
            },
            cancelCollectLesson : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }

                let param = { popular_education_id : this.$route.query.id };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                hotEducationCancel(param).then(res => {
                    Indicator.close();
                    this.hasCollectBtn = false;

                    let { code , msg , data } = res;

                    if(code != 0) {
                        Toast({ message: msg, position: 'center', duration: 2000 });
                    } else {
                        Toast({ message: '已取消收藏', position: 'center', duration: 2000 });
                    }
                })
            },
            getHotDetail : function() {
                let params = { id:this.$route.query.id };

                educationHotDetail(params).then(res => {
                    let { code , msg ,data } = res;

                    if( code == 0) {
                        this.detailUrl = data.detail.detailUrl;
                        this.priceType = data.detail.priceType;
                        this.money = data.detail.price;
                        this.hasCollectBtn = data.detail.collection;
                        this.showPayBar = data.detail.showPayBar;
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                    this.ready = true;
                });
            },
            getDownUrl: function() {
                let deviceInfo = '';
                if(navigator.userAgent.match(/ios/i) || navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipad/i) || navigator.userAgent.match(/ipod/i)){
                    deviceInfo = 'ios';
                }else{
                    deviceInfo = 'android';
                }

                let params = { popular_education_id: this.$route.query.id, device_info: deviceInfo };

                downUrl(params).then(res => {
                    let { code , msg ,data } = res;

                    if( code == 0) {
                        this.useUrl = data.url;
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                });
            },
            getRatelevelPrice: function() {
                let param = { 'id': this.$route.query.id };

                ratelevelPrice(param).then(res => {
                    let {code, msg, data} = res;

                    if(code != 0) {
                        Toast({ message: msg, position: 'center', duration: 2000 });
                    } else {
                        this.getPayChannel(data.ish, data.price);
                    }
                });
            },
            getPayChannel: function(ish, price) {
                getPayChannel({}).then(res => {
                    let {code, errorInfo, data} = res;

                    if(code != 0) {
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                    } else {
                        if(data.payChannels[0] == 1) {
                            // Alipay
                            this.actions = [];

                            if(ish) {
                                this.actions.push({
                                    name : "支付宝支付(您将享受￥"+ price +"价格)",
                                    method : function() {
                                        that.alipayPay();
                                    }
                                });
                            } else {
                                this.actions.push({
                                    name : "支付宝支付",
                                    method : function() {
                                        that.alipayPay();
                                    }
                                });
                            }
                        } else if(data.payChannels[0] == 2) {
                            // wechatpay
                            this.actions = [];
                            
                            if(ish) {
                                this.actions.push({
                                    name : "微信支付(您将享受￥"+ price +"价格)",
                                    method : function() {
                                        that.wechatPay();
                                    }
                                });
                            } else {
                                this.actions.push({
                                    name : "微信支付",
                                    method : function() {
                                        that.wechatPay();
                                    }
                                });
                            }
                        }

                        this.sheetVisible = true;
                    }
                });
            },
            alipayPay: function() {
                let form =  document.createElement('form');
                form.action = '/popular/education/pre/order/alipay';
                form.method = 'post';
                form.id = 'form';
                form.innerHTML = '<input hidden name="popular_education_id" value="'+ this.$route.query.id +'" /><input hidden name="payType" value="weixin" /><input hidden name="deviceInfo" value="'+ navigator.userAgent +'" />';
                document.body.appendChild(form);

                document.getElementById('form').submit();
            },
            getWXApi: function() {
                that = this;

                let getJsApiParam = { currentUrl: location.href };

                getJsApi(getJsApiParam).then(res => {
                    let {code, errorInfo, data } = res;

                    if(code != 0){
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                    } else {
                        wx.config({
                            debug: false,
                            appId: data.weixinJSData.appId,
                            timestamp: data.weixinJSData.timestamp,
                            nonceStr: data.weixinJSData.nonceStr,
                            signature: data.weixinJSData.signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'chooseWXPay'
                            ]
                        });
                    }
                });
            },
            wechatPay: function() {
                let buyHotEducationParam = { popular_education_id: this.$route.query.id, payType: 'weixin', deviceInfo: navigator.userAgent };

                buyHotEducation(buyHotEducationParam).then(res => {
                    let {code, errorInfo, data } = res;

                    if(code != 0){
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                    } else {
                        wx.chooseWXPay({
                            timestamp: data.preOrder.timeStamp,
                            nonceStr: data.preOrder.nonceStr,
                            package: data.preOrder.package,
                            signType: data.preOrder.signType,
                            paySign: data.preOrder.paySign,
                            success: function (resp) {
                                that.OrderWXCallback(that.outTradeNo);
                             }
                        });
                    }
                });
            },
            OrderWXCallback: function(tradeNo) {
                let orderCallbackParam = { outTradeNo: tradeNo };

                orderCallback(orderCallbackParam).then(res => {
                    let {code, errorInfo, data } = res;

                    if(code != 0){
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                        
                        this.$router.push({ path: '/hotpayfailure', query: { id: this.$route.query.id } });
                    } else {
                        Toast({ message: '支付成功', position: 'bottom', duration: 2000 });

                        this.$router.push({ path: '/hotpaysuccess', query: { id: this.$route.query.id } });

                        this.introduce.buyed = true;
                    }
                });
            },
        },
        mounted() {
            this.checkIsLogin();
            this.getHotDetail();
            this.getDownUrl();
        }
    }
</script>

<style lang="scss" scoped>
    .container-wrapper{
        overflow: hidden;
    }
    .iframe-wrapper{
        position: relative;
        overflow: hidden;
    }
    iframe{
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width:100%;
        height:100%;
    }
    .download-area{
        height:2.45rem;
        box-shadow: inset 0 1px 0 0 rgba(0,0,0,0.10);
        div{
            &.download-btn{
                background: #20B681;
                font-size: 0.75rem;
                color: #FFFFFF;
                line-height: 2.45rem;
                text-align: center;
            }
            &.buy-btn{
                 background: #F85353;
                 font-size: 0.75rem;
                 color: #FFFFFF;
                 line-height: 2.45rem;
                text-align: center;
             }
            &.collect-btn{
                width: 3.75rem;
                button{
                    width:100%;
                    height:2.45rem;
                    border:none;
                    border-radius:0;
                    font-size: 0.6rem;
                    color: #999999;
                    line-height:3.7rem;
                    &.has-collect{
                        background: url(/static/icon_Collection2@2x.png) no-repeat center 0.4rem;
                        background-size: 1rem 1rem;
                    }
                    &.no-collect{
                         background: url(/static/icon_Collection1@2x.png) no-repeat center 0.4rem;
                         background-size: 1rem 1rem;
                    }
                }
            }
        }
    }

</style>