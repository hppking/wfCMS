<template>
    <div class="cropper">
        <div :style="{width: width + 'px',height: height + 'px'}" class="l1 img-box">
            <i v-if="!cropImg" class="el-icon-lx-upload"></i>
            <img v-else :src="cropImg" class="ixmage" />
        </div>
        <div class="r1">
            <el-button class="upbth" plain>
                上传
                <input
                    class="crop-input"
                    type="file"
                    name="image"
                    accept="image/*"
                    @change="selectImg"
                />
            </el-button>
            <p v-if="height>=100">温馨提示：</p>
            <p>
                <span v-if="!(height>=100)">温馨提示：</span>
                推荐{{width*multiple}}px*{{height*multiple}}px，jpg/png格式，最大支持2M
            </p>
        </div>
        <el-dialog v-dialogDrag title="裁剪图片" :visible.sync="visible" width="640">
            <vue-cropper
                ref="cropper"
                :src="imgSrc"
                :aspect-ratio="width/height"
                :ready="cropImage"
                :zoom="cropImage"
                :cropmove="cropImage"
                style="width:100%;height:300px;"
            ></vue-cropper>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCrop">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import { uuid } from '../../utils/index';
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 82
        },
        height: {
            type: Number,
            default: 132
        },
        multiple: {
            type: Number,
            default: 10
        }
    },
    components: {
        VueCropper
    },
    watch: {
        value() {
            this.cropImg = this.value;
        }
    },
    data() {
        return {
            visible: false,
            defaultSrc: '',
            fileList: [],
            imgSrc: '',
            cropImg: '',
            loading: false
        };
    },
    created() {
        this.cropImg = this.value;
    },
    methods: {
        selectImg(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = event => {
                this.visible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        },
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.visible = false;
            this.cropImg = this.defaultSrc;
        },
        confirm() {
            //确认时候上传文件
            this.loading = true;
            this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
                const formData = new FormData();
                const fname = ossCnf.directory + uuid() + '.png';
                formData.append('key', fname);
                formData.append('policy', ossCnf.policy);
                formData.append('OSSAccessKeyId', ossCnf.ossAccessKeyId);
                formData.append('success_action_status', 200);
                formData.append('signature', ossCnf.signature);
                formData.append('file', blob);
                request(`POST ${ossCnf.host}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(resp => {
                    this.loading = false;
                    this.visible = false;
                    this.$emit('input', `${ossCnf.host}/${fname}`);
                    //验证
                    if (this.$parent.prop) {
                        this.$parent.form.validateField(this.$parent.prop);
                    }
                });
            });
        }
    }
};
</script>

<style scoped>
.cropper {
    display: flex;
}
.cropper .el-icon-lx-upload {
    font-size: 32px;
    color: #d4d5d7;
}
.cropper .ixmage {
    width: 100%;
    height: 100%;
}
.cropper .img-box {
    width: 82px;
    height: 132px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d4d5d7;
    border-radius: 4px;
    cursor: pointer;
}
.cropper .upbth {
    margin-bottom: 18px;
    position: relative;
    cursor: pointer;
}
.cropper .r1 {
    color: #adb4be;
    margin-left: 24px;
}
.cropper .r1 p {
    font-size: 12px;
    padding: 0;
    margin: 0;
    line-height: 20px;
}
.crop-input {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
}
</style>