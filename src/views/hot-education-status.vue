<template>

    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v hot-education-status">
           <section class="tab-select-header flex-h">
                <div class="tabnav flex-a-i" v-bind:class="{ 'select': showBrought }" @click="selectBrought">已购买</div>
                <div class="tabnav flex-a-i" v-bind:class="{ 'select': showCollect }" @click="selectCollect">已收藏</div>
           </section>

            <section class="tab-select-body flex-a-i">
                <section class="has-brought-with-result" v-if="showBrought && hasBrought">
                    <div v-for="broughtItem in broughtItems" class="free-item-details" @click="goDetailPage(broughtItem.popuEducationId)">
                        <img v-lazy="broughtItem.picUrl"/>
                        <div class="free-item-details-bottom">
                            <span class="free-item-title">{{broughtItem.name}}</span>
                            <span class="active-code">{{broughtItem.promoCode}}</span>
                            <p class="expiration-time">{{broughtItem.expireTime}}</p>
                        </div>
                        <div class="stop-pro" @click="stopPro()">
                            <button class="use-way" @click.stop="useSolution(broughtItem.useWayUrl)" v-if="broughtItem.useWay">使用方式 > </button>
                        </div>
                    </div>
                </section>

                <section class="has-brought-without-result" v-if="showBrought && !hasBrought">
                    <img src="/static/icon_blank_course_a@2x.png"/>
                    <p>这里空荡荡的，赶快去首页挖掘一下吧!</p>
                </section>

                <section class="has-collected-with-result" v-if="showCollect && hasCollect">
                    <mt-cell-swipe
                        title=""
                        :right="[
                            {
                                content: '删除',
                                style: {
                                    background: 'url(/static/icon_del_a@2x.png) #F5F5F8 no-repeat center center',
                                    backgroundSize : '2.5rem 2.5rem',
                                    color : '#ffffff',
                                    fontSize : '0',
                                    lineHeight : '5.3rem',
                                    width : '5rem',
                                    textAlign: 'center'
                                },
                                handler: () => rightSlideDelete(collectItem.id, index)
                            }
                        ]"
                        v-for="(collectItem, index) in collectionItems">

                        <div class="collect-item-details" @click="goDetailPage(collectItem.id)">
                            <img v-lazy="collectItem.picUrl"/>
                            <div>
                                <span class="collect-item-title">{{collectItem.name}}</span>
                                <span class="collect-item-hot">{{collectItem.sentiment}}</span>
                                <span class="collect-item-price" v-if="collectItem.priceType">￥{{collectItem.price}}</span>
                                <span class="collect-item-free" v-if="!collectItem.priceType">免费</span>
                                <p class="collect-item-intro">{{collectItem.introduce}}</p>
                            </div>
                        </div>
                    </mt-cell-swipe>
                </section>

                <section class="has-collected-without-result" v-if="showCollect && !hasCollect">
                    <img src="/static/icon_blank_collection_a@2x.png"/>
                    <p>这里空荡荡的，赶快去首页挖掘一下吧!</p>
                </section>
            </section>
        </div>
    </div>

</template>

<script>
    import { Toast , MessageBox, Indicator } from 'mint-ui';
    import { haveBroughtHot , haveCollectedHot , hotEducationCancel } from "../api/api";

    export default {
        data() {
            return {
                ready: false,
                showBrought: true,
                hasBrought: false,
                showCollect: false,
                hasCollect: false,
                collectionItems : [],
                broughtItems : []
            }
        },
        methods : {
            useSolution : function(_url) {
                window.location.href = _url;
            },
            rightSlideDelete : function(_id, index) {
                let params = { popular_education_id : _id };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                hotEducationCancel(params).then(res => {
                    Indicator.close();

                    let { code , msg , data } = res;

                    if(code == 0) {
                        this.collectionItems.splice(index, 1);
                        Toast({ message: '已成功删除', position: 'center', duration: 2000 });
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            },
            goDetailPage : function(_id) {
                this.$router.push({path : "hoteducationdetail" , query : {id : _id}});
            },
            getBroughtList : function() {
                haveBroughtHot().then(res => {
                    let { code , msg , data } = res;
                    
                    if(code == 0) {
                        if(data.myDetail.length == 0) {
                            this.hasBrought = false;
                        }else{
                            this.hasBrought = true;
                            this.broughtItems = data.myDetail;
                        }
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }

                    this.ready = true;
                })
            },
            getCollectedList : function() {
                haveCollectedHot().then(res => {
                    let { code , msg , data } = res;
                    if(code == 0) {
                        if(data.list.length == 0) {
                            this.hasCollect = false;
                        }else{
                            this.hasCollect = true;
                            this.collectionItems = data.list;
                        }
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            },
            selectBrought: function() {
                this.showBrought = true;
                this.showCollect = false;
            },
            selectCollect: function() {
                this.showBrought = false;
                this.showCollect = true;
            }
        },
        mounted() {
            this.getBroughtList();
            this.getCollectedList();
        }
    }
</script>

<style lang="scss">
    .hot-education-status {
        .mint-cell-swipe{
            display: block;
        }
        .mint-cell-value{
            width:100%;
        }
        .mint-cell-wrapper{
            background-image: none !important;
            padding: 0 0;
            .mint-cell-title{
                display: none;
            }
            .mint-cell-value{
                width:100%;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .container-wrapper{
        background:#F5F5F8;
        overflow: hidden !important;
    }
    .hot-education-status{
        background:#F5F5F8;
    }

    .tab-select-header{
        margin-bottom: .5rem;
        background: #FFFFFF;

        .tabnav{
            padding-top: .35rem;
            position: relative;
            line-height: 1.65rem;
            text-align: center;
            font-size: .75rem;
            color: #999;

            &.select{
                &:after{
                    content: "";
                    position: absolute;
                    z-index: 3;
                    left:50%;
                    bottom: 0;
                    margin-left: -1rem;
                    width: 2rem;
                    height: 2px;
                    background-color: #20B681;
                }
            }
        }
    }

    .tab-select-body{
        position:relative;
        overflow: hidden;
    }

    .has-brought-with-result{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        background:#F5F5F8;

        .stop-pro{
            position: absolute;
            top:1.5rem;
            right:0;
            width:21%;
            height:1.5rem;
        }
        button.use-way{
            background: #F85353;
            font-size:0.6rem;
            width:100%;
            color: #FFFFFF;
            line-height: 1.5rem;
            border-radius:30px 0 0 30px;
        }
    }

    .free-item-details{
        width:100%;
        height:12.5rem;
        /*margin-top: 0.5rem;*/
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: #ffffff;
        position:relative;
        img{
            width:100%;
            height:8.75rem;
            margin-bottom: 0.5rem;
        }
        .free-item-details-bottom{
            position: relative;
        }
        .free-item-title{
            font-size: 0.75rem;
            color: #333333;
            line-height: 1.05rem;
            margin-right: 1rem;
        }
        .active-code{
            font-size: 0.75rem;
            color: #20B681;
            position: absolute;
            right:0;
            top:0.05rem;
        }
        .expiration-time{
            font-size: 0.6rem;
            color: #333333;
            text-align: right;
        }
    }

    .has-brought-without-result,.has-collected-without-result{
        background-color: #FFF;
        height: 100%;
        overflow:hidden;

        img{
            width:60%;
            display: block;
            margin:3.85rem auto 1.45rem;
        }
        p{
            font-size: 0.7rem;
            color: #999999;
            text-align: center;
        }
    }

    .has-collected-with-result{
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        background:#F5F5F8;

        a.mint-cell-swipe{
            margin-bottom: 0.5rem;
        }
        .collect-item-details{
            width: 100%;
            padding: 0.5rem;
            background: #ffffff;
            img{
                display: block;
                width:100%;
                height:8.75rem;
                margin-bottom: 0.5rem;
                border-radius: 4px;
            }
            .collect-item-title{
                font-size: 0.75rem;
                color: #333333;
                line-height: 1.05rem;
                margin-right: 1rem;
            }
            .collect-item-hot{
                display: inline-block;
                background: url(/static/icon_fire_a@2x.png) no-repeat 0 0;
                background-size: 0.75rem 0.9rem;
                font-size: 0.6rem;
                color: #999999;
                line-height: 0.9rem;
                text-indent: 0.8rem;
            }
            .collect-item-price{
                font-size: 0.75rem;
                color: #F85353;
                line-height: 1.05rem;
                float: right;
            }
            .collect-item-free{
                font-size: 0.75rem;
                color: #20B681;
                letter-spacing: 0;
                line-height: 1.05rem;
                float: right;
            }
            .collect-item-intro{
                font-size: 0.6rem;
                color: #999999;
                line-height: 0.9rem;
                margin-top: 0.25rem;
            }
        }
    }
</style>
