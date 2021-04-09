<template>
    <div class="security">
        <van-nav-bar
            title="安全中心"
            left-text="返回" 
            left-arrow
            @click-left="back"
        />
        <Bg>
            <van-cell title="修改密码" is-link @click="openPoPup" />
            <van-cell title="注销账号" is-link @click="destroyAccount" />
        </Bg>
         <van-button round block color="#9C623A" @click="logout">退出登录</van-button>

         <!-- 弹出注册 -->
        <van-popup v-model="isOpen" position="bottom" closeable>
            <div class="register-box">
                <div class="register-title">修改密码</div>
                <div class="form-box">
                    <van-field v-model="oldPassword" :type="isText ? 'text':'password'" label="旧密码" 
                placeholder="旧密码(首字符必须为字母)" 
                :right-icon="isText ? 'eye-o' :'closed-eye'" @click-right-icon="toggleType"/>

                    <van-field v-model="password" :type="istext ? 'text':'password'" label="新密码" 
                placeholder="新密码(首字符必须为字母)" 
                :right-icon="istext ? 'eye-o' :'closed-eye'" @click-right-icon="toggle"/>
                <div class="btn-box">
                    <van-button round block color="#9C623A" @click="commit">提&nbsp;&nbsp;&nbsp;交</van-button>
                </div>
            </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import '../assets/less/security.less'
import Bg from '../components/Bg.vue'
    export default {
        name: "Security",

        data(){
            return {
                    password: '',
                    oldPassword: '',
                // 是否显示弹出层
                isOpen: false,
                isText: false,
                istext: false
            }
            
        },

        components: {
            Bg
        },

        methods: {
            //返回上一级
            back(){
                this.$router.go(-1);
            },

            //显示弹出层
            openPoPup() {
                this.isOpen =true;
            },

            // 切换输入框的类名
            toggleType() {
                this.isText = !this.isText;
            },
            // 切换输入框的类名
            toggle() {
                this.istext = !this.istext;
            },

            //注销账号
            destroyAccount() {
                this.$dialog.confirm({
                    title: '注册账号',
                    message: '是否确定注销账号，一旦注销无法恢复',
                    confirmButtonColor: "#9C623A"
                }).then(() => {
                    let tokenString =this.$cookies.get('tokenString');
                if(!tokenString) {
                    console.log("tokenString不存在")
                    return this.$router.push({name: 'Login'});
                }

                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'POST',
                    url:this.baseUrl +'/destroyAccount',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(res => {
                    console.log("res destroyAccount==> ", res);
                    this.$toast.clear();

                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='G001') {
                        localStorage.removeItem('__tk');
                        this.$router.push({name: 'Login'});
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    })
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
                }).catch((err) => {
                    console.log("err ==>  ", err);
                })
            },

            // 退出登录
            logout() {
                this.$dialog.confirm({
                    title: '退出登录',
                    message: '是否确定退出登录，一旦退出无法恢复',
                    confirmButtonColor: "#9C623A"
                }).then(() => {
                    let tokenString =this.$cookies.get('tokenString');
                if(!tokenString) {
                    console.log("tokenString不存在")
                    return this.$router.push({name: 'Login'});
                }

                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'POST',
                    url:this.baseUrl +'/logout',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(res => {
                    console.log("res logout==> ", res);
                    this.$toast.clear();

                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='F001') {
                        this.$router.push({name: 'Login'})
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    })
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
                }).catch((err) => {
                    console.log("err ==>  ", err);
                })
            },

            //修改密码
            commit() {
                if(this.password ==this.oldPassword){
                    this.$toast.message("新密码和旧密码不能一样");
                    return;
                }
                let tokenString =this.$cookies.get('tokenString');
                if(!tokenString) {
                    console.log("tokenString不存在")
                    return this.$router.push({name: 'Login'});
                }

                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'POST',
                    url:this.baseUrl +'/updatePassword',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        password: this.password,
                        oldPassword: this.oldPassword
                    }
                }).then(res => {
                    console.log("res changepassword==> ", res);
                    this.$toast.clear();

                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='E001') {
                        localStorage.removeItem('__tk');
                        this.$router.push({name: 'Login'});
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    })
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
            }
        }
    }
</script>