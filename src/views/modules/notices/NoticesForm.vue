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
        ref="noticesForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="method == 'view'"
      >
        <el-form-item label="公告时间" prop="time">
          <el-date-picker
            v-model="inputForm.time"
            type="datetime"
            format="yyyy-MM-dd"
            placeholder="选择日期时间"
            style="width: 200px"
            disabled
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="公告内容"
          prop="cont"
          :rules="[
            { required: true, message: '请输入公告内容', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="inputForm.cont"
            :autosize="{ minRows: 2, maxRows: 6 }"
            resize="none"
            :rows="4"
            style="width: 250px"
            type="textarea"
          ></el-input>
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
      inputForm: {
        //表单
        _id: "",
        time: "",
        cont: "",
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
        this.inputForm.time = new Date();
      } else if (method == "edit") {
        this.title = "修改用户信息";
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (method == "view" || method == "edit") {
          //修改或查看
          this.$http({
            url: "/noticesDetail",
            method: "get",
            params: {
              id,
            },
          }).then(({ data }) => {
            if (data && data.success) {
              this.inputForm = this.recover(this.inputForm, data.information);
              // console.log(data);
            }
          });
        }
      });
    },
    //提交表单
    submit() {
      this.$refs["noticesForm"].validate((result) => {
        if (result) {
          this.$http({
            url: "/noticesSave",
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
      this.$refs["noticesForm"].resetFields();
      Object.assign(this.$data, this.$options.data());
    },
  },
};
</script>