<template>
    <div class="login">
        <div class="whole">
            <RXnav></RXnav>
                <div class="login-box">
                    <div class="login-title-box">
                        <div class="login-text">乐享咖啡--带给回味心灵的香甜。</div>
                        <div class="login-title">找回密码 ！</div>
                        <div class="login-sub">Find  password</div>
                    </div>

                    <div class="form-box">
                        <div class="login-message">
                            <van-field v-model="userLoginInfo.phone" label="邮箱" placeholder="邮箱" />
                            <van-field label="验证码" placeholder="验证码" />
                        </div>
                        

                        <div class="forget"><span>已有账号,立即登录</span></div>

                        <div class="btn-box">
                            <van-button round block color="#9C623A" @click="login">登&nbsp;&nbsp;&nbsp;录</van-button>
                            <van-button class="register-btn" type="default" block round @click="openPoPup">注&nbsp;&nbsp;&nbsp;册</van-button>
                        </div>
                    </div>      
                </div>
            
        </div>  
    </div>
</template>

<script>
import '../assets/less/login.less';

import RXnav from '../components/RXnav.vue';

import {utils} from '../assets/js/utils.js';
// import { Toast } from 'vant';
import {mapMutations} from 'vuex';

    export default {
        name: 'Login',
        data() {
            return {
                //用户登录信息
                userLoginInfo:{
                    phone: '',
                    password: ''
                },

                //用户注册信息
                userRegisterInfo: {
                    phone: '',
                    password: '',
                    nickName: ''
                },

                // 是否显示弹出层
                isOpen: false,
                isText: false
            };
        },
        created() {
            this.changeShopbagCount(0);
            this.changeIsLoadShopbagCount(false);
        },
        components: {
            RXnav
        },

        methods: {
            ...mapMutations(['changeShopbagCount','changeIsLoadShopbagCount']),
            //显示弹出层
            openPoPup() {
                this.isOpen =true;
            },

            //注册
            register(){
                let o ={
                    phone: {
                        value: this.userRegisterInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.userRegisterInfo.password,
                        reg: /^[A-Za-z]\w{5,19}$/,
                        errorMsg: '密码支持字母数字组合且首字母必须大写'
                    },
                    nickName: {
                        value: this.userRegisterInfo.nickName,
                        reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,9}$/,
                        errorMsg: '昵称支持汉字字母数字组合'
                    }
                }

                //验证表单
                //如果不通过，拦截注册请求
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起注册请求
                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true,
                    duration: 0
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url:this.baseUrl +'/register',
                    // 如果POST请求,参数需要挂载点
                    data: {
                        appkey: this.appkey,
                        nickName: this.userRegisterInfo.nickName,
                        password: this.userRegisterInfo.password,
                        phone: this.userRegisterInfo.phone
                    }
                }).then(res => {
                    console.log('res => ',res);
                    this.$toast.clear();
                    if(res.data.code ==100) {
                        // 关闭注册弹出层
                        this.isOpen =false;
                        //清除用户注册信息
                        for (let key in this.userRegisterInfo) {
                            this.userRegisterInfo[key] ='';
                        }
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
            },

            //登录
            login(){
                let o ={
                    phone: {
                        value: this.userLoginInfo.phone,
                        reg: /^1[3-9]\d{9}$/,
                        errorMsg: '手机号格式不正确'
                    },
                    password: {
                        value: this.userLoginInfo.password,
                        reg: /^[A-Za-z]\w{5,19}$/,
                        errorMsg: '密码支持字母数字组合且首字母必须大写'
                    },
                }

                //验证表单
                //如果不通过，拦截注册请求
                if (!utils.validForm(o)) {
                    return;
                }

                // 发起登录请求
                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });

                this.axios({
                    // 请求方式
                    method: 'POST',
                    url:this.baseUrl +'/login',
                    // 如果POST请求,参数需要挂载点
                    data: {
                        appkey: this.appkey,
                        password: this.userLoginInfo.password,
                        phone: this.userLoginInfo.phone
                    }
                }).then(res => {
                    this.$toast.clear();
                    
                    if(res.data.code ==200) {
                        //登录成功 保存token,用于下次访问用户信息的
                        this.$cookies.set('tokenString', res.data.token, 'id');

                        //跳转其它页面
                        this.$router.push({name: 'Home'});
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
            },
            // 切换输入框的类名
            toggleType() {
                this.isText = !this.isText;
            }
        }
    }
</script>
