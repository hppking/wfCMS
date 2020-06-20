<template>
    <div class="login-wrap">
        <div class="login">
            <div class="title">有点识验室管理平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <div style="position: relative;">
                        <el-input
                            size="medium"
                            @change="isMobile"
                            v-model="param.account"
                            placeholder="账号|手机号"
                        >
                            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                        </el-input>
                        <span v-if="isSms" @click="smsCode" class="vcode">{{smstxt}}</span>
                    </div>
                </el-form-item>
                <el-form-item prop="verify">
                    <el-input
                        size="medium"
                        type="password"
                        :placeholder="isSms? '短信验证码': '密码'"
                        v-model="param.verify"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import request from '../utils/request';
import store from 'store';
export default {
    data: function() {
        return {
            param: {
                account: '',
                verify: ''
            },
            interN: 0,
            smsExp: 60 * 3,
            isSms: false,
            smstxt: '获取验证码',
            rules: {
                account: [{ required: true, message: '请输入账号或手机号', trigger: 'blur' }],
                verify: [{ required: true, message: '请输入口令码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        isMobile(val) {
            this.isSms = /^1[3456789]\d{9}$/.test(val) ? true : false;
        },
        smsCode() {
            if (!/^1[3456789]\d{9}$/.test(this.param.account)) {
                console.log('请输入正确的手机号');
                return;
            }
            if (this.smsExp != 60 * 3) return;
            request('POST /manage/sms/code', { mobile: this.param.account }).then(resp => {
                if (resp.code == 0) {
                    this.smstxt = '180s';
                    this.interN = setInterval(() => {
                        this.smsExp = this.smsExp - 1;
                        this.smstxt = this.smsExp + 's';
                        if (this.smsExp < 1) {
                            clearInterval(this.interN);
                            this.interN = 3 * 60;
                            this.smstxt = '获取验证码';
                        }
                    }, 1000);
                } else {
                    this.$message.error(resp.msg);
                }
            });
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    request('POST /manage/login', this.param).then(resp => {
                        if (resp.code === 0) {
                            this.$message.success('登录成功');
                            store.set('account', this.param.account);
                            store.set('token', resp.payload.token);
                            this.$router.push('/');
                        } else {
                            this.$message.error(resp.msg);
                        }
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.vcode {
    color: #666;
    cursor: pointer;
    position: absolute;
    width: 76px;
    top: 2px;
    right: 10px;
    text-align: right;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 48px;
    margin-bottom: 10px;
}
</style>