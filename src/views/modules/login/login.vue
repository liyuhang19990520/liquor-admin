<template>
  <div class="login-container">
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="lizi"
    >
    </vue-particles>
    <div class="login-weaper animated bounceInDown" style="z-index: 100">
      <div class="login-left">
        <p class="title">{{ productName }}</p>
      </div>
      <div class="login-border">
        <div class="login-main">
          <h4 class="login-title">登陆账号</h4>
          <el-form
            ref="inputForm"
            :model="inputForm"
            :rules="rules"
            label-width="80px"
            @keyup.enter.native="login()"
            @submit.native.prevent
          >
            <el-form-item label="账号" prop="username">
              <el-input
                type="text"
                placeholder="请输入账号"
                v-model="inputForm.username"
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                type="password"
                placeholder="请输入密码"
                v-model="inputForm.password"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
              <el-input
                type="text"
                placeholder="请输入验证码"
                v-model="inputForm.captcha"
                maxlength="4"
                class="codeInput"
              />
              <div class="code" @click="refreshCode">
                <security :identifyCode="identifyCode"></security>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                class="login-submit"
                @click="login"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import security from "./security";
export default {
  components: {
    security,
  },
  data() {
    return {
      time: "",
      logo: "",
      productName: "后台管理平台",
      loading: false,
      inputForm: {
        username: "",
        password: "",
        uuid: "",
        captcha: "",
      },
      identifyCodes: "1234567890abcdef",
      identifyCode: "",
      rules: {
        username: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
      },
      captchaPath: "",
    };
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    // 验证码处理
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    // 刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
      console.log(this.identifyCode);
    },
    // 提交表单
    login() {
      this.$refs["inputForm"].validate((valid) => {
        if (valid) {
          if (this.inputForm.captcha == this.identifyCode) {
            this.loading = true;
            this.$http({
              url: "/adminlogin",
              method: "post",
              data: {
                username: this.inputForm.username,
                pass: this.inputForm.password,
              },
            }).then(({ data }) => {
              if (data && data.success) {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: "success",
                });
                this.$store.commit('setState',data.information)
                this.$router.push({
                  path: "/home",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: "error",
                });
                this.loading = false;




              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "验证码错误",
              type: "error",
            });
          }
        }
      });
    },
  },
};
</script>

<style>
@import "~@/assets/scss/login.scss";
</style>