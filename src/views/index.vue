<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v">
            <section class="search-area flex-h">
                <div class="select-grade">
                    <div @click="showSelectList">
                        <p class="choosen-grade">{{chooseGrade}}</p>
                        <img src="/static/icon_down@2x.png"/>
                    </div>
                    <ul v-if="selectList" class="select-list">
                        <li v-for="selectOption in selectOptions" v-bind:class="{ 'selected': currentPeriod == selectOption.id }" @click="changeGrade(selectOption.name,selectOption.id)">{{selectOption.name}}</li>
                    </ul>
                </div>
                <div class="search-input flex-a-i">
                    <button @click="gotoSearchPage()">
                        <img src="/static/icon_search1@2x.png"/>
                        <span>{{hotSearch}}</span>
                    </button>
                </div>
            </section>
            
            <div class="main-scroll flex-a-i">
                <section class="swiper-area">
                    <mt-swipe :auto="3000">
                        <mt-swipe-item v-for="swiper in swipers">
                            <img v-bind:src="swiper.picUrl" @click="goSwiperDetial(swiper.bizId,swiper.bizType,swiper.url)"/>
                        </mt-swipe-item>
                    </mt-swipe>
                </section>

                <nav class="nav">
                    <div v-for="navlist in navs" @click="goToSecondPage(navlist.path,navlist.event_id)">
                        <img v-bind:src="navlist.src"/>
                        <p>{{navlist.shortintro}}</p>
                    </div>
                </nav>

                <section class="hot-course">
                    <div><p class="title">热销课程</p></div>
                    <div v-for="hotCourse in hotList" class="course-detail" v-bind:class="hotCourse.className" @click="goDetailPage(hotCourse.id)">
                        <!--<img v-bind:src="hotCourse.picSrc" class="exhibition"/>-->
                        <div class="img-wrap"><img v-lazy="hotCourse.picUrl" class="exhibition"/></div>
                        <p class="course-title">{{hotCourse.name}}</p>
                        <p class="course-price" v-if="hotCourse.priceType == 0" style="font-size: 0.6rem; color: #20B681 !important;">免费</p>
                        <p class="course-price" v-if="hotCourse.priceType == 1">￥ {{hotCourse.price}}</p>
                    </div>
                </section>

                <section class="free-course">
                    <div><p class="title">免费课程</p></div>
                    <div v-for="freeCourse in freeList" class="course-detail" v-bind:class="freeCourse.className" @click="goDetailPage(freeCourse.id)">
                        <!--<img v-bind:src="freeCourse.picSrc" class="exhibition"/>-->
                        <div class="img-wrap"><img v-lazy="freeCourse.picUrl" class="exhibition"/></div>
                        <p class="course-title">{{freeCourse.name}}</p>
                        <p class="course-comment">
                            <button v-for="n in freeCourse.star" class="selected"></button>
                            <button v-for="m in (5 - freeCourse.star)"></button>
                            {{freeCourse.scoreStr}}
                        </p>
                    </div>
                </section>

                <section class="excellent-course">
                    <div><p class="title">精品课程</p></div>
                    <div v-for="excellentCourse in niceList" class="course-detail" v-bind:class="excellentCourse.className" @click="goDetailPage(excellentCourse.id)">
                        <div class="img-wrap"><img v-lazy="excellentCourse.picUrl" class="exhibition"/></div>
                        <p class="course-title">{{excellentCourse.name}}</p>
                        <p class="course-price" v-if="excellentCourse.priceType">￥ {{excellentCourse.price}}</p>
                        <p class="course-comment" v-if="!excellentCourse.priceType">
                            <button v-for="n in excellentCourse.star" class="selected"></button>
                            <button v-for="m in (5 - excellentCourse.star)"></button>
                            {{excellentCourse.scoreStr}}
                        </p>
                    </div>
                </section>
            </div>
            
            <footer class="flex-h">
                <p class="flex-a-i"><router-link to="/index"><span>首页</span></router-link></p>
                <p class="flex-a-i"><router-link to="/classify"><span>分类</span></router-link></p>
                <p class="flex-a-i"><router-link to="/my"><span>我的</span></router-link></p>
            </footer>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import { preDate , homepageDate } from '../api/api';
    export default {
        data() {
            return {
                ready : false,
                chooseGrade : "全部",
                currentPeriod : 99,
                selectList : false,
                hotSearch : '',
                selectOptions : [],
                swipers : [],
                navs : [
                    {
                        src : '/static/icon_home_hotapp_a@2x.png',
                        shortintro : '热门教育',
                        event_id : 1,
                        path : "hoteducation"
                    },
                    {
                        src : '/static/icon_home_boutique_a@2x.png',
                        shortintro : '精品课程',
                        event_id : 2,
                        path : "microlesson"
                    },
                    {
                        src : '/static/icon_home_teacher_a@2x.png',
                        shortintro : '名师说',
                        event_id : 3,
                        path : "notopen"
                    },
                    {
                        src : '/static/icon_home_weiketang_a@2x.png',
                        shortintro : '微课堂',
                        event_id : 4,
                        path : "notopen"
                    }
                ],
                hotList : [],
                freeList : [],
                niceList : []
            }
        },
        methods: {
            //获取5个阶段
            getPredate : function() {
                preDate().then(res => {
                    let { code , msg , data } = res;

                    if(code == 0) {
                        this.hotSearch = data.hotSearch;
                        this.selectOptions = data.period;

                        this.periodInit();
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            },
            periodInit: function() {
                if(!localStorage.getItem('indexPeriodId') || localStorage.getItem('indexPeriodId') == '') {
                    if(!localStorage.getItem('period') || localStorage.getItem('period') == '') {
                        this.currentPeriod = 99;
                        this.chooseGrade = '全部';

                        this.getData();
                    } else {
                        this.chooseGrade = localStorage.getItem('period');

                        for(let i = 0; i < this.selectOptions.length; i++) {
                            if(this.selectOptions[i].name == this.chooseGrade) {
                                this.currentPeriod = this.selectOptions[i].id;

                                this.getData();

                                return false;
                            }
                        }
                    }           
                } else {
                    this.currentPeriod = localStorage.getItem('indexPeriodId');
                    this.chooseGrade = localStorage.getItem('indexPeriodName');

                    this.getData();
                }
            },
            goToSecondPage : function(path,event_id) {
                this.$router.push({path : path , query : {event_id : event_id}});
            },
            goDetailPage: function(id) {
                this.$router.push({path : "lessondetail" , query : {courseId : id}});
            },
            gotoSearchPage : function() {
                this.$router.push({ path : "searchpage" , query : { periodId  : this.currentPeriod}});
            },
            showSelectList : function() {
                this.selectList = !this.selectList;
            },
            changeGrade : function(name,id) {
                this.chooseGrade = name;
                this.currentPeriod = id;
                this.selectList = false;

                this.getData();

                localStorage.setItem('indexPeriodId', this.currentPeriod);
                localStorage.setItem('indexPeriodName', this.chooseGrade);
            },
            goSwiperDetial : function(bizId,bizType,url) {
                if(bizType == 2) {
                    window.location.href = url;
                }else{
                    this.$router.push({path : "lessondetail" , query : {courseId : bizId}});
                }
            },
            //获取热门教育等数据
            getData : function() {
                let params = { periodId : this.currentPeriod, subjectId : 99 };

                homepageDate(params).then(res => {
                    let { code , msg , data } = res;

                    if(code == 0) {
                        this.swipers = data.bannerList;
                        this.hotList = data.hotList;
                        this.freeList = data.freeList;
                        this.niceList = data.niceList;
                        if(this.hotList.length % 2 != 0 ) {
                            //奇数条数据
                            this.hotList[0].className = "single-first";
                        }
                        if(this.freeList.length % 2 != 0 ) {
                            //奇数条数据
                            this.freeList[0].className = "single-first";
                        }
                        if(this.niceList.length % 2 != 0 ) {
                            //奇数条数据
                            this.niceList[0].className = "single-first";
                        }

                        this.ready = true;
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            }
        },
        mounted() {
            this.getPredate();
        }
    }
</script>

<style lang="scss" scoped>
    .app-container{
        background: #F5F5F8;
    }

    .search-area{
        height:2.2rem;
        background: #fff;
        width:100%;
        /*padding-right: 8%;*/
        border-top: 1px solid rgba(0,0,0,0.10);

        .select-grade{
            width: 3.125rem;
            height:2.2rem;
            padding-left: 0.5rem;
            line-height: 2.2rem;
            background: #fff;
            display: inline-block;

            .choosen-grade{
                font-size: 0.75rem;
                color: #333333;
                display:inline-block;
            }
            img{
                width:0.4rem;
                height:0.25rem;
                vertical-align: middle;
            }
            .select-list{
                width:5.75rem;
                height:10rem;
                position: absolute;
                z-index: 9999;
                background: #333333;
                color: #ffffff;
                font-size: 0.75rem;
                text-indent: 1.15rem;
                &:after{
                     display: inline-block;
                     content:"";
                     height:0;
                     width:0;
                     position:absolute;
                     top:-0.7rem;
                     left:1.475rem;
                     border:0.35rem solid transparent;
                     border-bottom:0.35rem solid #333333;
                 }
                li{
                    height:2rem;
                    border-top:1px solid rgba(255,255,255,0.10);
                    &.selected{
                        background: url(/static/icon_home_hook.png) no-repeat 76% center;
                        background-size: 0.625rem 0.4rem;
                    }
                }
            }
        }
        .search-input{
            margin-right: 2.375rem;

            button{
                display: block;
                width: 100%;
                height:1.5rem;
                font-size: 0.6rem;
                color: #CDCDCD;
                line-height: 0.9rem;
                margin:0.35rem auto;
                border: 1px solid #E5E5E5;
                border-radius: 0.1rem;
                background: #F5F5F8;
                /*background-size: 0.55rem 0.6rem;*/
                img{
                    width:0.55rem;
                    height:0.6rem;
                    vertical-align: text-top;
                }
            }
        }
    }

    .main-scroll{
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
    }


    .swiper-area{
        height:8.5rem;
        width:100%;
        background: #fff;

        img{
            width:100%;
            height:100%;
        }
    }

    .nav{
        width:100%;
        height:5rem;
        display: -webkit-box;
        background: #fff;
        margin-bottom:0.5rem;
        div{
            -webkit-box-flex: 1;
            text-align:center;
            a{
                display: inline-block;
                width:100%;
                height:100%;
            }
            img{
                width:2rem;
                height:2rem;
                margin-top: 0.9rem;
            }
            p{
                font-size: 0.6rem;
                color: #333333;
                line-height: 0.9rem;
                margin-top: 0.45rem;
            }
        }
    }

    .hot-course,.excellent-course,.free-course{
        margin-bottom:0.5rem;
        padding-left: .6rem;
        padding-right: .6rem;
        background: #fff;
        overflow:hidden;
        text-align:center;
        .title{
            font-size: 0.75rem;
            color: #333333;
            line-height: 1.05rem;
            text-align: center;
            position: relative;
            margin-top:1rem;
            display:inline-block;
            &:after{
                display: inline-block;
                content: "";
                height:0.6rem;
                width:0.2rem;
                /*background: #F85353;*/
                position:absolute;
                left:-0.5rem;
                top:0.25rem;
             }
        }
        .course-detail{
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            margin-top: 0.75rem;
            text-align:left;
            width: 50%;
            display:inline-block;
            padding: 0 .25rem;

            .img-wrap{
                position: relative;
                height: 0;
                width: 100%;
                padding-top: 45.456%;
                overflow: hidden;

                img{
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            .course-title{
                font-size: 0.6rem;
                color: #333333;
                line-height: 0.9rem;
                width:100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .course-price{
                font-size: 0.7rem;
                color: #F85353;
                line-height: 1rem;
            }
        }
        .single-first{
            width:100%;
        }
    }

    .hot-course .title:after{
         background: #F85353;
    }

    .excellent-course{
        .title:after{
            background: #6570B6;
        }
        button{
            width:0.5rem;
            height:0.5rem;
            border:none;
            display: inline-block;
            background: url(/static/icon_stars2@2x.png) no-repeat 0 0;
            background-size: 0.5rem 0.5rem;
            padding: 0;
            /*margin-right: 1rem;*/
            &.selected{
                 background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                 background-size: 0.5rem 0.5rem;
            }
        }
        .course-comment{
            font-size: 0.6rem;
            color: #999999;
            line-height: 0.9rem;
        }
    }

    .free-course{
        .course-comment{
            font-size: 0.6rem;
            color: #999999;
            line-height: 0.9rem;
            button{
                width:0.5rem;
                height:0.5rem;
                border:none;
                display: inline-block;
                background: url(/static/icon_stars2@2x.png) no-repeat 0 0;
                background-size: 0.5rem 0.5rem;
                padding: 0;
                /*margin-right: 1rem;*/
                &.selected{
                     background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                     background-size: 0.5rem 0.5rem;
                }
            }
        }
        .title:after{
            background: #20B681;
        }
    }

    footer{
        p:nth-of-type(1){
            background: url(/static/icon_tab_home2@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
            a{
                color: #20B681;
            }
        }
        p:nth-of-type(2){
            background: url(/static/icon_tab_classification1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
        p:nth-of-type(3){
            background: url(/static/icon_tab_mine1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
    }
</style>