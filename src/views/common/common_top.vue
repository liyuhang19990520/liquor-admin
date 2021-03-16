<template>
  <div class="header">
    <div>
      <img :src="$store.state.headImg" alt="" />
      <span>后台管理平台</span>
    </div>
    <el-button size="small" @click="exit()">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    exit() {
      this.$store.commit("setState", {});
      this.$router.push({ path: "/login" });
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
}
</style>