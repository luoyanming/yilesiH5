<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">
            <div class="period-list">
                <mt-button v-for="item in period" type="primary" @click.native="selectPeriod(item.id)" class="btn-period" v-bind:class="{'current': item.id == periodId}">{{ item.name }}</mt-button>
            </div>

            <p class="period-tips" v-if="!modify">选择学段，我能迅速找到适合你的课程~<br />你也可以在“个人信息”中修改</p>
            <p class="period-tips" v-if="modify">选择学段，我能迅速找到适合你的课程~</p>
        </div>
    </div>
</template>

<script>
    import { Toast, Indicator } from 'mint-ui';
    import { periodList, updatePeriod } from '../api/api';

    export default {
        data() {
            return {
                ready: false,
                period: [],
                periodId: '',
                modify: false
            };
        },
        methods: {
            getList: function() {
                if(localStorage.getItem('period111')) {
                    this.modify = false;
                } else {
                    this.modify = true;
                }

                periodList({}).then(res => {
                    let { msg, code, data } = res;

                    if(code !== 0) {
                        this.getList();
                    } else {
                        this.period = data.period;

                        this.ready = true;
                    }
                });
            },
            selectPeriod: function(id) {
                this.periodId = id;

                let updatePeriodParam = { period_id: this.periodId };

                Indicator.open({ text: '', spinnerType: 'fading-circle' });

                updatePeriod(updatePeriodParam).then(res => {
                    Indicator.close();

                    let { msg, code, data } = res;
                    
                    if(code !== 0) {
                        Toast({ message: msg, position: 'bottom', duration: 2000 });
                    } else {
                        Toast({ message: '学段设置成功！', position: 'bottom', duration: 2000 });

                        if(this.modify) {
                            this.$router.push({ path: '/myinfo' });
                        } else {
                            this.$router.push({ path: '/city' });
                        }
                    }
                });
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .period-list{
        margin-top: 2rem;
        overflow: hidden;

        .btn-period{
            width: 8rem;
            height: 3rem;
            margin: 1.2rem auto;
            background: #FFFFFF !important;
            border: 1px solid #E5E5E5;
            border-radius: 4px;
            font-size: .9rem;
            color: #20B681;
            line-height: 3rem;

            &.current{
                background: #20B681 !important;
                border: 1px solid #20B681;
                color: #FFF;
            }
        }
    }

    .period-tips{
        margin-top: 0.8rem;
        font-size: 0.6rem;
        color: #999;
        line-height: 0.9rem;
        text-align: center;
    }
</style>