import Vue from 'vue';
import Router from 'vue-router';

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
};

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/topic',
                    meta: { title: '话题列表' },
                    component: () => import(/* webpackChunkName: "talkindex" */ '../pages/topic/index.vue'),
                },
                {
                    path: '/topic/add',
                    meta: { title: '话题添加' },
                    component: () => import(/* webpackChunkName: "topicadd" */ '../pages/topic/info.vue')
                },
                {
                    path: '/topic/edit/:id',
                    meta: { title: '话题修改' },
                    component: () => import(/* webpackChunkName: "topicadd" */ '../pages/topic/info.vue')
                },
                {
                    path: '/comments',
                    component: () => import(/* webpackChunkName: "tabs" */ '../pages/comments/index.vue'),
                    meta: { title: '评论管理' }
                },
                {
                    //
                    path: '/feedback',
                    component: () => import(/* webpackChunkName: "upload" */ '../pages/feedback/index.vue'),
                    meta: { title: '意见反馈' }
                },
                {
                    path: '/users',
                    component: () => import(/* webpackChunkName: "icon" */ '../pages/users/index.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/members',
                    component: () => import(/* webpackChunkName: "chart" */ '../pages/members/index.vue'),
                    meta: { title: '成员管理' }
                },
                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "drag" */ '../pages/role/index.vue'),
                    meta: { title: '成员类型' }
                },
                {
                    path: '/role/add',
                    component: () => import(/* webpackChunkName: "roleAdd" */ '../pages/role/info.vue'),
                    meta: { title: '添加成员类型' }
                },
                {
                    path: '/role/edit/:id',
                    component: () => import(/* webpackChunkName: "roleEdit" */ '../pages/role/info.vue'),
                    meta: { title: '编辑成员类型' }
                },
                {
                    path: '/users/logout',
                    component: () => import(/* webpackChunkName: "logout" */ '../pages/users/logout.vue'),
                    meta: { title: '注销用户' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../pages/login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
