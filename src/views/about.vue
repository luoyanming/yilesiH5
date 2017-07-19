<template>
    <div class="app-container">
        <div v-show="!ready" class="loading-more"><p>loading...</p></div>

        <div v-show="ready" class="container-wrapper">
            <div style="background: #fff">
                <section class="logo">
                    <img src="/static/icon_aboutus@2x.png"/>
                </section>

                <section class="short-intro">
                    <p class="short-intro-title">怡德依云简介</p>
                    <p class="short-intro-content">上海怡德依云信息技术有限公司(以下简称“怡德依云”)秉承“让科技扎根教育、用生态昭示未来”理念,怡德依云教育团队在教育信息化领域深耕十四年来,专注为教育全行业提供全方位的顶层规划设计、业务咨询、技术和服务解决方案。涵盖各级政府教育机构、高校、高职、中职、中小学、学前以及在线教育等领域。</p>
                    <p class="short-intro-content">怡德依云聚焦互联网应用和教育服务运营形成"区域政府教育云顶层设计+ 平台应用+第三方生态伙伴产品、服务+服务增值"的战略思路。怡德依云始终 围绕学生、老师、家长泛在学习环境下的各种生活、学习场景的教育需求,结 合未来信息技术发展趋势,运用人工智能、物联网、大数据、云计算技术,以 各层级智慧教育解决方案体系服务校园信息化建设,通过互联网平台汇聚海量 用户,通过开放平台,提供泛在服务,构建智慧教育生态,并不断筛选精品内 容、应用和服务,通过个体多维数据分析实现多样化的供给能力,构建精准学 习服务支持。怡德依云旗下品牌“易乐思”作为怡德依云践行智慧教育生态的 电商平台,同时整合生态合作伙伴,形成以区域教育云平台为业务核心的智慧教育生态。</p>
                    <p class="short-intro-title">易乐思简介</p>
                    <p class="short-intro-content">易乐思是基于大数据分析基础,从学生、老师、家长教育痛点需求入手,能持续满足其个性化、多样化、系统化教育需要,并且建立在一定知识体系架构基础上的成长陪伴教育产品与服务提供在线交易平台。</p>
                    <p class="short-intro-content">易乐思基于怡德依云教育 B 端布局优势与稳健发展,通过各类体制内教育 信息化应用,实现 B 端用户统一身份认证和统一数据采集评价,伴随式数据收 集实现数据的累积。根据数据分析和数据挖掘,建立完整的用户画像,从而精 准了解学生、老师、家长的教育需求。</p>
                    <p class="short-intro-content">借助易乐思平台,易乐思智慧教育生态合作伙伴可根据用户精准需求匹配相应的产品和服务,从而实现教育产品和服务提供者与需求方的无缝对接。供给方可以高效地发布教育产品,提供教育服务,及时获取消费者对产品的评价,对教育服务产品持续优化;需求方可以快速搜索自己的所需的资料、课程以及应用,多渠道享受教育产品服务。</p>
                    <p class="short-intro-content">易乐思平台的建设将继承多年来怡德依云教育信息化建设成果,打通体制内 外的教育机构,共建教育生态圈,推进信息技术与教育教学、教育管理和公共服 务深度融合和广泛应用。</p>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                ready : true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container-wrapper{

        .logo{
            width:86.7%;
            padding-top: 1.05rem;
            margin:0 auto 0.625rem;
            img{
                width:9.2rem;
                height:3.075rem;
                display: block;
                margin:0 auto;
            }
        }

        .short-intro{
            width:86.7%;
            margin:0 auto;
            padding-bottom:1.6rem;
            .short-intro-title{
                font-size: 0.75rem;
                color: #333333;
                line-height: 1.05rem;
                margin-top: 0.75rem;
            }
            .short-intro-content{
                font-size: 0.7rem;
                color: #999999;
                letter-spacing: 0;
                line-height: 1.25rem;
                text-indent: 2em;
            }
        }

    }
</style>