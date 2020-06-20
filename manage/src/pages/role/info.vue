<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 成员管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>新建类型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container-v">
            <div class="form-box">
                <el-card class="box-card" style="margin-top: 10px;">
                    <div slot="header" class="clearfix">
                        <span>基本信息</span>
                    </div>
                    <div class="formb">
                        <el-form ref="form-i" :model="form" label-position="top">
                            <el-form-item label="类型名称">
                                <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="saveDo">保存</el-button>
                                <el-button>取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import Tags from '../../components/Tag.vue';
import request from '../../utils/request';
export default {
    name: 'baseform',
    components: {
        Tags
    },
    data() {
        return {
            form: {
                name: ''
            }
        };
    },
    methods: {
        saveDo() {
            const { id } = this.$route.params;
            const url = id ? `PUT /manage/role/${id}` : 'POST /manage/role';
            request(`${url}`, this.form).then(resp => {
                if (resp.code == 0) {
                    this.form = {};
                    this.closeTag();
                    this.jump('/role', true);
                } else {
                    this.$message.error(resp.msg);
                }
            });
        }
    },
    mounted() {
        const { id } = this.$route.params;
        request(`GET /manage/role/${id}`).then(resp => {
            if (resp.code == 0) {
                this.form = resp.item;
            }
        });
    }
};
</script>

<style scoped>
.form-box {
    width: 100%;
}
.formb {
    width: 320px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: '';
}
.clearfix:after {
    clear: both;
}
.row-bgx {
    padding: 0 12px;
}
.addx .ad {
    width: 100%;
    border: 1px dashed #dcdfe6;
}
</style>>