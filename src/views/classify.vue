<template>
    <div class="app-container">
        <div class="container-wrapper flex-v">
            <section class="classify-search-btn">
                <button @click="gotoSearchPage()">
                    <img src="/static/icon_search1@2x.png"/>
                    <span>搜索课程</span>
                </button>
            </section>

            <section class="classify-area flex-a-i">
                <div class="classify-area-left">
                    <p v-for="item in period" @click="selectPeriod(item.value)" v-bind:class="{ 'selected': periodID == item.value}">{{ item.label }}</p>
                </div>
                <div class="classify-area-right">
                    <mt-button type="default" v-for="item in grade" @click.native="selectGrade(item.value, item.label)">{{ item.label }}</mt-button>
                </div>
            </section>
            
            <footer class="flex-h">
                <p class="flex-a-i"><router-link to="/index"><span>首页</span></router-link></p>
                <p class="flex-a-i"><router-link to="/classify"><span>分类</span></router-link></p>
                <p class="flex-a-i"><router-link to="/my"><span>我的</span></router-link></p>
            </footer>
        </div>
    </div>
</template>

<script>
    const catalogJson = require('../common/catalog.json');

    export default {
        data() {
            return {
                catalog: [],
                period : [],
                periodID : '',
                grade: []
            }
        },
        methods : {
            getCatalog: function() {
                for(let i = 0; i < catalogJson.catalog.length; i++) {
                    this.period.push({
                        'value': catalogJson.catalog[i].id,
                        'label': catalogJson.catalog[i].name
                    });
                }

                this.selectPeriod(catalogJson.catalog[0].id);
            },
            selectPeriod: function(val) {
                this.periodID = val;

                let periodIndex;
                for(let i = 0; i < catalogJson.catalog.length; i++) {
                    if(this.period[i].value == val) {
                        periodIndex = i;
                    }
                }

                let gradeList = catalogJson.catalog[periodIndex].sub;
                this.grade = [];
                for(let i = 0; i < gradeList.length; i++) {
                    this.grade.push({
                        'value': gradeList[i].id,
                        'label': gradeList[i].name
                    });
                }
            },
            selectGrade: function(val, label) {
                this.$router.push({ path: '/searchpage', query: { periodId: this.periodID, gradeId: val, title: label } });
            },
            gotoSearchPage : function() {
                this.$router.push({ path: '/searchpage', query: { periodId: 99 } });
            }
        },
        mounted() {
            this.getCatalog();
        }
    }
</script>

<style lang="scss" scoped>
    .classify-search-btn{
        padding: 0 1rem;

        button{
            display: block;
            width: 100%;
            height:1.5rem;
            font-size: 0.6rem;
            color: #CDCDCD;
            line-height: 0.9rem;
            margin:0.35rem auto;
            border: 1px solid #E5E5E5;
            border-radius: 0.1rem;
            background: #F5F5F8;

            img{
                width:0.55rem;
                height:0.6rem;
                vertical-align: text-top;
            }
        }
    }

    .classify-area{
        height:calc(100% - 4.65rem);
        .classify-area-left{
            float: left;
            width: 6rem;
            height: 100%;
            background: #F5F5F8;;
            p{
                height:3rem;
                text-align: center;
                line-height: 3rem;
                font-size: 0.75rem;
                color: #666666;
                &.selected{
                     background: #FFFFFF;
                     border-left:0.2rem solid #20B681;
                }
            }
        }
        .classify-area-right{
            /*padding-left: 6rem;*/
            height: 100%;
            background: #ffffff;
            overflow-y : auto;
            padding-bottom: 1.6rem;
            /*padding:1.6rem 0 0 26%;*/
            button{
                background: #F5F5F8;
                border-radius: 2.5rem;
                width:40%;
                height:2rem;
                font-size: 0.75rem;
                color: #999999;
                line-height: 2rem;
                text-align: center;
                margin-left: 18%;
                margin-top: 1.6rem;
                box-shadow: none;
            }
        }
    }


    footer{
        p:nth-of-type(1){
            background: url(/static/icon_tab_home1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
        p:nth-of-type(2){
            background: url(/static/icon_tab_classification2@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
            
            a{
                color: #20B681;
            }
        }
        p:nth-of-type(3){
            background: url(/static/icon_tab_mine1@2x.png) no-repeat center 0.3rem;
            background-size: 1.25rem 1.25rem;
        }
    }
</style>