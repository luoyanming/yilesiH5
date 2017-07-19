<template>
    <div class="app-container">

        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">
            <section class="not-open">
                <img src="/static/icon_blank_course_a@2x.png"/>
                <div class="not-open-info">
                    <p>非常抱歉</p>
                    <p>这个栏目还没开放，先去别处转转吧~</p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ready: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .not-open{
        padding:3.85rem 19% 0;
        background:#fff;
        height:100%;
        img{
            display: block;
            /*width:11rem;*/
            width:90%;
            /*height:7rem;*/
            margin:0 auto;
        }
        p{
            text-align: center;
            &:nth-of-type(1){
                 font-size: 0.75rem;
                 color: #666666;
                 line-height: 1.05rem;
            }
            &:nth-of-type(2){
                 font-size: 0.7rem;
                 color: #999999;
                 line-height: 1rem;
            }
        }
    }
</style>