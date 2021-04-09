<template>
    <div class="address-list">
        <van-nav-bar title="地址管理" left-text="返回" 
            left-arrow
            @click-left="back" />
            <Bg>
                <van-address-list
                    :list="list"
                    default-tag-text="默认" 
                    :switchable="false" 
                    @add="add"
                    @edit="edit"
                    /> 
            </Bg>
    </div>
</template>

<script>
import '../assets/less/addresslist.less';
import Bg from '../components/Bg.vue';

    export default {
        name: 'AddressList',

        data() {
            return {
                chosenAddressId: '1',
                // 地址列表数据
                list: [],
            };
        },

        components: {
            Bg
        },
        created() {
            this.getAddressListData();
        },
        methods: {
            back() {
                this.$router.push({name: 'My'});
            },
            //新增
            add(){
                this.$router.push({name: 'Address'});
            },
            //编辑
            edit({aid}){
                this.$router.push({name: 'Address', params: {aid}});
            },

            // 查询用户地址列表
            getAddressListData() {
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
                    method: 'GET',
                    url:this.baseUrl +'/findAddress',
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
                    if(res.data.code ==20000) {
                        //添加一个address属性
                        res.data.result.forEach(v => {
                            v.address =`${v.province}${v.city}${v.county}${v.addressDetail}`;
                            v.isDefault =Boolean(v.isDefault);
                        })
                        this.list =res.data.result;
                        console.log(res.data.result);
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
