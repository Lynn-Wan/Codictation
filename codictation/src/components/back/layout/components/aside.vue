<template>
  <!--
    el-menu-item 的 index 不能重复，确保唯一即可
   -->
  <el-menu
    class="nav-menu"
    default-active="/"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/index">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/test">
      <i class="el-icon-document"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
        <el-menu-item index="/editor">
      <i class="el-icon-document"></i>
      <span slot="title">用户修改</span>
    </el-menu-item>
   
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
}
</script>

<style scoped lang="less">
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>


