<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="发帖用户" label-width="70px" prop="postUser">
            <el-input
              v-model="searchForm.postUser"
              style="width: 220px"
              placeholder="请输入发贴用户名"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="帖子标题" label-width="70px" prop="postTitle">
            <el-input
              v-model="searchForm.postTitle"
              style="width: 220px"
              placeholder="请输入帖子标题(模糊)"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="帖子内容" label-width="70px" prop="postCont">
            <el-input
              v-model="searchForm.postCont"
              style="width: 220px"
              placeholder="请输入帖子内容(模糊)"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="公告时间" label-width="70px" prop="postTime">
            <el-date-picker
              :picker-options="pickerOptions"
              v-model="searchForm.postTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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

    <el-table
      border
      style="width: 100%"
      :data="PostsDataList"
      v-loading="loading"
    >
      <el-table-column label="帖子id" align="center" prop="_id">
      </el-table-column>
      <el-table-column label="发帖人用户名" align="center" prop="postUser">
      </el-table-column>
      <el-table-column label="帖子标题" align="center" prop="postTitle">
      </el-table-column>
      <el-table-column label="帖子内容" align="center" prop="postCont">
      </el-table-column>
      <el-table-column label="内容图片" align="center">
        <template slot-scope="scope">
          <img
            v-for="(item, index) in scope.row.postContImg"
            :key="index"
            :src="item"
            class="headImg"
          />
        </template>
      </el-table-column>
      <el-table-column label="发帖时间" align="center">
        <span slot-scope="scope">
          {{ $moment(scope.row.postTime).format("YYYY-MM-DD") }}
        </span>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$refs['postsform'].init('view', scope.row._id)"
            >查看</el-button
          >
          <el-button type="text" size="small" @click="del(scope.row._id)"
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
    <PostsForm ref="postsform" @submitSuccess="submitSuccess" />
  </div>
</template>

<script>
import PostsForm from "./PostsForm";
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      PostsDataList: [], //列表信息
      total: 0, //总数据数
      pageNumber: 1, //页数
      branchesNumber: 10, //条数
      loading: false,
      searchForm: {
        postUser: "",
        postTitle: "",
        postCont: "",
        postTime: null,
      },
    };
  },
  components: {
    PostsForm,
  },
  mounted() {
    this.requestList();
  },
  methods: {
    //获取列表数据
    requestList() {
      this.loading = true;
      this.$http({
        url: "/postsList",
        method: "post",
        data: {
          pageNumber: this.pageNumber,
          branchesNumber: this.branchesNumber,
          searchForm: this.searchForm,
        },
      }).then(({ data }) => {
        if (data && data.success) {
          this.PostsDataList = data.page.list;
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
    del(id) {
      this.$confirm("此操作将永久删除此账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: "/postsDel",
            method: "get",
            params: {
              id,
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
      this.searchForm.postTime = null
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