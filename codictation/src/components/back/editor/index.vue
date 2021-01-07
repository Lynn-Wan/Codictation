<template>
  <div class="dashboard-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户_id">
        <el-input v-model="form._id" disabled="disabled" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="form.snumber" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="form.class" />
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="视频存储路径">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="视频_id">
        <el-input v-model="form.videoId" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "testEditor",
  data() {
    return {
      api: "/test",
      form: {
        snumber: "",
        name: "",
        class: "",
        phone: "",
        password: "",
        path: "",
        videoId: "",
      },
    };
  },
  mounted() {
    if (this.$route.query._id) {
      this.$axios
        .post(this.api + "/get", { _id: this.$route.query._id })
        .then((res) => {
          this.form = res.data;
        });
    }
  },
  methods: {
    onSubmit() {
      console.log("222:", 222);
      if (this.form._id) {
        this.$axios.post(`${this.api}/update`, this.form).then((res) => {
          console.log("bar:", res);
          this.$router.push(this.api);
          this.form = {
            snumber: "",
            name: "",
            class: "",
            phone: "",
            password: "",
            path: "",
            videoId: "",
          };
        });
      } else {
        this.$axios.post(this.api + "/add", this.form).then((res) => {
          console.log("hi");
          console.log("bar:", res);
          this.$router.push(this.api);
          this.form = {
            snumber: "",
            name: "",
            class: "",
            phone: "",
            password: "",
            path: "",
            videoId: "",
          };
        });
      }
    },
    onCancel() {
      this.$router.push(this.api);
    },
  },
};
</script>

<style>
</style>
