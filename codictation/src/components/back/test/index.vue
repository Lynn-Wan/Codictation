<template>
  <div class="dashboard-container">
    <div class="filter-container" style="margin: 0 0 10px 0">
      <el-input
        v-model="Qlist.name"
        placeholder="姓名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="Qlist.class"
        placeholder="班级"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        v-if="showBack"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="closeFilter"
      >
        返回
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      :data="users"
      style="width: 100%"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="_id" sortable="custom" label="用户_id" />
      <el-table-column prop="snumber" sortable="custom" label="学号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="class" sortable="custom" label="班级" />
      <el-table-column prop="phone" label="手机号码" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="path" sortable="custom" label="视频存储路径" />
      <el-table-column prop="videoId" sortable="custom" label="视频_id" />
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <br>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="Qlist.pagenum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="Qlist.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination>
  </div>
</template>

<script>
const _ = require('loadsh')

export default {
  name: "test",
  data() {
    return {
      api: "/test",
      users: {},
      Qlist: {
        pagenum: 1,//当前页数
        pagesize: 20,
        name: "",
        class: "",
      },
      total:'',
      showBack: false,
    };
  },
  mounted() {
    this.findUser();
  },
  methods: {
    onSubmit() {
      console.log(123434);
    },
    findUser() {
      this.$axios.post(this.api + "/find").then((res) => {
        this.users = _.chunk(res.data, this.Qlist.pagesize)[this.Qlist.pagenum-1];
        this.total = res.data.length
      });
    }, //获取初始数据
    sortChange(data) {
      const { prop, order } = data;
      this.$axios.post(this.api + "/sort", { prop, order }).then((res) => {
        console.log("res:", res);
        this.users = res.data;
      });
    }, //对各列进行排序处理
    handleEdit(index, item) {
      this.$router.push({ path: "/editor", query: { _id: item._id } });
    }, //编辑
    handleDelete(index, item) {
      this.$axios.post(this.api + "/delete", item).then((res) => {
        console.log("res:", res);
        this.findUser();
      });
    }, //删除
    handleCreate() {
      this.$router.push("/editor");
    }, //创建
    //筛选部分
    handleFilter() {
      this.$axios.post(this.api + "/filter", this.Qlist).then((res) => {
        console.log("res:", res);
        this.users = res.data;
        this.showBack = true;
      });
    }, //筛选数据
    closeFilter() {
      this.findUser();
      this.showBack = false;
    }, //关闭筛选
    // 分页部分
    handleSizeChange(val) {
      this.Qlist.pagesize = val;
      this.findUser()
    },// 每页查看条数变化
    handleCurrentChange(val) {
      this.Qlist.pagenum = val;
      this.findUser()
    } // 当前页码变化
  },
};
</script>

<style>
</style>
