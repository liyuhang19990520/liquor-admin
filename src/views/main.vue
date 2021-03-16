<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <MainTop />
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <MainLeft />
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }"
            >首页</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/user'"
            >用户管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/skillposts'"
            >帖子管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/posts'"
            >帖子管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/skillposts'"
            >技术贴管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/posts'"
            >社区贴管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/personal'"
            >个人中心</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/notices'"
            >公告管理</el-breadcrumb-item
          >
          <el-breadcrumb-item v-if="$route.path == '/comments'"
            >评论管理</el-breadcrumb-item
          >
        </el-breadcrumb>
        <MainCenter />
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import MainTop from "@/views/common/common_top.vue";
import MainLeft from "@/views/common/common_left.vue";
import MainCenter from "@/views/common/common_center.vue";
export default {
  data() {
    return {};
  },
  components: {
    MainTop,
    MainLeft,
    MainCenter,
  },
};
</script>


<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #1890ff;
}
.el-main {
  background-color: #f1f2f5;
  padding: 0;
  position: relative;
  .el-breadcrumb {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    line-height: 40px;
    font-size: 14px;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 100;
  }
}
.el-aside {
  background-color: #181922;
}
</style>