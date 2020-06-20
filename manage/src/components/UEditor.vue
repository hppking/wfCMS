<template>
    <div>
        <vue-ueditor-wrap v-model="content" :config="myConfig" />
    </div>
</template>
<style >
</style>

<script type="text/babel" >
import VueUeditorWrap from 'vue-ueditor-wrap';
const ueditorPath = '/ueditor/';
const serverUrl = '/api/manage/cnf/ueditor';
export default {
    name: 'Editor',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    components: {
        VueUeditorWrap
    },
    data() {
        return {
            myConfig: {
                serverUrl: serverUrl,
                //imageUrl: 'http://static.youdianlab.com',
                UEDITOR_HOME_URL: ueditorPath,
                theme: 'notadd',
                toolbars: [
                    [
                        'source',
                        'bold',
                        'italic',
                        'underline',
                        'fontborder',
                        'strikethrough',
                        'removeformat',
                        'forecolor',
                        'backcolor',
                        'insertorderedlist',
                        'insertunorderedlist',
                        'fontsize',
                        'justifyleft',
                        'justifyright',
                        'justifycenter',
                        'justifyjustify',
                        'insertimage',
                        'simpleupload',
                        'fullscreen'
                    ]
                ],
                initialFrameHeight: 320,
                scaleEnabled: true,
                xssFilterRules: true,
                inputXssFilter: true,
                outputXssFilter: true
            },
            content: ''
        };
    },
    methods: {},
    watch: {
        content(newval) {
            this.$emit('input', newval);
            //验证
            if (this.$parent.prop) {
                this.$parent.form.validateField(this.$parent.prop);
            }
        },
        value() {
            this.content = this.value;
        }
    },
    mounted() {
        this.content = this.value;
        request('GET /manage/osscnf').then(resp => {
            window.ossCnf = resp.item;
        });
    }
};
</script>