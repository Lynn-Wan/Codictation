<template>
  <div class="box">
    <h3>登录页面</h3>
    <el-form
      :model="registerData"
      status-icon
      :rules="rules"
      ref="registerForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="registerData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="item-button">
          <el-button type="primary" @click="submitForm('registerForm')"
            >登录</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registerData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
          { min: 3, max: 32, message: "长度应在3至32之间", trigger: "blur" },
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
          this.$axios.post("/login", this.registerData).then((res) => {
            localStorage.setItem("elementToken", "Bearer " + res.data);
            this.$message({
              type: "success",
              message: "用户登录成功",
            });
            this.$router.push("/Home");
          });
        } else {
          console.log("error submit!!");
          return false;
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