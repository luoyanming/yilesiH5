<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper my-info">
            <form class="form-upload">
            <div class="block-content">
                <mt-cell title="" is-link class="avatar-cell">
                    <div class="avatar-pic">
                        <img :src="avatarUrl ? avatarUrl : '/static/icon_user_default@2x.png'">
                    </div>
                </mt-cell>
                <input type="file" name="file" accept="image/*" class="avatar-file" @change="avatarUpload">
            </div>
            </form>

            <div class="block-content">
                <mt-cell title="手机账号绑定" is-link @click.native="linkTo('bindmobilesucc')" v-if="mobile != ''">{{ mobile }}</mt-cell>
                <mt-cell title="手机账号绑定" is-link @click.native="linkTo('bindmobile')" v-if="mobile == ''" class="notset">未绑定</mt-cell>
                <mt-cell title="昵称" is-link v-if="name != ''" @click.native="linkTo('nickname')">{{ name }}</mt-cell>
                <mt-cell title="昵称" is-link v-if="name == ''" @click.native="linkTo('nickname')" class="notset">未填写</mt-cell>
            </div>

            <div class="block-content">
                <mt-cell title="学段" is-link v-if="period != ''" @click.native="linkTo('period')">{{ period }}</mt-cell>
                <mt-cell title="学段" is-link v-if="period == ''" @click.native="linkTo('period')" class="notset">未设置</mt-cell>
                <mt-cell title="城市" is-link v-if="city != ''" @click.native="linkTo('city', 'edit')">{{ city }}</mt-cell>
                <mt-cell title="城市" is-link v-if="city == ''" @click.native="linkTo('city')" class="notset">未设置</mt-cell>
            </div>

            <div class="block-content">
                <div class="btn-logout" @click="logout">退出登录</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator, MessageBox } from 'mint-ui';
    import { memberInfoIndex, doLogout } from '../api/api';

    export default {
        data() {
            return {
                ready: false,
                avatarUrl: '',
                name: '',
                city: '',
                mobile: '',
                period: ''
            };
        },
        methods: {
            getMemberInfo: function() {
                memberInfoIndex({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.getMemberInfo();
                    } else {
                        this.avatarUrl = data.memberInfoIndexVo.avatar;
                        this.name = data.memberInfoIndexVo.name;
                        this.city = data.memberInfoIndexVo.city;
                        this.mobile = data.memberInfoIndexVo.mobile;
                        this.period = data.memberInfoIndexVo.period;

                        this.ready = true;
                    }
                });
            },
            logout: function() {
                MessageBox.confirm('确定退出登录?').then(action => {
                    Indicator.open({ text: '正在提交...', spinnerType: 'fading-circle' });

                    doLogout({}).then(res => {
                        Indicator.close();

                        let { msg, code, data } = res;

                        if(code !== 0) {
                            Toast({ message: msg, position: 'bottom', duration: 2000 });
                        } else {
                            Toast({ message: '退出登录成功！', position: 'bottom', duration: 2000 });

                            localStorage.removeItem('nickname');
                            localStorage.removeItem('avatar');
                            localStorage.removeItem('mobile');
                            localStorage.removeItem('period');
                            localStorage.removeItem('period_1');
                            localStorage.removeItem('indexPeriodId');
                            localStorage.removeItem('indexPeriodName');
                            localStorage.removeItem('city');

                            this.$router.push({ path: '/index' });
                        }
                    });
                });
            },
            linkTo: function(url, type) {
                if(type) {
                    this.$router.push({ path: '/' + url, query: { type: type } });
                } else {
                    this.$router.push({ path: '/' + url });
                }
            },
            avatarUpload: function() {
                let formData = new FormData(jQuery('.form-upload')[0]);
                let that = this;

                Indicator.open({ text: '正在上传...', spinnerType: 'fading-circle' });

                jQuery.ajax({
                    url: '/member/update/avatar',
                    // url: '/privateapi/member/update/avatar',
                    type: 'POST',
                    data: formData,
                    dataType: 'JSON',
                    async: true,
                    cache: false,
                    contentType: false,
                    processData: false,
                    xhr: function() {
                        let xhr = jQuery.ajaxSettings.xhr();

                        xhr.upload.onloadstart = function(){
                            
                        };

                        xhr.upload.onprogress = that.setProgress;

                        return xhr;
                    },  
                    success: function (data) {
                        Indicator.close();

                        if(data.code == 0) {
                            Toast({ message: '上传成功！', position: 'bottom', duration: 2000 });

                            that.avatarUrl = data.data.url;
                        } else {
                            Toast({ message: '上传失败！', position: 'bottom', duration: 2000 });
                            location.href = location.href;
                        }
                    },
                    error: function () {
                        Indicator.close();
                        Toast({ message: '上传失败！', position: 'bottom', duration: 2000 });
                        location.href = location.href;
                    }
                });
            },
            setProgress: function(evt) {
                let loaded = evt.loaded,
                    total = evt.total,
                    per = Math.floor(100*loaded/total);

                // Indicator.close();
                // Indicator.open({ text: '正在上传： '+ per +'%', spinnerType: 'fading-circle' });
            }
        },
        mounted() {
            this.getMemberInfo();
        }
    }
</script>

<style lang="scss" scoped>
    .container-wrapper{
        background: #F5F5F8;
    }

    .btn-logout{
        font-size: 0.75rem;
        text-align: center;
        line-height: 2.5rem;
        color: #F85353;
    }
</style>

<style lang="scss">
    .my-info{
        .block-content{
            position: relative;
            margin-top: 0.5rem;
            background: #FFF;
            overflow: hidden;

            &:first-of-type{
                margin-top: 0;
            }

            .avatar-file{
                position: absolute;
                z-index: 5;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }

            .mint-cell{
                min-height: 2.5rem;
                box-shadow: .75rem -1px 0 0 rgba(0,0,0,0.10);

                .mint-cell-wrapper{
                    padding-left: .75rem;
                    background: none;

                    .mint-cell-value{
                        font-size: .75rem;
                        color: #999;
                    }
                }

                &.notset{
                    .mint-cell-wrapper{
                        .mint-cell-value{
                            color: #CDCDCD;
                        }
                    }
                }

                &:first-of-type{
                    box-shadow: none;
                }

                &.avatar-cell{
                    min-height: 5rem;
                    
                    .mint-cell-wrapper{
                        .avatar-pic{
                            position: absolute;
                            z-index: 3;
                            top: .75rem;
                            left: 1rem;
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
                    }
                }
            }
        }
    }
</style>