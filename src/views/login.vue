<template>
    <div class="app-container">
        <div class="container-wrapper flex-v">
            <div class="logo">易乐思</div>

            <div class="form-wrapper flex-a-i flex-v">
                <mt-field label="手机号" v-model="mobile" placeholder="请输入手机号" type="tel" class="mint-field-icon" @input="checkSubmit"></mt-field>
                <mt-field label="密码" v-model="password" placeholder="请输入密码" type="password" class="mint-field-icon" @input="checkSubmit"></mt-field>

                <div class="forget">
                    <mt-button type="primary" @click.native="linkToForget" class="button-link">忘记密码</mt-button>
                </div>

                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" disabled v-if="!submitDisabled">登录</mt-button>
                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" v-if="submitDisabled">登录</mt-button>

                <div class="register">
                    <mt-button type="primary" @click.native="linkToRegister" class="button-link">立即注册</mt-button>
                </div>

                <div class="flex-a-i"></div>

                <!-- <div class="wechat">
                    <mt-button type="primary" @click.native="" class="button-link">微信</mt-button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { doLogin, courseSubmitStudyID } from '../api/api';
    import { validForm } from '../common/js/validForm';

    export default {
        data() {
            return {
                mobile: '',
                password: '',
                submitDisabled: false
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
            checkSubmit: function() {
                if(this.mobile != '' && this.password != '') {
                    this.submitDisabled = true;
                } else {
                    this.submitDisabled = false;
                }
            },
            handleSubmit: function() {
                if(!validForm.checkNull(this.mobile)) {
                    Toast({ message: '手机号码不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                // if(!validForm.checkMobile(this.mobile)) {
                //     Toast({ message: '手机号码格式不正确！', position: 'bottom', duration: 2000 });
                //     return false;
                // }
                if(!validForm.checkNull(this.password)) {
                    Toast({ message: '密码不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                
                let doLoginParam = { mobile: this.mobile, password: this.password };

                Indicator.open({ text: '正在提交...', spinnerType: 'fading-circle' });

                doLogin(doLoginParam).then(res => {
                    Indicator.close();

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    } else {
                        Toast({ message: '登录成功！', position: 'bottom', duration: 2000 });

                        localStorage.setItem('nickname', data.memberInfoIndexVo.name);
                        localStorage.setItem('avatar', data.memberInfoIndexVo.avatar);
                        localStorage.setItem('mobile', data.memberInfoIndexVo.mobile);
                        localStorage.setItem('period', data.memberInfoIndexVo.period);
                        localStorage.setItem('city', data.memberInfoIndexVo.city);

                        this.submitCourseStudyIDList();

                        // if(this.$route.query.redirecturl) {
                        //     window.location.href = this.$route.query.redirecturl;
                        // } else {
                            this.$router.push({ path: '/index' });
                        // }
                    }
                });
            },
            submitCourseStudyIDList: function() {
                let courseStudyID = localStorage.getItem('courseStudyID');

                if(!courseStudyID) {
                    return false;
                }

                let param = { 'courseIds': courseStudyID };

                courseSubmitStudyID(param).then(res => {
                    let { code, msg, data } = res;

                    if (code != 0) {
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    } else {
                        localStorage.removeItem('courseStudyID');
                    }
                });
            },
            linkToRegister: function() {
                this.$router.push({ path: '/register' });
            },
            linkToForget: function() {
                this.$router.push({ path: '/forget' });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .logo{
        padding-top: 5.1rem;
        font-size: .9rem;
        color: #333;
        line-height: 1.25rem;
        text-align: center;
        background: url('/static/icon_logo@2x.png') no-repeat center 1.425rem;
        background-size: 3.9rem auto;
    }

    .form-wrapper{
        margin-top: 1.75rem;
    }

    .forget{
        width: 70%;
        margin: 0.25rem auto 0;
        text-align: right;
    }

    .btn-submit{
        margin-top: 2rem;
    }

    .register{
        margin-top: 1rem;
        text-align: center;

        .button-link{
            color: #20B681;
        }
    }
    
    .wechat{
        margin-bottom: 1.5rem;
        text-align: center;

        .button-link{
            padding-left: 1.3rem;
            background: url('/static/icon_wechat@2x.png') no-repeat left center !important;
            background-size: 1rem auto !important;
        }
    }
</style>