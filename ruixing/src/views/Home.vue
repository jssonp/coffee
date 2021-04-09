<template>
  <div class="home">
    <!-- 头部 -->
    <van-nav-bar>
      <template #left>
        <div class="home-title">
          <div>{{time}}</div>
          <div v-if="show" class="username one-text" 
          >{{userInfo.nickName}}</div>
          <div v-else class="userimg">
            <img @click="gologin" class="auto-img" src="../assets/images/tourist.png" alt="">
          </div>
        </div>
      </template>
      <template #right>
        <van-search placeholder="请输入商品名称" shape="round" @click="searchFocus" />
      </template>
    </van-nav-bar>

      <!-- 轮播图 -->
     <van-swipe @change="changeCurrentIndex" :autoplay="3000">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img @click="viewProduct(item.pid)" class="auto-img" :src="item.bannerImg">
      </van-swipe-item>

      <template #indicator>
        <div class="indicator-box">
          <div class="indicator-item" :class="{active: currentIndex ==i}" 
          v-for="(v,i) in bannerData.length" :key="i"></div>
        </div>
      </template>
    </van-swipe>
    
    <div class="product-box">
      <div class="line">
        <span>热卖商品</span>
      </div>
      <div class="product-items">
        <Product class="product-item" v-for="(item,index) in hotProduct" 
        :key="index" :product="item">
          <template #hot>
            <div class="hot-box">hot</div>
          </template>
        </Product>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/less/home.less'
import Product from '../components/Product.vue'

export default {
  name: 'Home',
  data(){
    return {
      currentIndex: 0,
      cardIndex: 0,

      bannerData: [],
      show: false,

      // 热卖商品数据
      hotProduct: [],
      //用户信息
      userInfo: [],
      // 获取时间
      time: '',
    }
  },

  created(){
    // 生成data,但是没有$el (没有生成<div id="app"></div>)
    this.getBannerData();
    this.getHotProduct();
    // 查询用户信息
    this.getUserInfo();
    // 获取时间
    this.gettime();
  },

  components: {
    Product
  },

  methods: {
    //切换轮播图
    changeCurrentIndex(index) {
      this.currentIndex =index;
    },

    // 获取轮播图类型
    getBannerData() {
      this.$toast.loading({
        message: '加载中....',
        forbidClick: true, 
        duration: 0
      });

      this.axios({
          // 请求方式
          method: 'GET',
          url:this.baseUrl +'/banner',
          
          params: {
              appkey: this.appkey,
          }
      }).then(res => {
          this.$toast.clear();
          if(res.data.code ==300) {
              //登录成功 保存token,用于下次访问用户信息的
              this.bannerData=res.data.result;
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

    // 获取首页热卖商品
    getHotProduct() {
      this.$toast.loading({
        message: '加载中....',
        forbidClick: true, 
        duration: 0
      });

      this.axios({
          // 请求方式
          method: 'GET',
          url:this.baseUrl +'/typeProducts',
          
          params: {
              appkey: this.appkey,
              key: 'isHot',
              value: 1
          }
      }).then(res => {
          this.$toast.clear();
          if(res.data.code ==500) {
              //登录成功 保存token,用于下次访问用户信息的
              this.hotProduct=res.data.result;
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

    // 查看详情
    viewProduct(pid){
      this.$router.push({name: 'Detail', params: {pid}});
    },

    // 获取用户信息
    getUserInfo() {
      let tokenString =this.$cookies.get('tokenString');

      // 判断有没有登录
      if(!tokenString) {
        this.show =false;
          return;
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
          if(res.data.code =='A001') {
              this.userInfo =res.data.result[0];
              this.show =true;
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

    //点击回到登录页面
    gologin() {
      this.$router.push({name: 'Login'});
    },

    // 搜索框获取焦点
    searchFocus() {
      this.$router.push({name: 'Search'});
    },

    // 获取当前时间
    gettime() {
      let dt =new Date();
      let hour =dt.getHours();
      console.log("hour ==> ", hour)
      if(hour <12) {
        this.time ="早上好"
      }else if(hour < 18){
        this.time ="下午好"
      }else if(hour < 24){
        this.time ="晚上好"
      }else if(hour < 6){
        this.time="夜深了！"
      }
    },
  }
}
</script>