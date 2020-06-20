<template>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(vo,i) in items" :key="'v'+i">
                <!--<i class="el-icon-lx-cascades"></i>-->
                {{vo.title}}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: []
        }
    },
    data() {
        return {};
    },
    created() {}
};
</script>
