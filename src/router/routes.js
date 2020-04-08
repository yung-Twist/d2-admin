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
      },
      // 权限管理-菜单列表
      {
        path: '/permission/menu',
        name: 'menelist',
        meta: {
          title: '菜单管理',
          auth: true
        },
        component: () => import('@/views/authmanage/menulist')
      },
      {
        path: '/permission/role',
        name: 'Role',
        meta: {
          title: '角色',
          auth: true
        },
        component: () => import('@/views/authmanage/role')
      },
      {
        path: '/permission/user',
        name: 'User',
        meta: {
          title: '用户管理',
          auth: true
        },
        component: () => import('@/views/authmanage/user')
      }
    ]
  }
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
