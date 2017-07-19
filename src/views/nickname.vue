<template>
    <div class="app-container">
        <div class="container-wrapper">
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
            getNickname: function() {
                this.nickname = localStorage.getItem('nickname');
            },
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

                        this.$router.push({ path: '/myinfo' });
                    }
                });
            }
        },
        mounted() {
            this.getNickname();
        }
    }
</script>

<style lang="scss" scoped>
    .form-wrapper{
        margin-top: 2.4rem;

        .btn-submit{
            margin-top: 8rem;
        }
    }
</style>