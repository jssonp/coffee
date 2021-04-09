<template>
    <div class="account">
        <van-nav-bar
            title="个人资料"
            left-text="返回" 
            left-arrow
            @click-left="back"
        />
        <Bg>
            <van-cell title="头像" :center="true">
                <div>
                    <div class="user-img">
                        <img class="auto-img" :src="accountInfo.userImg" alt="">
                        <van-uploader class="upload-box" :after-read="uploadUserImg" />
                    </div>
                </div>
            </van-cell>
            <van-cell title="用户id" :center="true">{{accountInfo.userId}}</van-cell>
            <van-cell title="手机号" :center="true">{{accountInfo.phone}}</van-cell>
            <van-cell title="昵称" :center="true">
                <van-field v-model="accountInfo.nickName" class="field-box" 
                placeholder="请输入昵称" @change="updateNickName" maxlength="12" />
            </van-cell>
            <div class="desc-box">
                <div class="desc-content">
                    <van-field
                        v-model="accountInfo.desc"
                        rows="2"
                        autosize
                        label="简介"
                        type="textarea"
                        maxlength="30"
                        placeholder="请输入简介"
                        show-word-limit
                        @change="updateDesc"
                        input-align="right" />
                </div>
            </div>
        </Bg>
    </div>
</template>

<script>
import Bg from '../components/Bg.vue'
import '../assets/less/account.less'
    export default {
        name: "Account",

        components: {
            Bg
        },
        data() {
            return {
                accountInfo: {
                    nickName: '',
                    desc: '',
                    phone: '',
                    userImfg: '',
                }
            }
        },
        created(){
            //获取个人资料
            this.getAccountInfo();
        },

        methods: {
            //返回上一级
            back(){
                this.$router.go(-1);
            },

            //获取个人资料
            getAccountInfo() {
                let tokenString =this.$cookies.get('tokenString');

                // 判断有没有登录
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
                    method: 'GET',
                    url:this.baseUrl +'/findAccountInfo',
                    params: {
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='B001') {
                        let data =res.data.result[0];
                        if(data.desc == ''){
                            data.desc ="本人不喜欢评论"
                        }
                        this.accountInfo =data;
                    } else{
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

            // 上传用户头像
            uploadUserImg(file) {
                // 限制上传文件类型
                let types =['png','gif','jpg','jpeg'];
                //截取上传图片的类型
                let type =file.file.type.split('/')[1];
                // console.log("type ==>", type);

                if(types.indexOf(type) ==-1){
                    return this.$toast({
                        message: '文件类型错误',
                        forbidClick: true,
                        duration: 1000
                    })
                }

                //处理base64
                let base64 =file.content.replace(/data:image\/[A-Za-z]+;base64,/,'')

                // 上传图片请求
                let tokenString =this.$cookies.get('tokenString');

                // 判断有没有登录
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
                    url:this.baseUrl +'/updateAvatar',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType: type,
                        serverBase64Img: base64
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='H001') {
                        if(res.data.result[0] ==1) {
                            this.accountInfo.userImg = res.data.userImg;
                        }
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
            },

            //修改昵称
            updateNickName() {
                // 如果
                if(!this.accountInfo.nickName) {
                    this.$toast('昵称不能为空');
                }

                let tokenString =this.$cookies.get('tokenString');

                // 判断有没有登录
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
                    url:this.baseUrl +'/updateNickName',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        nickName: this.accountInfo.nickName
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    else{
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

            //修改简介
            updateDesc() {
                let tokenString =this.$cookies.get('tokenString');

                // 判断有没有登录
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
                    url:this.baseUrl +'/updateDesc',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        desc: this.accountInfo.desc
                    }
                }).then(res => {
                    this.$toast.clear();
                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    else{
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
            }
        }
    }
</script>

<style lang="less" scoped>

</style>