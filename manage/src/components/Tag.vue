<template>
    <div class="tags-wap">
        <el-tag
            :key="tag"
            v-for="tag in tags"
            class="vo"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
            class="input-new-tag"
            v-if="visible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            :maxlength="8"
            show-word-limit
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            visible: false,
            tags: [],
            inputValue: ''
        };
    },
    created() {
        this.tags = this.value;
    },
    methods: {
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
            this.$emit('input', this.tags);
        },

        showInput() {
            this.visible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.tags.push(inputValue);
                this.$emit('input', this.tags);
            }
            this.visible = false;
            this.inputValue = '';
        }
    }
};
</script>

<style scoped>
.tags-wap .vo {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
}
.button-new-tag {
    margin-left: 0;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 160px;
    margin-left: 0;
    vertical-align: bottom;
}
</style>