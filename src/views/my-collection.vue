<template>

    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper my-collection">
            <section class="has-study-status" v-if="hasStudyStatus" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                <mt-cell-swipe
                    title=""
                    :right="[
                        {
                          content: '删除',
                          style: {
                              background: '#F85353',
                              color : '#ffffff',
                              fontSize : '0.75rem',
                              lineHeight : '5.3rem',
                              width : '3.7rem',
                              textAlign : 'center'
                          },
                          handler: () => rightSlideDelete(course.id, index)
                        }
                    ]"
                    v-for="(course, index) in courseList">

                    <div class="course-detail-list" @click="goToDetail(course.id)">
                        <img v-lazy="course.picUrl"/>
                        <div class="course-detail-info">
                            <span class="course-detail-title">{{course.name}}</span>
                            <span class="course-detail-count">
                                <button v-for="n in course.star" class="selected"></button>
                                <button v-for="m in (5 - course.star)"></button>
                                {{course.scoreStr}}
                            </span>
                            <div class="course-detail-bottom">
                                <span class="course-detail-money" v-if="course.priceType">￥{{course.price}}</span>
                                <span class="course-detail-free" v-if="!course.priceType">免费</span>
                                <span class="release-time">{{course.releaseTime}}</span>
                            </div>
                        </div>
                    </div>
                </mt-cell-swipe>
            </section>

            <section class="no-study-status" v-if="!hasStudyStatus">
                <img src="/static/icon_blank_collection_a@2x.png"/>
                <p>这里空荡荡的，赶快去首页挖掘一下吧!</p>
            </section>

        </div>
    </div>

</template>

<script>
    import { Toast, MessageBox, Indicator, InfiniteScroll } from 'mint-ui';
    import { myCollection , cancelPersonalCollection } from "../api/api";
    export default {
        data() {
            return {
                ready: false,
                hasStudyStatus : true,
                courseList : [],
                pageNo: 1,
                pageSize: 2,
                loading: false,
                more: true
            }
        },
        methods : {
            rightSlideDelete : function(_id, index) {
                let param = { course_id : _id };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                cancelPersonalCollection(param).then(res => {
                    Indicator.close();

                    let { code , msg , data } = res;

                    if(code == 0) {
                        this.courseList.splice(index, 1);
                        Toast({ message: '已成功删除', position: 'center', duration: 2000 });
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                })
            },
            goToDetail : function(_id) {
                this.$router.push({ path : "lessondetail" , query : { courseId : _id } });
            },
            getMyCollection : function() {
                if(!this.more) {
                    return false;
                }

                this.loading = true;

                let params = { pageNo: this.pageNo, pageSize: this.pageSize };

                myCollection(params).then(res => {
                    this.loading = false;

                    let { code , msg , data } = res;

                    if(code == 0) {
                        if(data.isEnd) {
                            this.more = false;
                        } else {
                            this.more = true;
                            this.pageNo = this.pageNo + 1;
                        }

                        if(data.courses && data.courses.length > 0) {
                            for(let i = 0; i < data.courses.length; i++) {
                                this.courseList.push(data.courses[i]);
                            }
                        }
                            
                        if(this.courseList.length === 0) {
                            this.hasStudyStatus = false;
                        }else{
                            this.hasStudyStatus = true;
                        }
                    }else{
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    }
                    this.ready = true;
                })
            },
            loadMore: function() {
                this.getMyCollection();
            }
        },
        mounted() {
            this.getMyCollection();
        }
    }
</script>

<style lang="scss">
    .has-study-status{
        .mint-cell-swipe{
            /*box-shadow: 0.75rem -1px 0 0 rgba(0,0,0,0.10);*/
            box-shadow: 0 -1px 0 0 rgba(0,0,0,0.10);
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

    .my-collection{
        background: #F5F5F8;
    }

    .has-study-status{
        .course-detail-list{
            background: #ffffff;
            width:100%;
            height:5.3rem;
            padding: 0.9rem .75rem;
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
                .course-detail-bottom{
                    position:relative;
                    span{
                        display: inline-block;
                    }
                    .course-detail-money{
                        font-size: 0.7rem;
                        color: #F85353;
                        vertical-align: sub;
                    }
                    .course-detail-free{
                        font-size: 0.7rem;
                        color: #20B681;
                        vertical-align: sub;
                    }
                    .release-time{
                        font-size: 0.6rem;
                        color: #999999;
                        position: absolute;
                        right:0;
                        margin-top: 0.3rem;
                    }
                }
            }

        }
    }

        .no-study-status{
            height:100%;
            background: #ffffff;
            overflow:hidden;
            img{
                display: block;
                width:60%;
                margin:3.85rem auto 1.45rem;
            }
            p{
                font-size: 0.7rem;
                color: #999999;
                text-align: center;
            }
        }
</style>
