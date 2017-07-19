import useragreement from './views/user-agreement.vue'
import about from './views/about.vue'
import index from './views/index.vue'
import notopen from './views/not-open.vue'
import hoteducation from './views/hot-education.vue'
import hoteducationdetail from './views/hot-education-detail.vue'
import hotpaysuccess from './views/hot-pay-success.vue'
import hotpayfailure from './views/hot-pay-failure.vue'
import classify from './views/classify.vue'
import searchpage from './views/search-page.vue'
import classifylist from './views/classify-list.vue'
import lessondetail from './views/lesson-detail.vue'
import lessondetailDocument from './views/lesson-detail-document.vue'
import lessonpaysuccess from './views/lesson-pay-success.vue'
import lessonpayfailure from './views/lesson-pay-failure.vue'
import lessoncomment from './views/lesson-comment.vue'
import mystudy from './views/my-study.vue'
import mycollection from './views/my-collection.vue'
import hoteducationstatus from './views/hot-education-status.vue'
import microlesson from './views/micro-lesson-list.vue'

import login from './views/login.vue'
import register from './views/register.vue'
import forget from './views/forgetPwd.vue'
import period from './views/period.vue'
import city from './views/city.vue'
import info from './views/info.vue'
import my from './views/my.vue'
import myinfo from './views/my-info.vue'
import bindmobile from './views/bind-mobile.vue'
import bindmobilesucc from './views/bind-mobile-succ.vue'
import nickname from './views/nickname.vue'

import main from './views/main.vue'

import store from './vuex/store'

let routes = [{
        path: '/',
        component: index,
        name: '易乐思'
    },
    {
        path: '/main',
        component: main,
        name: '首页'
    },
    {
        path: '/index',
        component: index,
        name: '首页'
    },
    {
        path: '/useragreement',
        component: useragreement,
        name: '用户协议'
    },
    {
        path: '/about',
        component: about,
        name: '关于我们'
    },
    {
        path: '/notopen',
        component: notopen,
        name: '暂未开放'
    },
    {
        path: '/microlesson',
        component: microlesson,
        name: '精品课程'
    },
    {
        path: '/hoteducation',
        component: hoteducation,
        name: '热门教育'
    },
    {
        path: '/hoteducationdetail',
        component: hoteducationdetail,
        name: '热门教育详情'
    },
    {
        path: '/hotpaysuccess',
        component: hotpaysuccess,
        name: '热门课程支付成功',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/hotpayfailure',
        component: hotpayfailure,
        name: '热门课程支付失败',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/classify',
        component: classify,
        name: '分类'
    },
    {
        path: '/searchpage',
        component: searchpage,
        name: '搜索页面'
    },
    {
        path: '/classifylist',
        component: classifylist,
        name: '分类列表'
    },
    {
        path: '/lessondetail',
        component: lessondetail,
        name: '课程详情'
    },
    {
        path: '/lessondetailDocument',
        component: lessondetailDocument,
        name: '课件'
    }, {
        path: '/lessonpaysuccess',
        component: lessonpaysuccess,
        name: '购买课程成功',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/lessonpayfailure',
        component: lessonpayfailure,
        name: '购买课程失败',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/lessoncomment',
        component: lessoncomment,
        name: '课程评价'
    },
    {
        path: '/mystudy',
        component: mystudy,
        name: '我的学习',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/mycollection',
        component: mycollection,
        name: '我的收藏',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/hoteducationstatus',
        component: hoteducationstatus,
        name: '热门教育',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        component: login,
        name: '登录'
    },
    {
        path: '/register',
        component: register,
        name: '注册'
    },
    {
        path: '/forget',
        component: forget,
        name: '找回密码'
    },
    {
        path: '/period',
        component: period,
        name: '选择学段',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/city',
        component: city,
        name: '选择城市',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/info',
        component: info,
        name: '个人信息',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/my',
        component: my,
        name: '我的',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/myinfo',
        component: myinfo,
        name: '我的个人信息',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/bindmobile',
        component: bindmobile,
        name: '手机账号绑定',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/bindmobilesucc',
        component: bindmobilesucc,
        name: '手机账号绑定--已绑定手机号',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/nickname',
        component: nickname,
        name: '修改昵称',
        meta: {
            requiresAuth: true
        }
    }
];


export default routes;