<template>
    <div class="my">
        <div class="my-bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
            <van-uploader :after-read="uploadBg" />
        </div>
        <div class="my-box">
            <div class="my-info">
                <div class="my-img">
                    <img class="auto-img" :src="userInfo.userImg" alt="">
                    <div class="up-img">
                        <van-uploader :max-size="500 * 1024" :after-read="uploadAvatar" />
                    </div>
                    
                </div>
                <div class="my-text">
                    <div class="my-name one-text">{{userInfo.nickName}}</div>
                    <div class="my-desc one-text">{{userInfo.desc ? userInfo.desc : '本人不喜欢留言'}}</div>
                </div>
            </div>

            <div class="my-list">
                <van-cell @click="goPage(item.name)" :title="item.title" is-link title-style="color: #666" 
                v-for="(item,index) in cellData" :key="index" />
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/my.less'
    export default {
        name: 'My',
        data() {
            return {
                cellData: [
                    {title: '个人资料', name: 'Account'},
                    {title: '我的订单', name: 'Order'},
                    {title: '我的收藏', name: 'Like'},
                    {title: '地址管理', name: 'AddressList'},
                    {title: '安全中心', name: 'Security'},
                ],
                userInfo: {}
            };
        },

        created() {
            this.getUserInfo();
        },

        methods: {
            goPage(name){
                this.$router.push({name})
            },

            // 获取用户信息
            getUserInfo() {
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
                    url:this.baseUrl +'/findMy',
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
                    if(res.data.code =='A001') {
                        this.userInfo =res.data.result[0];
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

            // 上传头像
            uploadAvatar(file) {
                // console.log('file==>',file);
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
                            this.userInfo.userImg = res.data.userImg;
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

            // 更改背景图
            uploadBg(file) {
                
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
                    url:this.baseUrl +'/updateUserBg',
                    data: {
                        appkey: this.appkey,
                        tokenString,
                        imgType: type,
                        serverBase64Img: base64
                    }
                }).then(res => {
                    console.log("res uploadBg==> ", res);
                    this.$toast.clear();
                    if(res.data.code ==700){
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        });
                        return this.$router.push({name: "Login"})
                    }
                    if(res.data.code =='I001') {
                        if(res.data.result[0] ==1) {
                            this.userInfo.userBg = res.data.userBg;
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
        },
    }
</script>
