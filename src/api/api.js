import axios from 'axios/dist/axios.min';
var qs = require('qs');
let base = 'http://m.yilesi.cn';
// let base = 'http://h5dev.yls.com/privateapi';
// let base = 'http://h5serverdev.yls.com';


let header = { 'content-type': 'application/x-www-form-urlencoded' }

//获取首页菜单
export const preDate = params => { return axios.post(`${base}/homePage/preData`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取首页数据
export const homepageDate = params => { return axios.post(`${base}/homePage/data`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取精品课程列表
export const microLessonList = params => { return axios.post(`${base}/microLesson/courseList`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取热门教育列表
export const educationHotList = params => { return axios.post(`${base}/hot/education`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取热门教育详情
export const educationHotDetail = params => { return axios.post(`${base}/hot/education/detail`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取免费热门教育下载链接
export const downUrl = params => { return axios.post(`${base}/down/url`, qs.stringify(params), { headers: header }).then(res => res.data); };

//收藏热门教育
export const hotEducationCollect = params => { return axios.post(`${base}/hot/education/collection`, qs.stringify(params), { headers: header }).then(res => res.data); };

//取消收藏热门教育
export const hotEducationCancel = params => { return axios.post(`${base}/hot/education/collection/cancel`, qs.stringify(params), { headers: header }).then(res => res.data); };

//搜索页面热门搜索关键字
export const hotSearch = params => { return axios.post(`${base}/course/hotSearch`, qs.stringify(params), { headers: header }).then(res => res.data); };

//搜索页面名称搜索
export const nameSearch = params => { return axios.post(`${base}/course/search`, qs.stringify(params), { headers: header }).then(res => res.data); };

//分类搜索
export const catalogSearch = params => { return axios.post(`${base}/course/catalog/search`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取课程详情
export const courseDetail = params => { return axios.post(`${base}/course/detail`, qs.stringify(params), { headers: header }).then(res => res.data); };

//课程开始学习
export const courseStartStudy = params => { return axios.post(`${base}/course/start/study`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 登陆后提交学习的免费课程
export const courseSubmitStudyID = params => { return axios.post(`${base}/free/course/study`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取课程评论列表
export const courseCommentList = params => { return axios.post(`${base}/course/comment/list`, qs.stringify(params), { headers: header }).then(res => res.data); };

//发布评论
export const courseReleaseComment = params => { return axios.post(`${base}/course/release/comment`, qs.stringify(params), { headers: header }).then(res => res.data); };

//课程详情页收藏课程
export const addPersonalCollection = params => { return axios.post(`${base}/course/add/collection`, qs.stringify(params), { headers: header }).then(res => res.data); };

//课程详情页取消收藏课程
export const cancelPersonalCollection = params => { return axios.post(`${base}/course/cancel/collection`, qs.stringify(params), { headers: header }).then(res => res.data); };

//课程详情发布评论
export const releaseComment = params => { return axios.post(`${base}/course/release/comment`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取我的学习列表
export const myStudy = params => { return axios.post(`${base}/course/my/studys`, qs.stringify(params), { headers: header }).then(res => res.data); };

//获取我的收藏列表
export const myCollection = params => { return axios.post(`${base}/course/mycollections`, qs.stringify(params), { headers: header }).then(res => res.data); };

//已购买的热门课程
export const haveBroughtHot = params => { return axios.post(`${base}/my/hot/education`, qs.stringify(params), { headers: header }).then(res => res.data); };

//已收藏的热门课程
export const haveCollectedHot = params => { return axios.post(`${base}/hot/education/collection/list`, qs.stringify(params), { headers: header }).then(res => res.data); };



// 发送注册验证码
export const sendRegisterCode = params => { return axios.post(`${base}/send/register/code`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 注册
export const register = params => { return axios.post(`${base}/register`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 上传头像
export const uploadAvatar = params => { return axios.post(`${base}/member/upload/avatar`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 填写个人信息
export const addUserinfo = params => { return axios.post(`${base}/member/add/userinfo`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 登录
export const doLogin = params => { return axios.post(`${base}/doLogin`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 登出
export const doLogout = params => { return axios.post(`${base}/doLogout`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 是否登录
export const isLogin = params => { return axios.post(`${base}/isLogin`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 发送忘记密码验证码
export const sendForgotPasswordCode = params => { return axios.post(`${base}/send/forgotpassword/code`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 修改密码
export const forgotPassword = params => { return axios.post(`${base}/forgot/password`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 获取年段数组
export const periodList = params => { return axios.post(`${base}/common/period`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 获取热门城市
export const hotCity = params => { return axios.post(`${base}/hot/city`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更新学段
export const updatePeriod = params => { return axios.post(`${base}/member/update/period`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更新城市
export const updateCity = params => { return axios.post(`${base}/member/update/city`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更新头像
export const updateAvatar = params => { return axios.post(`${base}/member/update/avatar`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更新昵称
export const updateName = params => { return axios.post(`${base}/member/update/name`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 绑定手机
export const bindMobile = params => { return axios.post(`${base}/member/bind/mobile`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 发送更换绑定手机验证码
export const sendChangeMobileCode = params => { return axios.post(`${base}/send/change/mobile/code`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 更换绑定手机
export const changeMobile = params => { return axios.post(`${base}/member/change/mobile`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 用户协议
export const protocol = params => { return axios.post(`${base}/protocol`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 我的模块首页信息
export const memberIndex = params => { return axios.post(`${base}/member/index`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 我的个人信息
export const memberInfoIndex = params => { return axios.post(`${base}/member/info/index`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 获取支付方式
export const getPayChannel = params => { return axios.post(`${base}/pay/channel`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 课程购买--支付宝
export const buyCourseAlipay = params => { return axios.post(`${base}/course/pre/order/alipay`, qs.stringify(params), { headers: header }).then(res => res.data); };
// 热门教育购买--支付宝
export const buyHotEducationAlipay = params => { return axios.post(`${base}/popular/education/pre/order/alipay`, qs.stringify(params), { headers: header }).then(res => res.data); };
// 热门教育购买--诚信上海价格
export const ratelevelPrice = params => { return axios.post(`${base}/hot/education/ratelevel/price`, qs.stringify(params), { headers: header }).then(res => res.data); };

// 获取jsapi票据
export const getJsApi = params => { return axios.post(`${base}/weixin/getJsApi`, qs.stringify(params), { headers: header }).then(res => res.data); };
// 购买课程生成预订单
export const buyCourse = params => { return axios.post(`${base}/course/pre/order`, qs.stringify(params), { headers: header }).then(res => res.data); };
// 购买热门教育
export const buyHotEducation = params => { return axios.post(`${base}/popular/education/pre/order`, qs.stringify(params), { headers: header }).then(res => res.data); };
// jsapi支付后回调后，再次调用本地服务器验证是否真的支付成功（因为jsapi成功回调是不能百分百保证支付成功的）
export const orderCallback = params => { return axios.post(`${base}/order/callback`, qs.stringify(params), { headers: header }).then(res => res.data); };