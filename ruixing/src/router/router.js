//Main组件的二级路由
const MainRoutes =[
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component: () => import('../views/Shopbag.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My.vue')
  },
]

// 导出路由
export const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    // 二级路由
    children: MainRoutes
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/addressList',
    name: 'AddressList',
    component: () => import('../views/AddressList.vue')
  },
  {
    // :aid? 其中? 号aid可以传递或者不传递
    path: '/address/:aid?',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Pay.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/Like.vue')
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('../views/Security.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('../views/Forget.vue')
  }
]