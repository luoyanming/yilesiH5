<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">

            <section class="search-page-header">
                <div class="classify-search-btn">
                    <button @click="gotoSearchPage()">搜索课程</button>
                </div>
                <div class="screen-area">
                    <nav>共{{totalRelativeNum}}门相关课程</nav>
                    <nav>所有类型</nav>
                    <nav class="selected">所有价格</nav>
                </div>
                <div class="type-select-area" v-if="typeSelectShow">
                    <mt-button type="default">教学设计</mt-button>
                    <mt-button type="default">教学课件</mt-button>
                    <mt-button type="default">教学视频</mt-button>
                    <mt-button type="default">教学素材</mt-button>
                    <mt-button type="default">微课程</mt-button>
                    <mt-button type="default">试题</mt-button>
                    <mt-button type="default">音频</mt-button>
                    <mt-button type="default">其他</mt-button>
                    <mt-button type="default">所有类型</mt-button>
                </div>
                <div class="price-select-area" v-if="priceSelectShow">
                    <mt-button type="default">收费</mt-button>
                    <mt-button type="default">免费</mt-button>
                    <mt-button type="default">所有价格</mt-button>
                </div>
            </section>

            <section class="search-page-content">
                <section class="search-has-result" v-if="hasResultPage">
                    <div v-for="course in courseList" class="course-detail-list">
                        <img v-bind:src="course.imgSrc"/>
                        <div class="course-detail-info">
                            <span class="course-detail-title">{{course.title}}</span>
                            <span class="course-detail-count">
                                <mt-button plain></mt-button>
                                <mt-button plain></mt-button>
                                <mt-button plain></mt-button>
                                <mt-button plain></mt-button>
                                <mt-button plain></mt-button>
                                {{course.count}}
                            </span>
                            <span class="course-detail-money" v-if="!course.ifCharge">￥{{course.price}}</span>
                            <span class="course-detail-free" v-if="course.ifCharge">免费</span>
                        </div>
                    </div>
                </section>

                <section class="search-without-result" v-if="noResultPage">
                    <img src="/static/icon_blank_find_a@2x.png"/>
                    <p>非常抱歉</p>
                    <p>相关课程还在制作中，先试试别的课程吧~</p>
                </section>
            </section>

        </div>

        <div class="overlay" v-if="seenOverlay"></div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                ready: true,
                searchValue : "",
                totalRelativeNum : "50",
                typeSelectShow : false,
                priceSelectShow : false,
                hasResultPage : true,
                noResultPage : false,
                seenOverlay : false,
                courseList : [{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '',
                    ifCharge : true
                },{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '998.00',
                    ifCharge : false
                },{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '',
                    ifCharge : true
                },{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '998.00',
                    ifCharge : false
                },{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '998.00',
                    ifCharge : false
                },{
                    imgSrc : "/static/Artboard.png",
                    title : "奥术大师大所大所大所大所大所大所大所大所大所",
                    count : "4.8",
                    price : '998.00',
                    ifCharge : false
                }]
            }
        },
        methods : {
            gotoSearchPage : function() {
                this.$router.push("searchpage");
            }
        }
    }
</script>

<style lang="scss" scoped>
    .search-page-header{
        position: absolute;
        top:0;
        left:0;
        right:0;
        z-index:100;
        .screen-area{
            width:100%;
            height:2rem;
            background: #FFFFFF;
            box-shadow: 0 1px 0 0 rgba(0,0,0,0.10);
            display: -webkit-box;
            nav{
                font-size: 0.6rem;
                line-height:2rem;
                /*text-align:center;*/
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
        }
        .type-select-area{
            background: #FFFFFF;
            /*margin-top:0.025rem;*/
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
            background: #FFFFFF;
            /*margin-top:0.025rem;*/
            button{
                display: block;
                width:100%;
                height:2.25rem;
                border:none;
                background: transparent;
                box-shadow: none;
            }
        }
    }

    .course-detail-list{
        background: #FFFFFF;
        box-shadow: 0.75rem -1px 0 0 rgba(0,0,0,0.10);
        width:100%;
        height:5.3rem;
        padding: 0.9rem 4%;
        /*margin-bottom:0.025rem;*/
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

    .search-page-content{
        margin-top: 4.2rem;
        min-height:calc(100% - 4.2rem);
        background: #ffffff;
        overflow:auto;
        .search-without-result{
            img{
                display: block;
                width:59%;
                height:auto;
                margin:0 auto 4.3%;
            }
            p{
                text-align: center;
                &:nth-of-type(1){
                     font-size: 0.75rem;
                     color: #666666;
                     margin-bottom: 0.9rem;
                }
                &:nth-of-type(2){
                     font-size: 0.7rem;
                     color: #999999;
                 }
            }
        }
    }

</style>