<template>
    <div class="app-container">
        <div class="container-wrapper flex-v">
            <div class="form-wrapper flex-a-i flex-v">
                <mt-field label="手机号" v-model="mobile" placeholder="输入手机号" type="tel" class="mint-field-icon" @input="inputMobileChange"></mt-field>
                <mt-field label="验证码" v-model="code" placeholder="输入验证码" type="tel" class="mint-field-icon"  @input="checkSubmit">
                    <mt-button type="primary" @click.native="sendCode" class="button-link btn-code" disabled v-if="!codeDisabled">{{ codeTime }}</mt-button>
                    <mt-button type="primary" @click.native="sendCode" class="button-link btn-code" v-if="codeDisabled">{{ codeTime }}</mt-button>
                </mt-field>
                <mt-field label="密码" v-model="password" placeholder="输入至少6位的密码" :type="!showPwd ? 'password' : 'text'" class="mint-field-icon" @input="checkSubmit">
                    <mt-button type="primary" @click.native="showPwd = !showPwd" class="button-link btn-toggle btn-toggle-hide" v-if="!showPwd"></mt-button>
                    <mt-button type="primary" @click.native="showPwd = !showPwd" class="button-link btn-toggle btn-toggle-show" v-if="showPwd"></mt-button>
                </mt-field>

                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" disabled v-if="!submitDisabled">注册</mt-button>
                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" v-if="submitDisabled">注册</mt-button>

                <div class="flex-a-i"></div>

                <div class="agreement" v-if="!source">
                    注册即表示您同意我们的<mt-button type="primary" @click.native="linkTo()" class="button-link">《用户协议》</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { sendRegisterCode, register } from '../api/api';
    import { validForm } from '../common/js/validForm';

    export default {
        data() {
            return {
                mobile: '',
                password: '',
                code: '',
                time: 60,
                codeTime: '获取验证码',
                codeDisabled: false,
                submitDisabled: false,
                showPwd: false,
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
            inputMobileChange: function(v){
                if(v != '') {
                    this.codeDisabled = true;
                } else {
                    this.codeDisabled = false;
                }

                this.checkSubmit();
            },
            checkSubmit: function() {
                if(this.mobile != '' && this.code != '' && this.password != '') {
                    this.submitDisabled = true;
                } else {
                    this.submitDisabled = false;
                }
            },
            handleSubmit: function() {
                if(!validForm.checkNull(this.code)) {
                    Toast({ message: '验证码不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                if(!validForm.checkNull(this.password)) {
                    Toast({ message: '密码不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                
                let registerParam = { mobile: this.mobile, code: this.code, password: this.password };

                Indicator.open({ text: '正在提交...', spinnerType: 'fading-circle' });

                register(registerParam).then(res => {
                    Indicator.close();

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    } else {
                        Toast({ message: '注册成功，请完善信息！', position: 'bottom', duration: 2000 });

                        this.$router.push({ path: '/period' });
                    }
                });
            },
            sendCode: function() {
                if(!validForm.checkNull(this.mobile)) {
                    Toast({ message: '手机号码不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                // if(!validForm.checkMobile(this.mobile)) {
                //     Toast({ message: '手机号码格式不正确！', position: 'bottom', duration: 2000 });
                //     return false;
                // }

                let sendRegisterCodeParam = { mobile: this.mobile };

                Indicator.open({ text: '正在发送...', spinnerType: 'fading-circle' });

                sendRegisterCode(sendRegisterCodeParam).then(res => {
                    Indicator.close();

                    let { errorInfo, code, data } = res;

                    if(code !== 0) {
                        Toast({ message: errorInfo, position: 'bottom', duration: 2000 });
                    } else {
                        Toast({ message: '验证码已发送，请注意查收！', position: 'bottom', duration: 2000 });
                        this.codeTimer();
                    }
                });
            },
            codeTimer: function() {
                let that = this;

                that.codeDisabled = false;

                that.codeTime = that.time + 's';

                var xf = setInterval(function(){
                    if(that.time == 1){
                        that.time = 60;
                        that.codeTime = '重发';
                        that.codeDisabled = true;
                        clearInterval(xf);
                    }else{
                        that.time --;
                        that.codeTime = that.time + 's';
                    }
                }, 1000);
            },
            linkTo: function() {
                this.$router.push({ path: '/useragreement' });
            }
        },
        mounted() {
            
        }
    }
</script>

<style lang="scss" scoped>
    .form-wrapper{
        margin-top: 2.5rem;
    }

    .btn-code{
        color: #20B681 !important;
        padding: 0 .5rem;
        line-height: 1rem;
        border-left: 1px solid #E5E5E5;
        border-radius: 0 !important;

        &.is-disabled{
            background: none !important;
            color: #CDCDCD !important;
            opacity: 1 !important;
        }
    }

    .btn-toggle{
        padding-left: 1rem;
        height: .5rem;

        &.btn-toggle-hide{
            background: url('/static/icon_signin_password1@2x.png') no-repeat center center !important;
            background-size: 100% 100% !important;
        }

        &.btn-toggle-show{
            background: url('/static/icon_signin_password2@2x.png') no-repeat center center !important;
            background-size: 100% 100% !important;
        }
    }

    .btn-submit{
        margin-top: 6rem;
    }

    .agreement{
        margin-bottom: 1.5rem;
        text-align: center;
        font-size: 0.6rem;
        color: #999;
        line-height: 0.9rem;

        .button-link{
            color: #20B681;
        }
    }
</style>