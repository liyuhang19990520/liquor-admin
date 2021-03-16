<template>
  <div class="routerBox">
    <div class="box-card">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.routerBox {
  height: 906px;
  box-sizing: border-box;
  overflow: auto;
  padding: 60px 20px 20px;
}
.box-card {
  // height: 100%;
  box-sizing: border-box;
  padding: 15px;
  min-height: 99%;
  width: 100%;
  background-color: #fff;
  box-shadow: darkgrey 0px 0px 10px 1px;//边框内阴影
}
</style>