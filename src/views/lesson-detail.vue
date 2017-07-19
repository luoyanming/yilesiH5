<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v">

            <section class="vedio-area">
                <img :src="introduce.picUrl" class="cover">
                <div class="video-wrapper">
                    <div id="video-wrapper"></div>
                </div>
                <div class="lock-mask" v-if="introduce.priceType == 1 && !introduce.buyed" @click="lockMask"></div>
                <div class="play-mask" v-if="(introduce.priceType == 0 || introduce.buyed) && !isPlay" @click="unlockMask"></div>
            </section>

            <section class="tab-selected-area">
                <mt-navbar v-model="selected">
                    <mt-tab-item id="introduce">介绍</mt-tab-item>
                    <mt-tab-item id="catalog">目录</mt-tab-item>
                    <mt-tab-item id="comment">评论</mt-tab-item>
                    <mt-tab-item id="relative">相关</mt-tab-item>
                </mt-navbar>
            </section>


            <section class="tab-selected-classify flex-a-i">
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item id="introduce">
                        <div class="lesson-introduce-area">
                            <section class="lesson-total-intro">
                                <p class="title">{{introduce.name}}</p>
                                <div class="rank">
                                    <button v-for="n in introduce.star" class="selected"></button>
                                    <button v-for="m in introduce.starGrey"></button>
                                    <span class="count-number">{{introduce.scoreStr}}</span>
                                    <span v-for="tag in introduce.tags" class="feature">{{tag}}</span>
                                </div>
                                <p class="lesson-price" v-if="introduce.priceType"><span>¥</span>{{introduce.price}}</p>
                                <p class="lesson-free" v-if="!introduce.priceType">免费</p>
                            </section>
                            <section class="lesson-detail-intro">
                                <div class="lesson-intro">
                                    <p class="lesson-detail-intro-common">课程介绍</p>
                                    <p class="lesson-detail-intro-content">
                                        {{introduce.describe}}
                                    </p>
                                </div>
                                <div class="lesson-adapt-person">
                                    <p class="lesson-detail-intro-common">适用人群</p>
                                    <p class="lesson-detail-intro-content">{{introduce.fitPerson}}</p>
                                </div>
                                <div class="lesson-author" v-if="introduce.author != ''">
                                    <p class="lesson-detail-intro-common">作者</p>
                                    <p class="lesson-detail-intro-content">{{introduce.author}}</p>
                                </div>
                                <div class="lesson-screenshot" v-if="introduce.screenshotVoList.length != 0">
                                    <p class="lesson-detail-intro-common">视频截图</p>
                                    <img v-for="screenshot in introduce.screenshotVoList" v-lazy="screenshot.picUrl"/>
                                </div>
                            </section>
                        </div>
                    </mt-tab-container-item>

                    <mt-tab-container-item id="catalog">
                        <div class="catalog-area">
                            <section class="catalog-count" v-for="catalogDetail in catalog">
                                <div class="first-level-catalog">{{catalogDetail.title}}</div>
                                <div class="second-level-catalog">
                                    <mt-button plain v-for="(subList, index) in catalogDetail.subList" @click.native="catalogPlay(index)">{{subList.title}}</mt-button>
                                </div>
                            </section>
                        </div>
                    </mt-tab-container-item>

                    <mt-tab-container-item id="comment">
                        <div class="comment-area">
                            <section class="has-comment-status" v-if="hasCommentStatus" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                                <div class="comment-content-detail" v-for="commentList in comment">
                                    <section class="comment-source">
                                        <div class="touxiang">
                                            <img v-bind:src="commentList.avatar"/>
                                            <div class="user-info">
                                                <p class="user-name">{{commentList.name}}</p>
                                                <p class="release-time">{{commentList.time}}</p>
                                            </div>
                                        </div>
                                        <div class="star-rank">
                                            <button v-for="n in commentList.star" class="selected"></button>
                                            <button v-for="m in 5-commentList.star"></button>
                                        </div>
                                    </section>
                                    <section class="comment-content">
                                        {{commentList.content}}
                                    </section>
                                </div>

                                <div v-show="loading" class="loading-more"><p>loading...</p></div>
                            </section>

                            <section class="no-comment-status" v-if="!hasCommentStatus">
                                <img src="/static/icon_blank_comment_a@2x.png"/>
                                <p>这门课程还没人评论，快来抢沙发吧！</p>
                                <p>学习该课程就能评论哦~</p>
                            </section>
                        </div>
                    </mt-tab-container-item>

                    <mt-tab-container-item id="relative">
                        <div class="relative-area">
                            <img src="/static/icon_blank_course_a@2x.png"/>
                            <p>还没有相关的课程哦，先去首页转转吧～</p>
                        </div>
                    </mt-tab-container-item>
                </mt-tab-container>
            </section>

            <section class="footer-status-info flex-h">
                <div class="collect-btn">
                    <mt-button plain class="has-collect" v-if="hasCollectBtn" @click.native="cancelCollectLesson()">已收藏</mt-button>
                    <mt-button plain class="no-collect" v-if="!hasCollectBtn" @click.native="collectLesson()">收藏</mt-button>
                </div>
                <div class="operate-btn flex-a-i">
                    <mt-button plain class="notBought" v-if="!introduce.buyed && introduce.priceType == 1" @click="buyLesson()">立即购买</mt-button>
                    <!-- <mt-button plain class="hasBought" v-if="!introduce.buyed && introduce.priceType == 0" @click.native="startStudy()">开始学习</mt-button> -->
                    <mt-button plain class="hasBought" v-bind:class="buttonSkin" v-if="introduce.priceType == 0 || introduce.buyed" @click.native="goCommentPage()">我要评论</mt-button>
                </div>
            </section>

        </div>

        <mt-actionsheet
                :actions="actions"
                v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>

<script>
    import { Toast, Indicator, MessageBox } from 'mint-ui';
    import { isLogin, courseDetail, courseStartStudy, courseCommentList, courseReleaseComment, addPersonalCollection, cancelPersonalCollection, getJsApi, getPayChannel, buyCourse, orderCallback, buyCourseAlipay } from '../api/api';

    let that = '';

    export default{
        data() {
            return {
                islogin: false,
                courseId: this.$route.query.courseId,
                popupVisible : true,
                ready : false,
                selected : "introduce",
                hasCollectBtn : false,
                sheetVisible : false,
                hasCommentStatus : true,
                actions : [],
                introduce : {},
                catalog : {},
                comment : [],
                player: '',
                isPlay: false,
                outTradeNo: '',
                pageNo: 1,
                pageSize: 10,
                loading: false,
                more: true,
                time: 0
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
            addStudyID: function() {
                let courseStudyID = localStorage.getItem('courseStudyID'),
                    courseStudyIDArr = [],
                    currId = this.courseId;

                if(!courseStudyID) {
                    courseStudyIDArr.push(currId);
                    localStorage.setItem('courseStudyID', courseStudyIDArr.join(','));
                } else {
                    courseStudyIDArr = courseStudyID.split(',');
                    
                    if(courseStudyIDArr.indexOf(currId) != 0) {
                        courseStudyIDArr.push(currId);
                        localStorage.setItem('courseStudyID', courseStudyIDArr.join(','));
                    }
                }
            },
            cancelCollectLesson : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }
                
                let param = { course_id : this.$route.query.courseId };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                cancelPersonalCollection(param).then(res => {
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
            collectLesson : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }
                
                let param = { course_id : this.$route.query.courseId };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                addPersonalCollection(param).then(res => {
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
            buyLesson : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }

                this.getPayChannel();
            },
            startStudy : function() {
                if(this.introduce.buyed) {
                    return false;
                }

                let courseStartStudyParam = { courseId: this.courseId, priceType: this.introduce.priceType };

                courseStartStudy(courseStartStudyParam).then(res => {
                    let {code , errorInfo , data } = res;

                    if(code == 0) {
                        this.introduce.buyed = true;
                    } else {
                        Toast({ message: errorInfo, position: 'bottom', duration: 2000 });
                    }
                });
            },
            goCommentPage : function() {
                if(!this.islogin) {
                    this.$router.push({ path: '/login', query: { redirecturl: location.href } });
                    return false;
                }
                
                this.$router.push({path : "/lessoncomment" ,  query : { courseId: this.$route.query.courseId, selectedBtn: 'comment' } });
            },
            getCourseDetail : function() {
                if(this.$route.query.selectedBtn) {
                    this.selected = this.$route.query.selectedBtn;
                }else{
                    this.selected = "introduce";
                }

                let param = { courseId : this.courseId };

                courseDetail(param).then(res => {
                    let {code , msg , data } = res;

                    this.ready = true;

                    if(code == 0) {
                        this.introduce = data;
                        this.introduce.starGrey = 5 - data.star;
                        this.catalog = data.courseCatalogVoList;
                        if(data.collected) {
                            this.hasCollectBtn = true;
                        }else{
                            this.hasCollectBtn = false;
                        }
                        
                        this.videoInit(this.introduce.courseCatalogVoList[0].subList[0].attachmentVo[0].playUrl, this.introduce.courseCatalogVoList[0].subList[0].attachmentVo[0].thumbnailUrl);
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }

                    this.ready = true;
                })
            },
            lockMask: function() {
                if(!this.introduce.buyed) {
                    Toast({ message: '您需要先购买该课程才能观看课程视频与文档', position: 'center', duration: 2000 });
                }
            },
            unlockMask: function() {
                if(this.introduce.priceType == 0) {
                    if(this.islogin) {
                        this.startStudy();
                    } else {
                        this.addStudyID();
                    }
                }

                this.isPlay = true;
                this.player.play();
            },
            videoInit: function(url, thumb, autoplay) {
                this.player = cyberplayer("video-wrapper").setup({
                    width: '100%',
                    height: '100%',
                    file: url,
                    image: thumb,
                    autostart: false,
                    stretching: "uniform",
                    repeat: false,
                    volume: 100,
                    controls: true,
                    ak: 'ad3081dc1c5943858f737a57e701cc44'
                });

                if(autoplay) {
                    this.player.play();
                }
            },
            catalogPlay: function(index) {
                if(this.introduce.priceType == 1 && !this.introduce.buyed) {
                    this.lockMask();
                    return false;
                }

                if(this.introduce.priceType == 0) {
                    if(this.islogin) {
                        this.startStudy();
                    } else {
                        this.addStudyID();
                    }
                }

                let attachmentVoArr = this.introduce.courseCatalogVoList[0].subList[index].attachmentVo[0];
                let type = attachmentVoArr.type;

                if(type == 2) {
                    this.$router.push({
                        path: '/lessonDetailDocument',
                        query: {
                            title: attachmentVoArr.title,
                            documentId: attachmentVoArr.documentId,
                            token: attachmentVoArr.token,
                            host: attachmentVoArr.host
                        }
                    });
                } else {
                    this.videoInit(attachmentVoArr.playUrl, attachmentVoArr.thumbnailUrl, true);
                }
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
            getPayChannel: function() {
                getPayChannel({}).then(res => {
                    let {code, errorInfo, data} = res;

                    if(code != 0) {
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                    } else {
                        if(data.payChannels[0] == 1) {
                            // Alipay
                            this.actions = [];
                            this.actions.push({
                                name : "支付宝支付",
                                method : function() {
                                    that.alipayPay();
                                }
                            });
                        } else if(data.payChannels[0] == 2) {
                            // wechatpay
                            this.actions = [];
                            this.actions.push({
                                name : "微信支付",
                                method : function() {
                                    that.wechatPay();
                                }
                            });
                        }

                        this.sheetVisible = true;
                    }
                });
            },
            alipayPay: function() {
                let form =  document.createElement('form');
                form.action = '/course/pre/order/alipay';
                form.method = 'post';
                form.id = 'form';
                form.innerHTML = '<input hidden name="courseIds" value="'+ this.courseId +'" /><input hidden name="payType" value="alipay" /><input hidden name="deviceInfo" value="'+ navigator.userAgent +'" />';
                document.body.appendChild(form);

                document.getElementById('form').submit();
            },
            wechatPay: function() {
                let buyCourseParam = { courseIds: this.courseId, from_type: '1', payType: 'weixin', deviceInfo: navigator.userAgent };

                buyCourse(buyCourseParam).then(res => {
                    let {code, errorInfo, data } = res;

                    if(code != 0){
                        Toast({ message: errorInfo, position: 'center', duration: 2000 });
                    } else {
                        this.outTradeNo = data.preOrder.outTradeNo;

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

                        this.$router.push({ path: '/lessonpayfailure', query: { id: this.courseId } });
                    } else {
                        Toast({ message: '支付成功', position: 'bottom', duration: 2000 });

                        this.$router.push({ path: '/lessonpaysuccess', query: { id: this.courseId } });

                        this.introduce.buyed = true;
                    }
                });
            },
            getCourseCommentList : function() {
                if(!this.more) {
                    return false;
                }

                this.loading = true;

                let param = {
                    courseId : this.courseId,
                    pageNo : this.pageNo,
                    pageSize : this.pageSize,
                    time : this.time
                };

                courseCommentList(param).then(res => {
                    this.loading = false;

                    let {code , msg , data } = res;

                    if(code == 0) {
                        if(data.isEnd) {
                            this.more = false;
                        } else {
                            this.more = true;
                            this.pageNo = this.pageNo + 1;
                        }

                        if(data.commentVoList && data.commentVoList.length > 0) {
                            for(let i = 0; i < data.commentVoList.length; i++) {
                                this.comment.push(data.commentVoList[i]);
                            }

                            this.time = data.time;
                        }

                        if(this.comment.length === 0) {
                            this.hasCommentStatus = false;
                        }else{
                            this.hasCommentStatus = true;
                        }
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            },
            loadMore: function() {
                this.getCourseCommentList();
            }
        },
        mounted() {
            this.checkIsLogin();
            this.getCourseDetail();
            this.getCourseCommentList();
        }
    }
</script>

<style lang="scss">
    .mint-tab-container-wrap{
        overflow: hidden;

        .mint-tab-container-item{
            overflow: hidden;

            .comment-area{
                height: 100%;
                overflow: hidden;
            }

            .lesson-introduce-area,
            .catalog-area,
            .comment-area .has-comment-status,
            .relative-area{
                height: 100%;
                overflow-x: hidden;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch;
            }
        }
    }
</style>


<style lang="scss" scoped>
    .container-wrapper{
        overflow: hidden;
        background: #F5F5F8 !important;
    }
    .vedio-area{
        position: relative;
        width:100%;
        height:0;
        padding-top: 45.333%;
        background:#999;

        .cover{
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .video-wrapper{
            position: absolute;
            z-index: 3;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .lock-mask{
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            background-image: url('/static/icon_lock@2x.png');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 3rem 3rem;
            opacity: .5;
        }

        .play-mask{
            position: absolute;
            z-index: 5;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            background-image: url('/static/icon_unlock@2x.png');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 3rem 3rem;
            opacity: .5;
        }
    }

    .tab-selected-area{
        height:2.25rem;
        background: #FFFFFF;
        border-bottom: 1px solid rgba(42,44,73,0.10);
        a{
            padding: 15px 0;
            font-size: 0.75rem;
            color: #333333;
        }
        a.is-selected{
            color : #20B681;
            border-bottom:0.1rem solid #20B681;
            margin-bottom: -4px;
        }
    }

    .tab-selected-classify{
        width:100%;
        background: #F5F5F8;
        overflow-y: auto;
        position: relative;
    }

    .footer-status-info{
        height:2.45rem;
        width:100%;
        background: #ffffff;
        z-index: 100;
        .collect-btn{
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
        .operate-btn{
            button{
                width:100%;
                height:2.45rem;
                border: none;
                font-size: 0.75rem;
                color: #FFFFFF;
                border-radius:0;
            }
        }
        .hasBought{
            background: #20B681;
        }
        .notBought{
            background: #F85353;
        }
    }

    .lesson-introduce-area{
        background: #F5F5F8;
        .lesson-total-intro{
            width:100%;
            padding:0 4%;
            background: #ffffff;
            margin-bottom: 0.5rem;
            overflow:hidden;
            .title{
                margin-top: 0.75rem;
                font-size: 0.9rem;
                color: #333333;
                margin-bottom: 0.5rem;
            }
            .rank{
                margin-bottom:0.9rem;
                font-size:0;
                button{
                    width:0.5rem;
                    height:0.5rem;
                    border:none;
                    display: inline-block;
                    background: url(/static/icon_stars2@2x.png) no-repeat 0 0;
                    background-size: 0.5rem 0.5rem;
                    padding: 0;
                    &.selected{
                         background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                         background-size: 0.5rem 0.5rem;
                    }
                }
                .count-number{
                    font-size: 0.6rem;
                    color: #999999;
                    margin-right: 4%;
                    margin-left: 0.25rem;
                }
                .feature{
                    font-size: 0.6rem;
                    color: #F85353;
                    display: inline-block;
                    margin-right: 2.7%;
                    border: 1px solid #E5E5E5;
                    border-radius: 92px;
                    padding: 0.15rem 0.4rem;
                }
            }
            .lesson-price{
                font-size: 1.15rem;
                color: #F85353;
                border-top: 1px solid #E5E5E5;
                padding:0.625rem 0;
                span{
                    font-size: 0.75rem;
                    margin-right: 1.3%;
                }
            }
            .lesson-free{
                font-size: 1.15rem;
                color: #20B681;
                border-top: 1px solid #E5E5E5;
                padding:0.625rem 0;
            }
        }
        .lesson-detail-intro{
            width:100%;
            padding:0 4%;
            background: #ffffff;
            margin-bottom: 0.5rem;
            overflow:hidden;
            .lesson-adapt-person,.lesson-author,.lesson-screenshot{
                border-top:1px solid #E5E5E5;
            }
            .lesson-detail-intro-common{
                font-size: 0.75rem;
                color: #333333;
                margin: 0.75rem 0 0.25rem;
            }
            .lesson-detail-intro-content{
                font-size: 0.6rem;
                color: #999999;
                line-height: 0.9rem;
                margin-bottom: 0.75rem;
            }
            .lesson-screenshot img{
                width:48%;
                margin-right: 4%;
                margin-bottom: 0.5rem;
                &:nth-of-type(even){
                    margin-right:0;
                }
            }
        }
    }

    .catalog-area{
        margin-bottom: 0.5rem;
        background : #F5F5F8;
        .catalog-count .first-level-catalog{
            background: #F5F5F8;
            font-size: 0.7rem;
            color: #999999;
            width:100%;
            height:2.5rem;
            line-height: 2.5rem;
            text-indent: 4%;
        }
        .second-level-catalog{
            background: #ffffff;
            button{
                height:auto;
                width:100%;
                border: none;
                text-align: left;
                padding: 0.75rem 10%;
            }
        }
    }

    .container-wrapper{
        background: #ffffff;
    }

    .comment-area{
        background: #ffffff;
        height:100%;
        .no-comment-status{
            overflow: hidden;
            /*height:17rem;*/
            img{
                display: block;
                width:60%;
                margin:1.2rem auto;
            }
            p{
                font-size: 0.7rem;
                color: #999999;
                text-align: center;
            }
        }
        .comment-content-detail{
            background: #FFFFFF;
            width:100%;
            /*min-height:5rem;*/
            box-shadow: 0.75rem -1px 0 0 rgba(42,44,73,0.10);
            padding:0.75rem;
            .comment-source{
                display: -webkit-box;
                .touxiang{
                    -webkit-box-flex: 74;
                    img{
                        height:1.7rem;
                        width:1.7rem;
                        border-radius:100% 100%;
                        display: inline-block;
                    }
                    .user-info{
                        display: inline-block;
                        .user-name{
                            font-size: 0.7rem;
                            color: #666666;
                            margin-bottom: 0.25rem;
                        }
                        .release-time{
                            font-size: 0.55rem;
                            color: #CDCDCD;
                            line-height: 0.6rem;
                        }
                    }
                }
                .star-rank{
                    -webkit-box-flex: 17;
                    font-size:0;
                    button{
                        width:0.5rem;
                        height:0.5rem;
                        border:none;
                        display: inline-block;
                        background: url(/static/icon_stars2@2x.png) no-repeat 0 0;
                        background-size: 0.5rem 0.5rem;
                        padding: 0;
                        &.selected{
                             background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                             background-size: 0.5rem 0.5rem;
                        }
                    }
                }
            }
            .comment-content{
                font-size: 0.7rem;
                color: #333333;
                margin-top: 0.5rem;
                padding-left: 1.7rem;
            }
        }
    }

    .relative-area{
        overflow:hidden;
        height:100%;
        background:#ffffff;
        img{
            display: block;
            width:60%;
            margin:1.2rem auto;
        }
        p{
            font-size: 0.7rem;
            color: #999999;
            text-align: center;
        }
    }

    .mint-tab-container{
        height:100%;
    }
</style>

<style lang="scss" scoped>
.mint-tab-container-item{
    height: 100%;
}
</style>