<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">
            <section class="hot-item-area">
                <div v-for="hotItem in hotItems" class="free-item-details" @click="gotoHotEducationDetail(hotItem.id)">
                    <img v-lazy="hotItem.picUrl"/>
                    <div>
                        <span class="free-item-title">{{hotItem.name}}</span>
                        <span class="free-item-hot">{{hotItem.sentiment}}</span>
                        <span class="free-item-price" v-if="hotItem.priceType">￥{{hotItem.price}}</span>
                        <span class="free-item-free" v-if="!hotItem.priceType">免费</span>
                        <p class="free-item-intro">{{hotItem.introduce}}</p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui';
    import { educationHotList } from '../api/api';
    export default {
        data() {
            return {
                ready: false,
                hotItems : []
            }
        },
        methods : {
            gotoHotEducationDetail : function(id) {
                this.$router.push({path : "/hoteducationdetail" , query : {id  : id }});
            },
            getData : function() {
                let params = {
                    event_id:this.$route.query.event_id
                };
                educationHotList(params).then(res => {
                    let { code , msg ,data } = res;
                    if( code == 0) {
                        this.hotItems = data.list;
                    }else{
                        Toast({
                            message: msg,
                            position: 'bottom',
                            duration: 2000
                        });
                    }
                    this.ready = true;
                })
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    .hot-item-area{
        height:100%;
        background: #F5F5F8;
        overflow-y: auto;
    }
    .free-item-details{
        width:100%;
        height:12.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: #ffffff;
        img{
            width:100%;
            height:8.75rem;
            margin-bottom: 0.5rem;
        }
        .free-item-title{
            font-size: 0.75rem;
            color: #333333;
            line-height: 1.05rem;
            margin-right: 1rem;
        }
        .free-item-hot{
            display: inline-block;
            background: url(/static/icon_fire_a@2x.png) no-repeat 0 0;
            background-size: 0.75rem 0.9rem;
            font-size: 0.6rem;
            color: #999999;
            line-height: 0.9rem;
            text-indent: 0.8rem;
        }
        .free-item-price{
            font-size: 0.75rem;
            color: #F85353;
            line-height: 1.05rem;
            float: right;
        }
        .free-item-free{
            font-size: 0.75rem;
            color: #20B681;
            letter-spacing: 0;
            line-height: 1.05rem;
            float: right;
        }
        .free-item-intro{
            font-size: 0.6rem;
            color: #999999;
            line-height: 0.9rem;
            margin-top: 0.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            width:100%;
            white-space: nowrap;
        }
    }
</style>