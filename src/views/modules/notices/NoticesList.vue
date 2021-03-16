<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="内容(模糊)" label-width="80px" prop="cont">
            <el-input
              v-model="searchForm.cont"
              style="width: 220px"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公告时间" label-width="70px" prop="time">
            <el-date-picker
              :picker-options="pickerOptions"
              v-model="searchForm.time"
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

    <el-button
      @click="$refs['niticesForm'].init('add', '')"
      type="success"
      style="margin-bottom: 20px"
      >添加</el-button
    >

    <el-table
      border
      style="width: 100%"
      :data="noticeDataList"
      v-loading="loading"
    >
      <el-table-column
        label="内容"
        align="center"
        prop="cont"
        width="1000px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="公告时间" align="center">
        <span slot-scope="scope">{{
          $moment(scope.row.time).format("YYYY-MM-DD HH:mm:ss")
        }}</span>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$refs['niticesForm'].init('view', scope.row._id)"
            >查看</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="$refs['niticesForm'].init('edit', scope.row._id)"
            >修改</el-button
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
    <NoticesForm ref="niticesForm" @submitSuccess="submitSuccess" />
  </div>
</template>

<script>
import NoticesForm from "./NoticesForm";
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
      noticeDataList: [], //列表信息
      total: 0, //总数据数
      pageNumber: 1, //页数
      branchesNumber: 10, //条数
      loading: false,
      searchForm: {
        cont: "",
        time: null,
      },
    };
  },
  components: {
    NoticesForm,
  },
  mounted() {
    this.requestList();
  },
  methods: {
    //获取列表数据
    requestList() {
      this.loading = true;
      this.$http({
        url: "/noticesList",
        method: "post",
        data: {
          pageNumber: this.pageNumber,
          branchesNumber: this.branchesNumber,
          searchForm: this.searchForm,
        },
      }).then(({ data }) => {
        if (data && data.success) {
          this.noticeDataList = data.page.list;
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
      console.log(1);
      this.requestList();
    },
    //删除信息
    del(_id) {
      console.log(_id);
      this.$confirm("此操作将永久删除此账号?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: "/niticesDel",
            method: "get",
            params: {
              _id,
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
      this.searchForm.time = null;
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