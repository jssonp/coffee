<template>
    <div class="search">
         <van-nav-bar>
        <template #left>
            <van-nav-bar
                left-text="返回" 
                left-arrow
                @click-left="back"
            />
        </template>
        <template #right>
            <van-search @search="search" v-model="name"
                show-action placeholder="请输入商品名称" shape="round" />
        </template>
        </van-nav-bar>

        <!-- 热门搜索 -->
        <!-- <div class="hotsearch">
            <p>热门搜索</p>
            <div class="h-search">
                <div class="one">咖啡</div>
                <div class="one">瑞纳冰</div>
                <div class="one">拿铁</div>
            </div>
        </div> -->

        <div class="menu-product">
            <div class="m-pro-item" v-for="(item,index) in products" 
            :key="index" @click="goDetail(item.pid)">
                <div class="pro-img">
                    <img class="auto-img" :src="item.smallImg" alt="">
                </div>

                <div class="text">
                    <div class="pro-text">
                        <div class="pro-name">{{item.name}}</div>
                        <div class="pro-enname">{{item.enname}}</div>
                    </div>
                </div>
                <div class="price">￥{{item.price}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/search.less'
    export default {
        name: 'Serch',
        data() {
            return {
                // 搜索商品关键字
                name: '',
                //商品列表
                products: []
            }
        },

        created() {
        },
        methods: {
            back() {
                this.$router.go(-1);
            },

            // 搜索
            search() {
                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'GET',
                    url:this.baseUrl +'/search',
                    params: {
                        appkey: this.appkey,
                        name: this.name
                    }
                }).then(res => {
                    console.log('res search==> ', res);
                    this.$toast.clear();
                    if(res.data.code =='Q001') {
                        this.products = res.data.result;
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