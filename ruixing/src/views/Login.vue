<template>
    <div class="login">
        <div class="whole">
            <RXnav></RXnav>
            <div class="login-box">
                <div class="login-title-box">
                    <div class="login-text">乐享咖啡--带给回味心灵的香甜。</div>
                    <div class="login-title">欢迎回来</div>
                    <div class="login-sub">Please login to you accounts</div>
                </div>

                <div class="form-box">
                    <div class="login-message">
                        <van-field v-model="userLoginInfo.phone" label="手机号" placeholder="请输入手机号 (11位)" />
                        <van-field v-model="userLoginInfo.password" :type="isText ? 'text':'password'" label="密码" placeholder="请输入密码" 
                    :right-icon="isText ? 'eye-o' :'closed-eye'" @click-right-icon="toggleType"/>
                    </div>
                    

                    <div class="forget"><span @click="forget">忘记密码？</span></div>

                    <div class="btn-box">
                        <van-button round block color="#9C623A" @click="login">登&nbsp;&nbsp;&nbsp;录</van-button>
                        <van-button class="register-btn" type="default" block round @click="openPoPup">注&nbsp;&nbsp;&nbsp;册</van-button>
                    </div>
                </div>      
            </div>

            <!-- 弹出注册 -->
            <van-popup v-model="isOpen" position="bottom" closeable>
                <div class="register-box">
                    <div class="register-title">注册</div>
                        <div class="form-box">
                        <van-field v-model="userRegisterInfo.phone" label="手机号 (11位)" placeholder="请输入手机号" />
                        <van-field v-model="userRegisterInfo.password" :type="isText ? 'text':'password'" label="密码" 
                        placeholder="请输入密码（6-16位)" 
                        :right-icon="isText ? 'eye-o' :'closed-eye'" @click-right-icon="toggleType"/>

                        <van-field v-model="userRegisterInfo.nickName" label="昵称" placeholder="请输入昵称(1-9位)" />

                        <div class="btn-box">
                            <van-button round block color="#9C623A" @click="register">注&nbsp;&nbsp;&nbsp;册</van-button>
                        </div>
                    </div>
                </div>
            </van-popup>
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
            },

            // 忘记密码
            forget() {
                this.$router.push({name: 'Forget'});
            }
        }
    }
</script>
