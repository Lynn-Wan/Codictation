<template>
  <div class="box">
    <h3>登录页面</h3>
    <el-form
      :model="loginData"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="loginData.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="item-button">
          <el-button type="primary" @click="submitForm('loginForm')"
            >登录</el-button
          >
        </div>
      </el-form-item>
      <div
        style="
          margin-left: 80px;
          font-size: 14px;
          color: #919191;
          margin-top: 20px;
        "
      >
        还没有注册？
        <router-link :to="{ path: '/register' }" style="color: #0099ff"
          >快速注册</router-link
        >
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginData: {
        name: "",
        password: "",
      }, 
      api:"/api",
      rules: {
        name: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 2, max: 32, message: "长度应在2至32之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, max: 32, message: "长度应在3至32之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post(this.api+"/login", this.loginData).then((res) => {
            // localStorage.setItem("elementToken", "Bearer " + res.data);
            sessionStorage.setItem("userName", this.loginData.name);
            sessionStorage.setItem("elementToken", "Bearer " + res.data);
            this.$message({
              type: "success",
              message: "用户登录成功",
            });
            this.$store.dispatch("setUser", this.loginData.name);
            this.$store.dispatch("setToken", "Bearer " + res.data);
            this.$router.push("/profile");
            //登录成功跳转到首页
          });
        } else {
          this.$message({
            type: "warning",
            message: "用户登录失败",
          });
          console.log("error submit!!");
          return false;
          //错误信息提示，根据状态码
        }
      });
    },
  },
};
</script>
<style scoped>
.box {
  width: 400px;
  height: 260px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 5px #eee;
}
h3 {
  text-align: center;
}
.el-input {
  width: 90%;
}
.item-button {
  display: flex;
}
.item-button button {
  width: 120px;
  margin: 0 auto;
}
</style>

