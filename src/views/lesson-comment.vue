<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">

            <div class="star-comment">

                <section class="star-comment-area">
                    <div><mt-button plain v-for="star in stars" v-bind:class="star.selected" @click.native="changeRank(star.index)"></mt-button></div>
                    <p>{{commentContent}}</p>
                </section>

                <textarea placeholder="请输入100字以内的评论" v-model="commentAreaContent" class="comment-textarea"></textarea>

                <section class="send-comment-area">
                    <mt-button type="primary" v-bind:class="buttonSkin" @click.native="sendComment">发送</mt-button>
                </section>

            </div>

        </div>

    </div>
</template>

<script>
    import { MessageBox , Toast } from 'mint-ui';
    import { releaseComment } from '../api/api';
    export default{
        data() {
            return {
                ready : true,
                commentAreaContent : "",
                commentStart : 4,
                stars : [{
                    index : 0,
                    selected : "selected",
                    commentContent : "极差"
                },{
                    index : 1,
                    selected : "selected",
                    commentContent : "较差"
                },{
                    index : 2,
                    selected : "selected",
                    commentContent : "一般"
                },{
                    index : 3,
                    selected : "selected",
                    commentContent : "推荐"
                },{
                    index : 4,
                    selected : "",
                    commentContent : "极佳"
                }],
                commentContent : "推荐"
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
            changeRank : function(num) {
                for(let i = num + 1; i < 5 ; i++) {
                    this.stars[i].selected = "";
                }
                for(let j = 0; j < num + 1 ; j++) {
                    this.stars[j].selected = "selected";
                }
                this.commentContent = this.stars[num].commentContent;
                this.commentStart = this.stars[num].index + 1;
            },
            sendComment : function() {
                let _length = this.commentAreaContent.length;
                if(_length > 100) {
                    MessageBox('', '字数不能超过100个哦');
                    return false;
                }
                let params = {
                    courseId : this.$route.query.courseId,
                    content : this.commentAreaContent,
                    score : this.commentStart
                };
                releaseComment(params).then(res => {
                    let { code , msg , data } = res;
                    if(code == 0) {
                        this.$router.push({path : "/lessondetail" ,  query : { courseId: this.$route.query.courseId , selectedBtn: "comment"}});
                    }else{
                        Toast({
                            message: msg,
                            position: 'bottom',
                            duration: 2000
                        });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .star-comment{
        height:100%;
        background: #ffffff;
        .star-comment-area{
            width:86.7%;
            margin:0 auto;
            padding-top: 1.25rem;
            border-bottom:1px solid #E5E5E5;
            div{
                text-align:center;
                margin-bottom:0.75rem;
                button{
                    width:1rem;
                    height:1rem;
                    border:none;
                    display: inline-block;
                    background: url(/static/icon_stars2@2x.png) no-repeat 0 0;
                    margin-right: 1rem;
                    &.selected{
                         background: url(/static/icon_stars1@2x.png) no-repeat 0 0;
                    }
                }
            }
            p{
                font-size: 0.75rem;
                color: #666666;
                text-align: center;
                margin-bottom: 1rem;
            }
        }
        .comment-textarea{
            display: block;
            width:86.7%;
            border:none;
            margin:1rem auto;
            font-size: 0.75rem;
            color: #333333;
            line-height: 1.025rem;
            height:19rem;
            background: #ffffff;
            resize: none;
        }
    }

    .send-comment-area{
        height:2.4rem;
        width:100%;
        position: absolute;
        bottom: 0;
        left:0;
        right:0;
        background: #FFFFFF;
        border-top:1px solid #E5E5E5;
        button{
            display: inline-block;
            width:3.625rem;
            height: 1.7rem;
            line-height: 1.7rem;
            text-align: center;
            /*background: #20B681 !important;*/
            border-radius: 2px;
            position: absolute;
            right:0.65rem;
            top:0.325rem;
        }
    }
</style>