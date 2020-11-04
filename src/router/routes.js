import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
     
      // 测试页
      {
        path: 'demo',
        name: 'demo',
        meta: {
          auth: true,
          title: '测试'
        },
        component: () => import('@/views/demo/page4/index')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
   // 商品管理
   {
    path:'/goodsmanage',
    name:"Goodsmanage",
    component: layoutHeaderAside,
    meta:{
      title:'商品管理'
    },
    children:[
      {
        path: 'categoryList',
        component: () => import('@/views/goods/categoryList'),
        name: 'CategoryList',
        meta: {
          title: '商品分类',
          auth: true
        }
      },
      {
        path:'goodsList',
        component:() => import('@/views/goods/goodsList'),
        name:'GoodsList',
        meta:{
          title:'商品列表',
          auth:true
        }
      }
    ]
  },
  // 权限管理-菜单列表
  {
    path: '/permission',
    component: layoutHeaderAside,
    children: [
      {
        path: 'menu',
        name: 'menelist',
        meta: {
          title: '菜单管理',
          auth: true
        },
        component: () => import('@/views/authmanage/menulist')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色',
          auth: true
        },
        component: () => import('@/views/authmanage/role')
      },
      {
        path: 'user',
        name: 'User',
        meta: {
          title: '用户管理',
          auth: true
        },
        component: () => import('@/views/authmanage/user')
      }
    ]
  },
   // 系统配置
   {
    path:'/configSystem',
    component: layoutHeaderAside,
    meta:{
      title:'系统配置'
    },
    children:[
      {
        path: 'configSystem',
        component: () => import('@/views/systemConfig/configSystem'),
        name: 'ConfigSystem',
        meta: {
          title: '系统配置',
          auth: true
        }
      }
    ]
  },
  // 门店管理
  {
    path:'/storemanage',
    component: layoutHeaderAside,
    meta:{
      title:'门店管理'
    },
    children:[
      {
        path: 'storeList',
        component: () => import('@/views/store/storeList'),
        name: 'StoreList',
        meta: {
          title: '门店列表',
          auth: true
        }
      }
    ]
  },
  // 订单管理
  {
    path:'/order',
    component: layoutHeaderAside,
    meta:{
      title:'订单管理'
    },
    children:[
      {
        path: 'orderlist',
        component: () => import('@/views/order/orderList'),
        name: 'Orderlist',
        meta: {
          title: '订单列表',
          auth: true
        }
      }
    ]
  },
  // 公告
  {
    path:'/notice',
    component: layoutHeaderAside,
    meta:{
      title:'公告管理'
    },
    children:[
      {
        path: 'noticeList',
        component: () => import('@/views/notice/notice'),
        name: 'Notice',
        meta: {
          title: '公告列表',
          auth: true
        }
      }
    ]
  },
  // 客服
  {
    path:'/server',
    component: layoutHeaderAside,
    meta:{
      title:'客服管理'
    },
    children:[
      {
        path: 'serverlist',
        component: () => import('@/views/server/server'),
        name: 'Server',
        meta: {
          title: '客服列表',
          auth: true
        }
      }
    ]
  },
   // 商家合作
   {
    path:'/cooperate',
    component: layoutHeaderAside,
    meta:{
      title:'商家合作'
    },
    children:[
      {
        path: 'cooperatelist',
        component: () => import('@/views/cooperate/cooperate'),
        name: 'Cooperate',
        meta: {
          title: '商家列表',
          auth: true
        }
      }
    ]
  },
]
/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
