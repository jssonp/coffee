<template>
    <div class="like">
        <van-nav-bar
            title="我的收藏"
            left-text="返回" 
            left-arrow
            @click-left="back"
        />
        <Bg>
            <div class="like-box" v-if="likeProduct.length >0">
                <div class="like-item" v-for="(item, index) in likeProduct" 
                :key="index" @click="goDetail(item.pid)">
                    <div>
                        <img class="auto-img" :src="item.smallImg" alt="">
                        <div class="pro-name one-text">{{item.name}}</div>
                        <div class="pro-enname one-text">{{item.enname}}</div>
                        <div class="like-bottom">
                            <div class="pro-price">￥{{item.price}}</div>
                            <div class="delete" @click.stop="removeLikeProduct(item.pid,index)">
                                <van-icon name="delete" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <van-empty description="没有收藏商品" />
            </div>
        </Bg>
    </div>
</template>

<script>
import '../assets/less/like.less'
import Bg from '../components/Bg.vue'
    export default {
        name: "Like",

        components: {
            Bg
        },
        data() {
            return {
                likeProduct: []
            }
        },

        created() {
            // 获取收藏商品
            this.getLikeProduct()
        },

        methods: {
            //返回上一级
            back(){
                this.$router.go(-1);
            },

            // 获取收藏商品
            getLikeProduct() {
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
                    url:this.baseUrl +'/findAllLike',
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
                    if(res.data.code ==2000){
                        this.likeProduct =res.data.result;
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

            // 点击查看商品详情
            goDetail(pid) {
                this.$router.push({name: "Detail", params: {pid}})
            },

            // 删除收藏商品
            removeLikeProduct(pid, index) {
                let tokenString =this.$cookies.get('tokenString');
                console.log(tokenString);
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
                    url:this.baseUrl +'/notlike',
                    data: {
                        appkey: this.appkey,
                        pid,
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
                    if(res.data.code ==900) {
                        if(res.data.result ===1){
                            this.likeProduct.splice(index, 1);
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
            }
        }
    }
</script>
