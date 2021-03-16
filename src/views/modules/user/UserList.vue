<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="用户名" label-width="80px" prop="username">
            <el-input
              v-model="searchForm.username"
              style="width: 220px"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="昵称" label-width="50px" prop="nickname">
            <el-input
              v-model="searchForm.nickname"
              style="width: 220px"
              placeholder="请输入昵称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="性别" label-width="50px" prop="sex">
            <el-select
              v-model="searchForm.sex"
              placeholder="请选择性别"
              style="width: 200px"
              clearable
            >
              <el-option label="男" value="男"> </el-option>
              <el-option label="女" value="女"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="生日" label-width="50px" prop="birth">
            <el-date-picker
              v-model="searchForm.birth"
              type="datetime"
              format="yyyy-MM-dd"
              placeholder="选择生日"
              style="width: 200px"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            style="margin-bottom: 20px"
            @click="requestList()"
            size="small"
            >查询</el-button
          >
          <el-button
            style="margin-bottom: 20px"
            @click="replacement()"
            size="small"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <el-button
      @click="$refs['UserForm'].init('add', '')"
      type="success"
      style="margin-bottom: 20px"
      >添加</el-button
    >

    <el-table
      border
      style="width: 100%"
      :data="userDataList"
      v-loading="loading"
    >
      <el-table-column label="用户名" align="center" prop="username">
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickname">
      </el-table-column>
      <el-table-column label="头像" align="center" width="110">
        <img
          :src="scope.row.headImg"
          alt=""
          slot-scope="scope"
          class="headImg"
        />
      </el-table-column>
      <el-table-column label="生日" align="center">
        <span slot-scope="scope">
          {{ $moment(scope.row.birth).format("YYYY-MM-DD") }}
        </span>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
      </el-table-column>
      <el-table-column label="密码" align="center" prop="password">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$refs['UserForm'].init('view', scope.row._id)"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="$refs['UserForm'].init('edit', scope.row._id)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="del(scope.row.username)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <UserForm ref="UserForm" @submitSuccess="submitSuccess" />
  </div>
</template>

<script>
import UserForm from "./UserForm";
export default {
  data() {
    return {
      userDataList: [], //列表信息
      total: 0, //总数据数
      pageNumber: 1, //页数
      branchesNumber: 10, //条数
      loading: false,
      searchForm: {
        username: "",
        nickname: "",
        sex: "",
        birth: "",
      },
    };
  },
  components: {
    UserForm,
  },
  mounted() {
    this.requestList();
  },
  methods: {
    //获取列表数据
    requestList() {
      this.loading = true;
      this.$http({
        url: "/userList",
        method: "post",
        data: {
          pageNumber: this.pageNumber,
          branchesNumber: this.branchesNumber,
          searchForm: this.searchForm,
        },
      }).then(({ data }) => {
        if (data && data.success) {
          this.userDataList = data.page.list;
          this.total = data.page.count;
          this.loading = false;
        }
      });
    },
    // 改变条数
    handleSizeChange(val) {
      this.branchesNumber = val;
      this.requestList();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.requestList();
    },
    //修改成功刷新列表
    submitSuccess() {
      this.requestList();
    },
    //删除信息
    del(username) {
      console.log(username);
      this.$confirm("此操作将永久删除此账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: "/userDel",
            method: "get",
            params: {
              username,
            },
          }).then(({ data }) => {
            if (data && data.success) {
              this.requestList();
              this.$message({
                type: "success",
                message: data.msg,
              });
            }
          });
        })
        .catch(() => {
          //捕获异常
        });
    },
    //重置
    replacement() {
      this.$refs["searchForm"].resetFields(); //重置表单
      this.requestList();
    },
  },
};
</script>

<style lang="scss" scoped>
.headImg {
  width: 50px;
  height: 50px;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
.el-row {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>