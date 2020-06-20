<template>
    <div class="sidebar">
        <div class="logo">
            <img v-if="!collapse" src="../../assets/img/min-logo0.png" />
            <img v-else src="../../assets/img/min-logo1.png" />
        </div>
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                                style="padding-left: 60px;"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: '/dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '/talk',
                    title: '话题管理'
                },
                {
                    icon: 'el-icon-lx-copy',
                    index: '/comments',
                    title: '评论管理'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '/feedback',
                    title: '意见反馈'
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: '/users',
                    title: '用户管理'
                },
                {
                    icon: 'el-icon-rank',
                    index: '6',
                    title: '成员管理',
                    subs: [
                        {
                            index: '/members',
                            title: '成员列表'
                        },
                        {
                            index: '/role',
                            title: '成员类型'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: '/users/logout',
                    title: '注销申请'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-y: scroll;
    z-index: 999999;
}
.sidebar .logo {
    background: #0e7bf1;
    line-height: 60px;
    color: #fff;
    height: 60px;
}
.sidebar .logo img {
    height: 32px;
    margin-left: 10px;
    margin-top: 12px;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
