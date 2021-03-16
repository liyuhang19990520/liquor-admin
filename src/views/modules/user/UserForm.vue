<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="25%"
      @closed="closed"
    >
      <el-form
        :model="inputForm"
        ref="inputForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="method == 'view'"
      >
        <el-form-item
          label="头像"
          prop="headImg"
          :rules="[{ required: true, message: '请选择头像', trigger: 'blur' }]"
        >
          <vue-upload-imgs
            compress
            :before-read="beforeRead"
            :limit="1"
            :type="0"
            @exceed="exceed"
            v-model="files"
            :disabled="method == 'view' ? true : false"
          >
          </vue-upload-imgs>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: validator.isMobile, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="inputForm.username"
            style="width: 250px"
            :disabled="method != 'add' ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="nickname"
          :rules="[{ required: true, message: '请输入昵称', trigger: 'blur' }]"
        >
          <el-input
            v-model="inputForm.nickname"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="[
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              validator: validator.isPass,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="inputForm.password"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          prop="sex"
          :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]"
        >
          <el-select
            v-model="inputForm.sex"
            placeholder="请选择性别"
            style="width: 200px"
          >
            <el-option label="男" value="男"> </el-option>
            <el-option label="女" value="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="生日"
          prop="birth"
          :rules="[{ required: true, message: '请选择生日', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="inputForm.birth"
            type="datetime"
            format="yyyy-MM-dd"
            placeholder="选择日期时间"
            style="width: 200px"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()" v-if="method != 'view'"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      dialogVisible: false, //对话框显示开关
      title: "", //标题显示
      method: "", //判断是调用的场景
      imageUrl: "",
      inputForm: {
        //表单
        _id: "",
        username: "",
        nickname: "",
        password: "",
        sex: "",
        birth: "",
        headImg: "",
      },
    };
  },
  methods: {
    //初始化
    init(method, id) {
      this.method = method;
      this.inputForm._id = id;
      if (method == "view") {
        this.title = "查看用户信息";
      } else if (method == "add") {
        this.title = "添加用户信息";
      } else if (method == "edit") {
        this.title = "修改用户信息";
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (method == "view" || method == "edit") {
          //修改或查看
          this.$http({
            url: "/userDetail",
            method: "get",
            params: {
              id,
            },
          }).then(({ data }) => {
            if (data && data.success) {
              this.inputForm = this.recover(this.inputForm, data.information);
              if (this.files[0] && this.files[0].url) {
                this.files[0].url = this.inputForm.headImg;
              } else {
                this.files = [];
                var obj = { url: this.inputForm.headImg };
                this.files.push(obj);
              }
              // console.log(data);
            }
          });
        }
      });
    },
    //提交表单
    submit() {
      this.$refs["inputForm"].validate((result) => {
        if (result) {
          this.$http({
            url: "/userSave",
            method: "post",
            data: this.inputForm,
          }).then(({ data }) => {
            if (data && data.success) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              this.dialogVisible = false;
              this.$emit("submitSuccess");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    //关闭时清空数据
    closed() {
      this.$refs["inputForm"].resetFields();
      Object.assign(this.$data, this.$options.data());
    },
    //如果超出数量限制提醒用户
    exceed() {
      alert(`只能上传1张图片`);
    },
    //上传前判断图片类型
    beforeRead(files) {
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        if (file.type != "image/jpeg" && file.type != "image/png") {
          alert("只能上传jpg和png格式的图片");
          return false;
        }
      }

      return true;
    },
  },
  watch: {
    //更新表单的字段
    files: {
      handler() {
        //这个方法名就是为了输出新值和旧值，只要改变就触发
        if (this.files[0] && this.files[0].url) {
          this.inputForm.headImg = this.files[0].url;
        } else {
          this.inputForm.headImg = "";
        }
      },
      immediate: true, //当这个属性true时输出刚开始的新值和旧值
      deep: true, //当这个属性为true时对象的属性发生变化也可以监听到
    },
  },
};
</script>