<template>
  <div>
    <h4>发布任务</h4>
    <form
      action="http://localhost:3000/api/task"
      method="post"
      enctype="multipart/form-data"
    >
      <input type="text" name="publisher" placeholder="发布者" v-model="publisher" readonly />
      <br />
      <br>
      <!-- action路径可更改，需对应更改server/index.js里对应的路径（监听窗口须一致） -->
      上传音视频文件：
      <input type="file" single name="f1" accept="video/*,audio/*" />
      <br>
      <br />
      任务标题：<input
        type="text"
        v-model="title"
        @keyup="checkTitle"
        autocomplete="off"
        name="title"
      />
      <p v-if="titleExist" style="font-size: 80%; color: red">
        ×标题已存在，请重新命名
      </p>
      <br />
      <br>
      <select
        v-model="videoLabel"
        style="width: 30%"
        class="form-control"
        id="selected"
        name="label"
      >
        <option disabled="disabled" value="">--任务标签--</option>
        <option value="Economy">Economy</option>
        <option value="Science">Science</option>
        <option value="Politics">Politics</option>
        <option value="Literature">Literature</option>
        <option value="Coronavirus">Coronavirus</option>
        <option value="Health">Health</option>
        <option value="Nature">Nature</option>
        <option value="Sports">Sports</option>
        <option value="Celebrity">Celebrity</option>
        <option value="Others">Others</option>
      </select>
      <br />
      <select
        v-model="tagName"
        style="width: 30%"
        class="form-control"
        name="tag"
      >
        <option disabled="disabled" value="">--请选择小组名单--</option>
        <option
          v-for="item in tagList"
          :key="item.tagName"
          :label="item.tagName"
          :value="item.tagName"
        >
        </option>
      </select>
      <br />
      <el-date-picker
        v-model="deadline"
        type="datetime"
        placeholder="选择任务截止时间"
        name="deadline"
        value-format="yyyy-MM-dd HH:mm:SS"
      >
      </el-date-picker>
      <br>
      <el-checkbox v-model="checked" @change="initAuthcode">验证码</el-checkbox>
      <el-input
        v-if="checked"
        v-model="authcode"
        placeholder="填写验证码"
        name="authcode"
      ></el-input>
      <br>
      <input
        type="submit"
        id="submit"
        :disabled="titleExist"
        value="发布任务"
      />
      <br>
      <!-- title重名则无法提交 -->
      <!-- title和label等会随着表单提交一起传到后台，name是关键！ -->
    </form>
  </div>
</template>

<script>

import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "task",
  data() {
    return {
      publisher: "",
      authcode: "", //验证码
      checked: false,
      deadline: "", //截止日期
      videoLabel: "",
      title: "",
      titleList: [],
      titleExist: false,
      accountList: [],
      multiple: false,
      tagList: [],
      status: "",
      tagName: '',
      api:"/api",
    };
  },
  methods: {
    getTitleList() {
      //连接数据库，获取数据库中所有的title
      this.$axios.get(this.api+"/titleList").then((res) => {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          this.titleList.push(data[i].title);
        }
        console.log(this.titleList);
      });
    },
    getTagList() {
      //连接数据库，获取数据库中属于当前用户的tag列表
      this.$axios.get(this.api+"/tagList?owner=" + this.publisher).then((res) => {
        this.tagList = res.data;
        console.log(this.tagList);
      });
    },
    getStatus() {
      //连接数据库，获取数据库中属于当前用户的status
      this.$axios.get(this.api+"/profile?name=" + this.publisher).then((res) => {
        this.status = res.data[0].status;
        if (this.status == "0" || this.status == "3") {
          // this.$router.push("/profile");
          this.$message({
            message: "没有发布任务权限！",
            type: "warning",
          });
        }
      });
    },
    checkTitle() {
      //检测标题是否重名
      for (var i = 0; i < this.titleList.length; i++) {
        if (this.titleList[i] == this.title) {
          this.titleExist = true; //重名则无法提交
          return;
        } else {
          this.titleExist = false;
        }
      }
    },
    initAuthcode() {
      this.authcode = ""
    }//清空验证码
  },
  created() {
    this.publisher = sessionStorage.getItem("userName");
    this.getTitleList();
    this.getTagList();
    this.getStatus();
  },
  //根据publisher判断权限 status是否为1和2
  // beforeRouteEnter: (to, from, next) => {

  //   next((vm) => {//回调
  //     alert("hello" + vm.name);
  //   });
  // },
};
</script>

<style>
</style>