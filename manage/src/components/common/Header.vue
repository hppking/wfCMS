<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!--<div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>-->
                <!-- 用户头像 -->
                <div class="avator">
                    <!--<img src="../../assets/img/logo.png" />-->
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a href="#">
                            <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                        </a>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog title="修改密码" :visible.sync="visible" width="30%">
            <el-form
                class="myform"
                style="padding-right: 30px;"
                ref="form"
                :model="form"
                label-width="100px"
            >
                <el-form-item label="手机号">
                    <el-row>
                        <el-col :span="14">
                            <el-input placeholder="请输入手机号"></el-input>
                        </el-col>
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="8" style="text-align:right;">
                            <el-button type="primary" plain>获取验证码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input placeholder="请输入确认密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <span class="dialog-footer dialog-pwd">
                        <el-button type="primary" @click="visible = false">保 存</el-button>
                        <el-button @click="visible = false">取 消</el-button>
                    </span>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import store from 'store';
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: '用户名称',
            message: 2,
            visible: false,
            form: {}
        };
    },
    computed: {
        username() {
            let uname = store.get('account');
            return uname ? uname : this.name;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('account');
                this.$router.push('/login');
            } else if (command == 'editPwd') {
                this.visible = true;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0;
    cursor: pointer;
    line-height: 60px;
    margin-left: 24px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 60px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.avator {
    margin-left: 20px;
    border: 1px solid #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.avator img {
    display: block;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
