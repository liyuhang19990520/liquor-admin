<template>
  <div>
    <p>404</p>
    <p>抱歉，你访问的页面不存在</p>
    <el-button type="primary" @click="$router.push({path: '/home'})">返回首页</el-button>
  </div>
</template>

<style lang="scss" scoped>
div {
  text-align: center;
  p {
    &:first-of-type {
      font-size: 180px;
    }
    &:nth-of-type(2) {
      font-size: 30px;
      margin-bottom: 40px;
    }
  }
}
</style>