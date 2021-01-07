<template>
  <div id="app"> 
    <router-view/>
  </div>
</template>

<script>
// import task from './components/task.vue'
// import diff from './components/diff.vue' 

export default {
  name: 'App',
  components: {
    // task,
    // diff
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
