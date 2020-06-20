<template>
    <div class="fbwap">
        <div class="fsaveH"></div>
        <div class="fsave" :class="{'content-collapse':collapse}">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped>
.fsave {
    position: fixed;
    bottom: 0;
    left: 260px;
    right: 25px;
    z-index: 99999;
    display: flex;
    align-items: flex-start;
    height: 40px;
    -webkit-transition: left 0.3s ease-in-out;
    transition: left 0.3s ease-in-out;
}
.fsaveH {
    height: 40px;
}
.fsave.content-collapse {
    left: 75px;
}
</style>

<script >
import bus from './common/bus';
export default {
    name: 'Fsave',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            collapse: false
        };
    },
    methods: {},
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });
    }
};
</script>