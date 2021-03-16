<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="35%"
      @closed="closed"
    >
      <el-form
        :model="inputForm"
        ref="inputForm"
        label-width="100px"
        class="demo-ruleForm"
        :disabled="method == 'view'"
      >
        <el-form-item label="内容图片" prop="postContImg">
          <vue-upload-imgs
            compress
            :before-read="beforeRead"
            :type="0"
            v-model="files"
            :disabled="method == 'view' ? true : false"
          >
          </vue-upload-imgs>
        </el-form-item>
        <el-form-item
          label="帖子id"
          prop="_id"
          :rules="[
            { required: true, message: '请输入帖子id', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="inputForm._id"
            style="width: 350px"
            :disabled="method != 'add' ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="发帖人用户"
          prop="postUser"
          :rules="[{ required: true, message: '请输入昵称', trigger: 'blur' }]"
        >
          <el-input
            v-model="inputForm.postUser"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="帖子标题"
          prop="postTitle"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="inputForm.postTitle"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公告内容"
          prop="postCont"
          :rules="[
            { required: true, message: '请输入帖子内容', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="inputForm.postCont"
            :autosize="{ minRows: 2, maxRows: 6 }"
            resize="none"
            :rows="4"
            style="width: 350px"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="发帖时间"
          prop="postTime"
          :rules="[{ required: true, message: '请选择生日', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="inputForm.postTime"
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
        postUser: "",
        postTitle: "",
        postTime: "",
        postContImg: [],
        postCont: "",
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
            url: "/postsDetail",
            method: "get",
            params: {
              id,
            },
          }).then(({ data }) => {
            if (data && data.success) {
              this.inputForm = this.recover(this.inputForm, data.information);
              this.inputForm.postContImg.forEach((element) => {
                var obj = {};
                obj.url = element;
                this.files.push(obj);
              });
              // console.log(data);
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

<style lang="scss" scoped>
.upload-div-add-img,
.upload-div-img {
  width: 50px !important;
  height: 50px !important;
}
</style>