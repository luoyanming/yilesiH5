<template>
    <div class="app-container">
        <div class="container-wrapper">
            <div class="avatar">
                <form class="form-upload">
                <div class="avatar-wrap">
                    <div class="avatar-pic">
                        <img :src="avatarUrl ? avatarUrl : ''">
                    </div>
                    <p class="avatar-text">点击上传头像</p>
                    <input type="file" name="file" accept="image/*" class="avatar-file" @change="avatarUpload">
                </div>
                </form>
            </div>

            <div class="form-wrapper info-form">
                <mt-field label="昵称" v-model="nickname" placeholder="输入昵称" type="text" class="mint-field-icon" @input="checkSubmit"></mt-field>

                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" disabled v-if="!submitDisabled">完成</mt-button>
                <mt-button type="primary" @click.native="handleSubmit" class="btn-submit" v-bind:class="buttonSkin" v-if="submitDisabled">完成</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { updateName } from '../api/api';
    import { validForm } from '../common/js/validForm';

    export default {
        data() {
            return {
                avatarUrl: '/static/icon_user_default@2x.png',
                nickname: '',
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
                if(this.nickname != '') {
                    this.submitDisabled = true;
                } else {
                    this.submitDisabled = false;
                }
            },
            handleSubmit: function() {
                if(!validForm.checkNull(this.nickname)) {
                    Toast({ message: '昵称不能为空！', position: 'bottom', duration: 2000 });
                    return false;
                }
                
                let updateNameParam = { name: this.nickname };

                Indicator.open({ text: '正在提交...', spinnerType: 'fading-circle' });

                updateName(updateNameParam).then(res => {
                    Indicator.close();

                    let { msg, code, data } = res;

                    if(code !== 0) {
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    } else {
                        Toast({ message: '昵称更新成功！', position: 'bottom', duration: 2000 });

                        this.$router.push({ path: '/index' });
                    }
                });
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
        }
    }
</script>

<style lang="scss" scoped>
    .avatar{
        margin-top: 2rem;
        font-size: 0;
        text-align: center;

        .avatar-wrap{
            position: relative;
            display: inline-block;
            overflow: hidden;

            .avatar-pic{
                width: 3.5rem;
                height: 3.5rem;
                margin: 0 auto;
                border-radius: 50%;
                background: url('/static/icon_user_default@2x.png') no-repeat center center;
                background-size: 100% 100%;
                overflow: hidden;

                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .avatar-text{
                margin-top: 0.6rem;
                font-size: 0.7rem;
                color: #CDCDCD;
                line-height: 1rem;
                text-align: center;
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
        }
    }

    .form-wrapper{
        margin-top: 2.75rem;

        .btn-submit{
            margin-top: 6.75rem;
        }
    }
</style>

<style lang="scss">
    .info-form{
        .mint-field-icon{
            &:last-of-type .mint-cell-wrapper{
                border-bottom: 1px solid #e4e4e4 !important;
            }

            .mint-field-core{
                color: #20B681;
            }
        }
    }
</style>