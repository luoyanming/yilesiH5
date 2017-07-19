<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper flex-v my">
            <div class="flex-a-i">
                <div class="info" v-bind:class="buttonSkin">
                    <div class="avatar-pic">
                        <img :src="avatarUrl ? avatarUrl : '/static/icon_user_default@2x.png'">
                    </div>
                    <p class="nickname">{{ name }}</p>
                    <mt-button type="primary" @click.native="linkTo('myInfo')" class="btn-edit"></mt-button>
                </div>

                <div class="flex-h my-nav">
                    <p class="flex-a-i"><mt-button type="primary" @click.native="" class="btn-nav btn-learn" @click.native="linkTo('mystudy')">我的学习</mt-button></p>
                    <p class="flex-a-i"><mt-button type="primary" @click.native="" class="btn-nav btn-collect" @click.native="linkTo('mycollection')">我的收藏</mt-button></p>
                </div>

                <div class="block-content">
                    <mt-cell title="热门教育" is-link class="icon-hoteducation" @click.native="linkTo('hoteducationstatus')"></mt-cell>
                </div>

                <div class="block-content">
                    <mt-cell title="个人信息" is-link class="icon-myinfo" @click.native="linkTo('myinfo')"></mt-cell>
                    <mt-cell title="关于我们" is-link class="icon-aboutus" @click.native="linkTo('about')" v-if="!source"></mt-cell>
                    <mt-cell title="用户协议" is-link class="icon-agreement" @click.native="linkTo('useragreement')" v-if="!source"></mt-cell>
                </div>
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
    import { Toast, Indicator } from 'mint-ui';
    import { memberIndex } from '../api/api';

    export default {
        data() {
            return {
                ready: false,
                avatarUrl: '',
                name: '',
                source: localStorage.getItem('source')
            };
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
        methods: {
            getMember: function() {
                memberIndex({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.getMember();
                    } else {
                        this.avatarUrl = data.memberIndexVo.avatar;
                        this.name = data.memberIndexVo.name;

                        this.ready = true;
                    }
                });
            },
            linkTo: function(url) {
                this.$router.push({ path: '/' + url });
            }
        },
        mounted() {
            this.getMember();
        }
    }
</script>

<style lang="scss" scoped>
    .container-wrapper{
        background: #F5F5F8;
    }

    .info{
        position: relative;
        height: 5.3rem;
        background: #20B681;
        font-size: 0;
        overflow: hidden;

        .avatar-pic{
            position: absolute;
            z-index: 3;
            top: 1.05rem;
            left: 1.25rem;
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 50%;

            img{
                display: block;
                width: 3.5rem;
                height: 3.5rem;
                border-radius: 50%;
            }
        }

        .nickname{
            display: inline-block;
            margin: 2.25rem 0 0 5.65rem;
            font-size: 0.75rem;
            color: #FFF;
            line-height: 1.05rem;
        }

        .btn-edit{
            position: absolute;
            z-index: 3;
            top: 2.25rem;
            right: 0.75rem;
            width: 1.1rem;
            height: 1.1rem;
            background: url('/static/icon_mine_edit@2x.png') no-repeat center center !important;
            background-size: 100% 100% !important;
        }
    }

    .my-nav{
        .flex-a-i{
            position: relative;
            background-color: #FFF;

            .btn-nav{
                width: auto;
                height: 4.5rem;
                padding: 0 0 0 2.65rem;
                color: #333;
                font-size: 0.7rem;
                line-height: 4.5rem;
                background-color: #FFF !important;
                border-radius: 0;

                &.btn-learn{
                    background: url(/static/icon_mine_study@2x.png) no-repeat left center;
                    background-size: 1.85rem auto;
                }

                &.btn-collect{
                    background: url(/static/icon_mine_collection@2x.png) no-repeat left center;
                    background-size: 1.85rem auto;
                }
            }

            &:last-of-type{
                &:before{
                    content: "";
                    position: absolute;
                    z-index: 3;
                    top: 1.25rem;
                    left: 0;
                    height: 2rem;
                    width: 1px;
                    background-color: #E5E5E5;
                    
                }
            }
        }
    }

    footer{
        p:nth-of-type(1){
            background: url(/static/icon_tab_home1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
        p:nth-of-type(2){
            background: url(/static/icon_tab_classification1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
        p:nth-of-type(3){
            background: url(/static/icon_tab_mine2@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
            
            a{
                color: #20B681;
            }
        }
    }
</style>

<style lang="scss">
    .my{
        .block-content{
            margin-top: 0.5rem;
            background: #FFF;

            .mint-cell{
                min-height: 2.5rem;
                box-shadow: 3rem -1px 0 0 rgba(0,0,0,0.10);

                .mint-cell-left{

                }

                .mint-cell-wrapper{
                    padding-left: 3rem;
                    background: none;
                }

                &:first-of-type{
                    box-shadow: none;
                }

                &.icon-hoteducation{
                    .mint-cell-wrapper{
                        background: url(/static/icon_mine_hot_a@2x.png) no-repeat .8rem center;
                        background-size: 1.35rem auto;
                    }
                }
                &.icon-myinfo{
                    .mint-cell-wrapper{
                        background: url(/static/icon_mine_information@2x.png) no-repeat .8rem center;
                        background-size: 1.35rem auto;
                    }
                }
                &.icon-aboutus{
                    .mint-cell-wrapper{
                        background: url(/static/icon_mine_aboutus@2x.png) no-repeat .8rem center;
                        background-size: 1.35rem auto;
                    }
                }
                &.icon-agreement{
                    .mint-cell-wrapper{
                        background: url(/static/icon_mine_agreement@2x.png) no-repeat .8rem center;
                        background-size: 1.35rem auto;
                    }
                }
            }
        }
    }
</style>