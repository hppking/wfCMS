import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import store from 'store';
import { messages } from './components/common/i18n';
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import bus from './components/common/bus';
import { parseURL } from './utils/url';
import request from './utils/request';

Vue.config.productionTip = false;
window.request = request
/*Vue.filter('testKN', function (url) {
    console.log('url')
    return 'okkkkk'
})*/
Vue.mixin({
    methods: {
        jump(url, nkeep = false) {
            window._keepAlive = {
                path: url,
                nkeep
            }
            this.$router.push({ path: url })
        },
        closeTag() {
            bus.$emit('close_current_tags')
        },
        parseURL() {
            return parseURL(window.location.href);
        }
    }
})
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    const role = store.get('account');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        if (role && to.path === '/login') {
            next('/');
            return
        }
        next();
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
