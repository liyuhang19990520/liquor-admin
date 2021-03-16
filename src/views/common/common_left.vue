<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#181922"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="defaultActive"
          router
        >
          <el-menu-item index="/user">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/skillposts">
              <i class="el-icon-collection"></i>
              <span slot="title">技术贴管理</span>
            </el-menu-item>
            <el-menu-item index="/posts">
              <i class="el-icon-receiving"></i>
              <span slot="title">社区帖管理</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/personal">
            <i class="el-icon-s-home"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/notices">
            <i class="el-icon-menu"></i>
            <span slot="title">分类管理</span>
          </el-menu-item>
          <el-menu-item index="/comments">
            <i class="el-icon-s-comment"></i>
            <span slot="title">数据展示</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultActive: "",
    };
  },
  watch: {
    //监听路由保持高亮
    $route: {
      handler(newVal) {
        //这个方法名就是为了输出新值和旧值，只要改变就触发
        this.defaultActive = newVal.path;
      },
      immediate: true, //当这个属性true时输出刚开始的新值和旧值
      deep: true, //当这个属性为true时对象的属性发生变化也可以监听到
    },
  },
};
</script>
<style lang="scss" scoped>
.el-menu {
  width: 200px;
  padding-top: 20px;
}
.el-col {
  overflow: hidden;
}
</style>