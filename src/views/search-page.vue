<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v">

            <section class="search-page-header" v-if="showSearch">
                <form @submit.prevent="setStorage()">
                    <mt-search v-model="searchValue" cancel-text="取消" placeholder="搜索" @input="checkContent"></mt-search>
                </form>
            </section>
            
            <div class="flex-a-i flex-v">
                <section class="search-page-content" v-if="showHistory">
                    <div class="history-search-record">
                        <nav>
                            <span>历史记录</span>
                            <mt-button type="danger" plain @click.native="deleteHistory()">删除历史</mt-button>
                        </nav>
                        <div class="search-detail-icon">
                            <mt-button plain  v-for="history in historyRecord" @click.native="goToSearch(history)">{{history}}</mt-button>
                        </div>
                    </div>
                    <div class="hot-search-record">
                        <nav>
                            <span>热门搜索</span>
                        </nav>
                        <div class="search-detail-icon">
                            <mt-button plain v-for="hotSearch in hotSearchKeyWords" @click.native="goToSearch(hotSearch)">{{hotSearch}}</mt-button>
                        </div>
                    </div>
                </section>
                
                <div class="flex-a-i flex-v" style="position: relative;" v-if="showResult">

                    <div class="screen-area flex-h">
                        <nav class="flex-a-i">共 {{totalRelativeNum}} 门相关课程</nav>
                        <nav @click="typeSelect()" v-bind:class="{ 'selected': typeSelected }"><span>{{ currentType }}</span></nav>
                        <nav @click="priceSelect()" v-bind:class="{ 'selected': priceSelected }"><span>{{ currentPrice }}</span></nav>
                        
                        <div class="overlay" @click="closeSelectArea" v-show="showOverlay"></div>

                        <div class="type-select-area" v-show="showTypeSelect">
                            <mt-button type="default" v-for="type in typeList" @click.native="typeSelectSearch(type.code, type.name)">{{ type.name }}</mt-button>
                        </div>

                        <div class="price-select-area" v-show="showPriceSelect">
                            <mt-button type="default" v-for="price in priceList" @click.native="priceSelectSearch(price.code, price.name)">{{ price.name }}</mt-button>
                        </div>
                    </div>

                    <section class="search-page-without-result flex-a-i" v-if="!hasResult">
                        <img src="/static/icon_blank_find_a@2x.png"/>
                        <p>非常抱歉</p>
                        <p>相关课程还在制作中，先试试别的课程吧~</p>
                    </section>

                    <section class="search-page-with-result flex-a-i" v-if="hasResult" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                        <div v-for="course in courseList" class="course-detail-list" @click="goToDetail(course.id)">
                            <img v-lazy="course.picUrl"/>
                            <div class="course-detail-info">
                                <span class="course-detail-title">{{course.name}}</span>
                                <p class="course-detail-money" v-if="course.priceType">￥ {{course.price}}</p>
                                <p class="course-detail-free" v-if="!course.priceType">免费</p>
                                <p class="course-comment">
                                    <span class="course-detail-count">
                                        <button v-for="n in course.star" class="selected"></button>
                                        <button v-for="m in (5 - course.star)"></button>
                                        {{course.scoreStr}}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div v-show="loading" class="loading-more"><p>loading...</p></div>
                    </section>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { Toast, Indicator, MessageBox, InfiniteScroll } from 'mint-ui';
    import { hotSearch , nameSearch, catalogSearch } from "../api/api";
    import setTitle from "../common/js/setTitle.js"
    
    export default {
        data() {
            return {
                ready: false,
                searchValue : "",
                showSearch: true,
                showHistory: true,
                showResult: false,
                hasResult: false,
                totalRelativeNum : "",
                historyRecord : [],
                hotSearchKeyWords : [],
                showOverlay: false,
                showTypeSelect: false,
                showPriceSelect: false,
                typeSelected : false,
                priceSelected : false,
                currentType: '所有类型',
                currentPrice: '所有价格',
                courseTypeId : 99,
                priceTypeId : 99,
                courseList : [],
                typeList : [
                    {
                        "name" : "教学设计",
                        "code" : 1
                    },
                    {
                        "name" : "教学课件",
                        "code" : 2
                    },
                    {
                        "name" : "教学视频",
                        "code" : 3
                    },
                    {
                        "name" : "媒体素材",
                        "code" : 4
                    },
                    {
                        "name" : "微课程",
                        "code" : 5
                    },
                    {
                        "name" : "试题",
                        "code" : 6
                    },
                    {
                        "name" : "音频",
                        "code" : 7
                    },
                    {
                        "name" : "其他",
                        "code" : 8
                    },
                    {
                        "name" : "所有类型",
                        "code" : 99
                    },
                ],
                priceList : [
                    {
                        "name" : "收费",
                        "code" : 1
                    },{
                        "name" : "免费",
                        "code" : 0
                    },{
                        "name" : "所有价格",
                        "code" : 99
                    }
                ],
                pageNo: 1,
                pageSize: 10,
                loading: false,
                more: true
            }
        },
        methods : {
            init: function() {
                setTitle(this.$route.query.title);

                if(this.$route.query.gradeId) {
                    this.showSearch = false;
                    this.goToSearch();
                } else {
                    this.showSearch = true;
                    this.showHistory = true;
                    this.showResult = false;
                }
            },
            checkContent: function() {
            },
            setStorage : function() {
                let _temp = JSON.parse(localStorage.getItem("history"));
                if(_temp == null) {
                    _temp = this.searchValue;
                }else{
                    if(_temp.indexOf(this.searchValue) == -1) {
                        _temp = this.searchValue + "|" + _temp;
                    }
                }
                let j = 0 ;
                for(let i = 0 ; i < _temp.length; i++) {
                    if( _temp.charAt(i) == "|") {
                        j++;
                        if(j > 4) {
                            _temp = _temp.substring(0,i);
                            break;
                        }
                    }
                }
                localStorage.setItem("history",JSON.stringify(_temp));
                this.goToSearch();

                return false;
            },
            deleteHistory : function() {
                localStorage.removeItem("history");
                this.historyRecord = "";
            },
            goToSearch : function(val) {
                this.searchValue = val || this.searchValue;

                if(!this.more) {
                    return false;
                }

                this.loading = true;

                if(this.$route.query.gradeId) {
                    let params = {
                        periodId : this.$route.query.periodId,
                        gradeId : this.$route.query.gradeId,
                        courseTypeId : this.courseTypeId,
                        priceTypeId : this.priceTypeId,
                        pageNo : this.pageNo,
                        pageSize: this.pageSize
                    };

                    Indicator.open({ text: '', spinnerType: 'fading-circle' });

                    catalogSearch(params).then(res => {
                        Indicator.close();
                        this.loading = false;
                        this.showTypeSelect = false;
                        this.showPriceSelect = false;
                        this.showOverlay = false;

                        let {code , msg , data} = res;

                        if(code == 0) {
                            this.showHistory = false;
                            this.showResult = true;

                            this.totalRelativeNum = data.total;

                            if(data.isEnd) {
                                this.more = false;
                            } else {
                                this.more = true;
                                this.pageNo = this.pageNo + 1;
                            }

                            if(data.courseVoList.length > 0) {
                                for(let i = 0; i < data.courseVoList.length; i++) {
                                    this.courseList.push(data.courseVoList[i]);
                                }
                            }

                            if(this.courseList.length === 0) {
                                this.hasResult = false;
                            } else {
                                this.hasResult = true;
                            }
                        }else{
                            Toast({ message: msg, position: 'bottom', duration: 2000 });
                        }
                    });
                } else {
                    let params = {
                        periodId : this.$route.query.periodId,
                        courseTypeId : this.courseTypeId,
                        priceTypeId : this.priceTypeId,
                        name : this.searchValue,
                        pageNo : this.pageNo,
                        pageSize: this.pageSize
                    };

                    Indicator.open({ text: '', spinnerType: 'fading-circle' });

                    nameSearch(params).then(res => {
                        Indicator.close();
                        this.loading = false;
                        this.showTypeSelect = false;
                        this.showPriceSelect = false;
                        this.showOverlay = false;

                        let {code , msg , data} = res;

                        if(code == 0) {
                            this.showHistory = false;
                            this.showResult = true;

                            this.totalRelativeNum = data.total;

                            if(data.isEnd) {
                                this.more = false;
                            } else {
                                this.more = true;
                                this.pageNo = this.pageNo + 1;
                            }

                            if(!data.courseVoList || data.courseVoList.length === 0) {
                                return false;
                            }

                            for(let i = 0; i < data.courseVoList.length; i++) {
                                this.courseList.push(data.courseVoList[i]);
                            }

                            if(this.courseList.length === 0) {
                                this.hasResult = false;
                            } else {
                                this.hasResult = true;
                            }
                        }else{
                            Toast({ message: msg, position: 'bottom', duration: 2000 });
                        }
                    });
                }
            },
            loadMore: function() {
                this.goToSearch();
            },
            typeSelect : function() {
                this.showPriceSelect = false;

                if(this.showOverlay) {
                    this.showOverlay = false;
                    this.showTypeSelect = false;
                    this.typeSelected = false;
                } else {
                    this.showOverlay = true;
                    this.showTypeSelect = true;
                    this.typeSelected = true;
                }
            },
            priceSelect : function() {
                this.showTypeSelect = false;
                
                if(this.showOverlay) {
                    this.showOverlay = false;
                    this.showPriceSelect = false;
                    this.priceSelected = false;
                } else {
                    this.showOverlay = true;
                    this.showPriceSelect = true;
                    this.priceSelected = true;
                }
            },
            typeSelectSearch : function(value, label) {
                this.courseTypeId = value;
                this.currentType = label;
                this.pageNo = 1;
                this.more = true;
                this.courseList = [];
                this.goToSearch();
            },
            priceSelectSearch : function(value, label) {
                this.priceTypeId = value;
                this.currentPrice = label;
                this.pageNo = 1;
                this.more = true;
                this.courseList = [];
                this.goToSearch();
            },
            closeSelectArea : function() {
                this.showOverlay = false;
                this.showTypeSelect = false;
                this.showPriceSelect = false;
            },
            goToDetail : function(_id) {
                this.$router.push({path : "lessondetail" , query : {courseId : _id}});
            },
            getHistorySearch : function() {
                let _historyRecord = JSON.parse(localStorage.getItem("history"));
                if(_historyRecord != null) {
                    let _tempArr = _historyRecord.split("|");
                    this.historyRecord = _tempArr;
                }
            },
            getHotSearch : function() {
                hotSearch({}).then(res => {
                    let {code , msg , data} = res;

                    if(code == 0) {
                        this.searchValue = data.hotSearch[0];
                        this.hotSearchKeyWords = data.hotSearch;
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }

                    this.ready = true;
                });
            }
        },
        mounted() {
            this.init();
            this.getHotSearch();
            this.getHistorySearch();
        }
    }
</script>

<style lang="scss" scoped>
    .container-wrapper{
        overflow: hidden !important;
    }

    .search-page-header{
        background: #FAFBFD;
        border-bottom: 1px solid rgba(0,0,0,0.10);
    }

    .search-page-content{
        background: #ffffff;
        padding: 1rem .75rem 0;
        .history-search-record,.hot-search-record{
            margin-bottom:1.5rem;
            nav{
                margin-bottom:0.5rem;
                span{
                    font-size: 0.7rem;
                    color: #666666;
                    vertical-align: super;
                }
                button{
                    display: inline-block;
                    font-size: 0.6rem;
                    color: #F85353;
                    border: none;
                    width:25%;
                    float: right;
                    height:1rem;
                }
            }
            .search-detail-icon{
                button{
                    display: inline-block;
                    border: 1px solid #E5E5E5;
                    border-radius: 0.1rem;
                    font-size: 0.7rem;
                    color: #999999;
                    width:auto;
                    height:auto;
                    padding: 0.25rem 0.75rem;
                    margin-right: 2.7%;
                    margin-bottom: 0.5rem;
                }
            }
        }
    }

    .screen-area{
        width:100%;
        height:2rem;
        background: #FFFFFF;
        border-bottom: 1px solid rgba(0,0,0,0.10);

        nav{
            font-size: 0.6rem;
            line-height:2rem;

            &:nth-of-type(1){
                padding-left: .75rem;
                color: #999999;
            }

            &:nth-of-type(2), &:nth-of-type(3){
                width: 4.75rem;
                color: #666666;
                position : relative;
                text-align: center;
                font-size: 0;

                span{
                    display: inline-block;
                    white-space: nowrap;
                    font-size: 0.6rem;
                    padding-right: 0.825rem;
                    background: url("/static/icon_up@2x.png") no-repeat right center;
                    background-size: 0.4rem 0.25rem;
                }

                &:after{
                    display: inline-block;
                    position: absolute;
                    content: "";
                    width:0.05rem;
                    height:1rem;
                    background: #E5E5E5;
                    top:0.5rem;
                    left:0;
                }
            }
            &.selected{
                color: #20B681;

                span{
                    background: url("/static/icon_down@2x.png") no-repeat right center;
                    background-size: 0.4rem 0.25rem;
                }
             }
        }
    }

    .search-page-without-result{
        height:100%;
        background: #ffffff;
        img{
            display: block;
            width:59%;
            margin:0 auto 4.3%;
        }
        p{
            text-align: center;
            &:nth-of-type(1){
                 font-size: 0.75rem;
                 color: #666666;
                 line-height: 1.025rem;
                margin-bottom: 1%;
             }
             &:nth-of-type(2){
                  font-size: 0.7rem;
                  color: #999999;
                  line-height: 1rem;
              }
        }
    }

    .search-page-with-result{
        background: #ffffff;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;


        /*.screen-area{
            width:100%;
            height:2rem;
            background: #FFFFFF;
            border-bottom: 1px solid rgba(0,0,0,0.10);
            display: -webkit-box;
            z-index: 100;
            position:absolute;
            left:0;
            right:0;
            top:2.2rem;
            nav{
                font-size: 0.6rem;
                line-height:2rem;
                text-indent:4%;
                &:nth-of-type(1){
                     -webkit-box-flex: 2;
                     color: #999999;
                 }
                &:nth-of-type(2), &:nth-of-type(3){
                       -webkit-box-flex: 1;
                       color: #666666;
                       background: url("/static/icon_up@2x.png") no-repeat 84% center;
                       background-size: 0.4rem 0.25rem;
                       position : relative;
                       &:after{
                             display: inline-block;
                             position: absolute;
                             content: "";
                             width:0.05rem;
                             height:1rem;
                             background: #E5E5E5;
                             top:0.5rem;
                             left:0;
                         }
                        }
                        &.selected{
                             color: #20B681;
                             background: url("/static/icon_down@2x.png") no-repeat 84% center;
                             background-size: 0.4rem 0.25rem;
                         }
                }
        }*/
    }

    .course-detail-list{
        background: #FFFFFF;
        box-shadow: 0.75rem -1px 0 0 rgba(0,0,0,0.10);
        width:100%;
        height:5.3rem;
        padding: 0.9rem .75rem;
        &:nth-of-type(1){
            box-shadow: none;
        }
        img{
            display: inline-block;
            width:35%;
            min-height:3.5rem;
            max-height: 4rem;
            vertical-align: top;
        }
        .course-detail-info{
            display: inline-block;
            width:55%;
            margin-left:0.6rem;
            span{
                display: block;
            }
            .course-detail-title{
                font-size: 0.7rem;
                color: #333333;
                line-height: 1rem;
                /*width:100px;*/
                /*overflow : hidden;*/
                /*text-overflow: ellipsis;*/
                /*display: -webkit-box;*/
                /*-webkit-line-clamp: 2;*/
                /*-webkit-box-orient: vertical;*/
            }
            .course-detail-count{
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
                    &.selected{
                         background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                         background-size: 0.5rem 0.5rem;
                    }
                }
            }
            .course-detail-money{
                font-size: 0.7rem;
                color: #F85353;
            }
            .course-detail-free{
                font-size: 0.7rem;
                color: #20B681;
            }
        }

    }

    .type-select-area{
        background: #FFFFFF;
        position:absolute;
        z-index:100;
        /*margin-top:2rem;*/
        left:0;
        right:0;
        top:2rem;
        width:100%;
        border-top:1px solid rgba(0,0,0,0.1);
        button{
            display: inline-block;
            width:49%;
            height:2.25rem;
            border:none;
            background: transparent;
            box-shadow: none;
            text-align: left;
            text-indent: 35%;
        }
    }

    .price-select-area{
        width:100%;
        background: #FFFFFF;
        position:absolute;
        z-index:100;
        top:2rem;
        left:0;
        right:0;
        /*margin-top:2rem;*/
        border-top:1px solid rgba(0,0,0,0.1);
        button{
            display: block;
            width:100%;
            height:2.25rem;
            border:none;
            background: transparent;
            box-shadow: none;
        }
    }
</style>

<style lang="scss">
    .mint-search-list{
        display: none;
    }
</style>