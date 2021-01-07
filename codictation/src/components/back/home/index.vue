<template>
  <div class="home-container">首页</div>
</template>

<script>
export default {
  name: "HomeIndex",
  beforeCreate(){
    const token = localStorage.getItem('elementToken')
    if (!token){
      this.$router.push("/admin");
    }
  }

  // beforeMount() {
  //   this.$axios.get("/").then(res => {
  //     console.log(res.data);
  //   });
  // }
};
</script>

<style scoped lang="less"></style>