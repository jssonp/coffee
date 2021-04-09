<template>
    <div class="menu">
        <div class="menu-nav">
            <div class="menu-serch">
                <van-search placeholder="请输入商品名称" shape="round" @click="searchFocus" />
            </div>
            
            <div class="menu-optain">

                <div class="menu-item" v-for="(item,index) in menuOptions" 
                :key="index" @click="toggleMenu(index,item.type)">
                    <div class="m-item">
                        <div class="m-icon">
                            <img class="auto-img" :src="menuIndex == index ? item.activeIcon : item.inactiveIcon" alt="">
                        </div>
                        <div class="m-text" :class="{active: menuIndex == index}">{{item.title}}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="menu-product">
            <div class="m-pro-item" v-for="(item,index) in productData" 
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
import '../assets/less/menu.less'
    export default {
        name: 'Menu',
        data() {
            return {
                menuIndex: 0,
                 menuOptions: [
                    {
                       title: '推荐',
                       inactiveIcon: require('../assets/images/icons_09.gif'),
                       activeIcon: require('../assets/images/icons_21.gif')
                    },
                    {
                       title: '拿铁',
                       inactiveIcon: require('../assets/images/icons_05.gif'),
                       activeIcon: require('../assets/images/icons_19.gif')
                    },
                    {
                       title: '咖啡',
                       inactiveIcon: require('../assets/images/icons_03.gif'),
                       activeIcon: require('../assets/images/icons_18.gif')
                    },
                    {
                       title: '瑞纳冰',
                       inactiveIcon: require('../assets/images/icons_07.gif'),
                       activeIcon: require('../assets/images/icons_20.gif')
                    },
                    {
                       title: '水果茶',
                       inactiveIcon: require('../assets/images/icons_11.gif'),
                       activeIcon: require('../assets/images/icons_22.png')
                    },
                ],

                // 商品数据
                productData: []
            }
        },

        created() {
            this.getTypes()
        },

        methods: {
            // 点击切换类名
            toggleMenu(index,type) {
                if(this.menuIndex ==index){
                    return;
                }
                this.menuIndex =index;
                this.getProductByType(type);
            },

            // 获取商品类型
            getTypes() {
                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'GET',
                    url:this.baseUrl +'/type',
                    params: {
                        appkey: this.appkey,
                    }
                }).then(res => {
                    console.log("res getTypes ==> ", res);
                    this.$toast.clear();

                    if(res.data.code ==400){
                        let data =res.data.result;
                        data.unshift({
                            type: 'isHot',
                            typeDesc: '推荐',
                        })
                        this.menuOptions.map(v => {
                            for(let i =0; i<data.length; i++){
                                if(v.title ==data[i].typeDesc) {
                                    v.type =data[i].type;
                                    break;
                                }
                            }
                        })
                        let type =this.menuOptions[this.menuIndex].type;
                        this.getProductByType(type);
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
            },

            // 根据类型获取商品
            getProductByType(type) {
                let params ={
                    appkey: this.appkey
                }
                if(type =="isHot") {
                    params.key="isHot";
                    params.value =1;
                } else {
                    params.key ='type';
                    params.value = type;
                }
                this.$toast.loading({
                    message: '加载中....',
                    forbidClick: true, 
                    duration: 0
                });
                this.axios({
                    // 请求方式
                    method: 'GET',
                    url:this.baseUrl +'/typeProducts',
                    params,
                }).then(res => {
                    console.log("res getProductByType ==> ", res);
                    this.$toast.clear();

                    if(res.data.code ==500){
                        this.productData =res.data.result;
                    }
                }).catch(err => {
                    this.$toast.clear();
                    console.log('err ==> ', err)
                })
            },

            // 查看商品详情
            goDetail(pid) {
                this.$router.push({name: 'Detail' , params: {pid}});
            },

            // 瘦素框获取焦点
            searchFocus() {
                this.$router.push({name: 'Search'});
            }
        }
    }
</script>
