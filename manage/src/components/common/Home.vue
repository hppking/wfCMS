<template>
    <div class="wrapper">
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-head></v-head>
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop style="z-index: 99999999;" target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            const kp = window._keepAlive;
            //console.log(kp, msg);
            let isKA = true;
            const kps = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                if (kp && kp.path == msg[i].path && kp.nkeep == true) {
                    console.log(kp);
                    isKA = false;
                }
                msg[i].name && isKA && kps.push(msg[i].name);
            }
            if (!isKA) {
                window._keepAlive = undefined;
            }
            this.tagsList = kps;
        });
    }
};
</script>
