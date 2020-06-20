<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 话题管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>新建话题</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container-v">
            <div class="form-box">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>上传封面</span>
                    </div>
                    <div class="formb">
                        <el-form ref="thumbForm" :rules="rules" :model="form" label-width="100px">
                            <el-form-item prop="thumb" :inline-message="true" label="话题封面图">
                                <up-cropper v-model="form.thumb"></up-cropper>
                            </el-form-item>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item prop="poster_img" label="海报图">
                                        <up-cropper v-model="form.poster_img"></up-cropper>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="share_img" label="分享图">
                                        <up-cropper
                                            v-model="form.share_img"
                                            :width="126"
                                            :height="100"
                                        ></up-cropper>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </el-card>
                <el-form ref="form" :rules="rules" :model="form" label-position="top">
                    <el-card class="box-card" style="margin-top: 10px;">
                        <div slot="header" class="clearfix">
                            <span>基本信息</span>
                        </div>
                        <div class="formb">
                            <el-row type="flex" class="row-bgx" justify="space-between">
                                <el-col :span="12">
                                    <el-form-item label="标题" prop="title">
                                        <el-input
                                            v-model="form.title"
                                            placeholder="请输入标题（最多30个字，必填）"
                                        ></el-input>
                                    </el-form-item>
                                    <div v-for="(vo,i) in form.attitudes" :key="'av'+i">
                                        <el-form-item
                                            :required="true"
                                            :prop="'attitudes.'+i+'.title'"
                                            :label="i==0 ? '态度自定义' : ''"
                                        >
                                            <el-input
                                                v-model="vo.title"
                                                placeholder="请输入关键字（最多4个字）"
                                            ></el-input>
                                        </el-form-item>
                                        <el-form-item class="icon-image">
                                            <up-cropper
                                                v-model="vo.icon"
                                                :multiple="3"
                                                :width="104"
                                                :height="60"
                                            ></up-cropper>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col style="width:60px;"></el-col>
                                <el-col :span="12">
                                    <el-form-item label="话题标签">
                                        <div>
                                            <Tags v-model="form.tags"></Tags>
                                        </div>
                                    </el-form-item>
                                    <div v-for="(item,i) in form.interacts" :key="'v'+i">
                                        <el-form-item
                                            :prop="'interacts.'+i+'.title'"
                                            :label="i==0 ? '互动自定义' : ''"
                                        >
                                            <el-input
                                                v-model="item.title"
                                                placeholder="请输入关键字（最多8个字）"
                                            ></el-input>
                                        </el-form-item>
                                        <el-form-item>
                                            <up-cropper
                                                v-model="item.icon"
                                                :multiple="1"
                                                :width="60"
                                                :height="60"
                                            ></up-cropper>
                                        </el-form-item>
                                    </div>
                                    <div class="addx">
                                        <el-button
                                            @click="addInteract"
                                            class="ad"
                                            icon="el-icon-plus"
                                            plain
                                        >新增互动</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                    <el-card class="box-card" style="margin-top: 10px;">
                        <div slot="header" class="clearfix">
                            <span class="xr">话题详情</span>
                        </div>
                        <el-form-item :inline-message="true" prop="content">
                            <UEditor v-model="form.content" />
                        </el-form-item>
                    </el-card>
                </el-form>
            </div>
        </div>
        <Fsave>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="publish">完成并发布</el-button>
        </Fsave>
    </div>
</template>

<script>
import UpCropper from '../../components/upload/Cropper.vue';
import UEditor from '../../components/UEditor.vue';
import Tags from '../../components/Tag.vue';
import Fsave from '../../components/Fsave.vue';

export default {
    name: 'myForm',
    components: {
        UpCropper,
        UEditor,
        Tags,
        Fsave
    },
    data() {
        return {
            form: {
                title: '',
                thumb: '', //封面图
                poster_img: '', //海报图
                share_img: '', //分享图
                content: '',
                tags: [],
                attitudes: [
                    { id: 1, title: '', icon: '' },
                    { id: 2, title: '', icon: '' }
                ],
                interacts: [{ title: '', icon: '' }]
            },
            rules: {
                title: [
                    { required: true, message: '话题不能为空', trigger: 'blur' },
                    { message: '字数不得超过30个', max: 30, trigger: 'change' }
                ],
                thumb: [{ required: true, message: '封面图没有上传' }],
                poster_img: [{ required: true, message: '海报图没有上传' }],
                share_img: [{ required: true, message: '分享图没有上传' }],
                content: [{ required: true, message: '话题详情不能为空', trigger: 'change' }],
                attitudes: (() => {
                    const objs = {};
                    for (let i = 0; i < 2; i++) {
                        objs[i] = {
                            title: [
                                { required: true, message: '态度名称不能为空' },
                                { message: '字数不得超过4个', max: 4 }
                            ],
                            icon: []
                        };
                    }
                    return objs;
                })(),
                interacts: (() => {
                    const objs = {};
                    for (let i = 0; i < 20; i++) {
                        objs[i] = {
                            title: [
                                { required: true, message: '互动名称不能为空' },
                                { message: '字数不得超过8个', max: 8 }
                            ],
                            icon: []
                        };
                    }
                    return objs;
                })()
            }
        };
    },
    methods: {
        addInteract() {
            this.form.interacts.push({ title: '', icon: '' });
        },
        //发布
        publish() {
            //
        },
        //保存
        save() {
            const { id } = this.$route.params;
            const url = id > 0 ? `PUT /manage/topic/${id}` : 'POST /manage/topic';
            const form1 = new Promise((resolve, reject) => {
                this.$refs['thumbForm'].validate(valid => {
                    if (valid) {
                        resolve(true);
                    }
                });
            });
            const form2 = new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve(true);
                    }
                });
            });
            Promise.all([form1, form2]).then((ok1, ok2) => {
                if (ok1 && ok2) {
                    console.log('保存数据 v');
                    request(`${url}`, this.query).then(resp => {
                        if (resp.code == 0) {
                            this.form = {
                                tags: [],
                                attitudes: [
                                    { id: 1, title: '', icon: '' },
                                    { id: 2, title: '', icon: '' }
                                ],
                                interacts: [{ title: '', icon: '' }]
                            };
                            this.closeTag();
                            this.jump('/talk', true);
                        } else {
                            this.$message.error(resp.msg);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.form-box {
    width: 100%;
}
.formb {
    width: 960px;
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
.xr:after {
    content: '*';
    color: #f56c6c;
    margin-left: 4px;
}
</style>>