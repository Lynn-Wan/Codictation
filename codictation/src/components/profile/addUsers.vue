<template>
  <div>
    <p>导入学生名单</p>
    <input type="file" single accept=".xlsx" @change="getFile($event)" />
    <br />
    任务标题：
    <input type="text" v-model="tag" @keyup="checkTag()" />
    <p v-if="tagExist" style="font-size: 80%; color: red">
      ×标签已存在，请重新命名
    </p>
    <el-button type="info" @click="showTable()">预览</el-button>
    <el-button type="primary" @click="submitList()" :disabled="tagExist"
      >导入</el-button
    >
    <el-table
      :data="accountList"
      border
      style="width: 20%; margin-left: 33%; margin-top: 3%"
      v-if="table"
    >
      <el-table-column prop="stuid" label="学号" width="160"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Header from "../basic/Header.vue";
export default {
  data() {
    return {
      accountList: [],
      table: false,
      count: 0, //阻止文件上传成功事件触发的二次上传
      tag: "",
      tagList: [], //获取该用户已添加的tags
      tagExist: false,
      owner: "",
      status: "",
      api:"/api",
    };
  },
  components: {
    Header,
  },
  methods: {
    showTable() {
      if (this.accountList.length > 0) {
        this.table = !this.table;
      } else {
        this.$message({
          message: "当前未导入名单哦",
          type: "warning",
        });
      }
    },
    getFile(e) {
      this.count++;
      if (this.count == 1) {
        let _this = this;
        let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
        if (event.target.files.length == 1) {
          this.file = event.target.files[0];
        }
        var rABS = false; //是否将文件读取为二进制字符串
        var f = this.file;
        var reader = new FileReader();
        //if (!FileReader.prototype.readAsBinaryString) {
        FileReader.prototype.readAsBinaryString = function (f) {
          var binary = "";
          var rABS = false; //是否将文件读取为二进制字符串
          var pt = this;
          var wb; //读取完成的数据
          var outdata;
          var reader = new FileReader();
          reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            var XLSX = require("xlsx");
            if (rABS) {
              wb = XLSX.read(btoa(fixdata(binary)), {
                //手动转化
                type: "base64",
              });
            } else {
              wb = XLSX.read(binary, {
                type: "binary",
              });
            }
            // outdata就是你想要的东西 excel导入的数据
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            // excel 数据再处理
            let arr = [];
            outdata.map((v) => {
              let obj = {};
              obj.stuid = v.学号;
              obj.name = v.姓名;
              obj.password = v.密码;
              arr.push(obj);
            });
            _this.accountList = [...arr];
            this.able = false;
            // console.log(_this.accountList);
            _this.reload();
          };
          reader.readAsArrayBuffer(f);
        };
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      }
    },
    submitList() {
      if (this.accountList.length > 0) {
        this.$axios
          .post(this.api+"/addUsers", {
            owner: this.owner,
            userList: this.accountList,
            tagName: this.tag,
          })
          .then((result) => {
            console.log(result);
            console.log("数据已上传");
            this.$message({
              message: "导入名单成功",
              type: "success",
            });
            this.$router.push("/profile");
          });
      } else {
        this.$message({
          message: "当前未导入名单哦",
          type: "warning",
        });
      }
    },
    checkTag() {
      //检测标题是否重名
      for (var i = 0; i < this.tagList.length; i++) {
        if (this.tagList[i] == this.tag) {
          this.tagExist = true; //重名则无法提交
          return;
        } else {
          this.tagExist = false;
        }
      }
    },
    getTagList() {
      //连接数据库，获取数据库中属于当前用户的tag列表
      this.$axios.get(this.api+"/tagList?owner=" + this.owner).then((res) => {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          this.tagList.push(data[i].tagName);
        }
        console.log(this.tagList);
      });
    },
    getStatus() {
      //连接数据库，获取数据库中属于当前用户的status
      this.$axios.get(this.api+"/profile?name=" + this.owner).then((res) => {
        this.status = res.data[0].status;
        if (this.status !== "1") {
          this.$router.push("/profile");
          this.$message({
            message: "没有导入名单权限！",
            type: "warning",
          });
        }
      });
    },
  },
  created() {
    this.owner = sessionStorage.getItem("userName");
    this.getTagList();
    this.getStatus();
  },
};
</script>

<style scoped>
</style>