import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/main.vue'
import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', component: () => import('@/views/modules/login/login.vue'), meta: { title: '登录' } },
    {
      path: '/home', component: Home, redirect: '/welcome', children: [
        { path: '/welcome', component: () => import('@/views/modules/show'), meta: { title: '首页' } },
        { path: '/comments', component: () => import('@/views/modules/comments/CommentList'), meta: { title: '评论管理' } },
        { path: '/notices', component: () => import('@/views/modules/notices/NoticesList'), meta: { title: '公告管理' } },
        { path: '/personal', component: () => import('@/views/modules/personal/PersonalList'), meta: { title: '个人管理' } },
        { path: '/posts', component: () => import('@/views/modules/posts/PostsList'), meta: { title: '帖子管理' } },
        { path: '/skillposts', component: () => import('@/views/modules/skillposts/SkillPostsList'), meta: { title: '技术贴管理' } },
        { path: '/user', component: () => import('@/views/modules/user/UserList'), meta: { title: '用户管理' } },
        { path: '/404', component: () => import('@/views/layout/404'), meta: { title: '404未找到' } },
      ]
    },
    { path: '/*', redirect: '/404' }
  ]
})

//全局解析守卫，当组件内容全部渲染才触发
router.beforeResolve((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title
  }else{
    document.title = '正在加载'
  }

  if (to.path != '/login' && !store.state._id) {
    next({ path: '/login' });
  }
  if (to.path == '/' && store.state._id) {
    next('/home')
  }
  next()
})


//push
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

export default router