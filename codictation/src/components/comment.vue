<template>
  <div style="margin-top:5%">
    <Header></Header>
    <div v-if="commentList.length > 0">
      <div v-for="(item, index) in commentList" :key="item.time">
        <span>{{ item.name }}</span> <br />
        <span>{{ item.comment }}</span
        ><br />
        <span>{{ item.time }}</span>
        <el-button type="text" @click="reply(index, item.name)">回复</el-button>
        <!-- 每条评论的回复列表 -->
        <div v-for="replyitem in item.reply" :key="replyitem.time">
          <span>{{ replyitem.responder }}</span>
          <!-- v-if="isMainReply" -->
          <!-- <span v-else>{{ replyitem.responder }}回复@</span> -->
          <!-- <span v-if="!isMainReply">{{ replyitem.reviewer }}</span> -->
          <br />
          <span>{{ replyitem.comment }}</span
          ><br />
          <span>{{ replyitem.time }}</span>
          <!-- <el-button type="text" @click="reply(index, replyitem.responder)"
            >回复</el-button
          > -->
        </div>
        <br />
        <div :id="'input'+index" style="display:none">
          <!-- <div v-if="isShow"> -->
            <el-input
            type="textarea"
            v-model="replyComment"
            :rows="3"
            style="width: 30%"
          ></el-input>
          <!-- 每一条评论对应一个回复框 -->
          <br />
          <!-- 回复评论 -->
          <el-button type="primary" @click="submitReply(index)">回复</el-button>
          <!-- v-if="isMainReply" -->
          <!-- 回复回复 -->
          <!-- <el-button type="primary" @click="submitReply2()" v-else
            >回复</el-button
          > -->
          <!-- </div> -->
          
        </div>
        <hr />
      </div>
    </div>
    <div v-else>暂无评论~</div>
    <el-input
      type="textarea"
      v-model="comment"
      :rows="4"
      style="width: 40%"
    ></el-input>
    <br />
    <el-button type="primary" @click="submitCom()">发表评论</el-button>
  </div>
</template>

<script>
import Header from "./basic/Header.vue";
export default {
  data() {
    return {
      commentList: [],
      comment: "",
      name: "",
      replyComment: "",
      isShow: false,
      currentReviewer: "",
      currentResponder: "",
      currentIndex: 0,
      isMainReply: false,
      diffId: "",
      api:"/api",
    };
  },
  components: {
    Header,
  },
  methods: {
    submitCom() {
      let date = new Date();
      let subTime = date.toLocaleString("chinese", {
        hour12: false,
      }); //获得当前时间
      let item = {
        name: this.name,
        time: subTime,
        comment: this.comment,
        reply: [],
      };
      this.commentList.push(item);
      // console.log(this.commentList)
      this.$axios
        .post(this.api+"/updatecomment", {
          params: {
            _id: this.diffId,
            comments: this.commentList,
          },
        })
        .then((result) => {
          console.log(result);
        });
      //将评论列表更新到数据库
      this.comment = "";
    },
    submitReply(index) {
      // 回复评论
      let date = new Date();
      let subTime = date.toLocaleString("chinese", {
        hour12: false,
      }); //获得当前时间
      let replyItem = {
        reviewer: this.currentReviewer,
        responder: this.currentResponder, //回复的用户名
        time: subTime,
        comment: this.replyComment,
        reply2: [],
      };
      console.log(replyItem);
      this.commentList[this.currentIndex].reply.push(replyItem);
      this.$axios
        .post(this.api + "/updateComment", {
          params: {
            _id: this.diffId,
            comments: this.commentList,
          },
        })
        .then((result) => {
          console.log(result);
        });
      this.replyComment = "";
      document.getElementById("input"+index).style.display = "none"
    },
    // submitReply2(index) {
      //回复回复
      // let date = new Date();
      // let subTime = date.toLocaleString("chinese", {
      //   hour12: false,
      // }); //获得当前时间
      // let replyItem2 = {
      //   reviewer: this.currentReviewer,
      //   responder: this.currentResponder, //回复的用户名
      //   time: subTime,
      //   comment: this.replyComment,
      //   reply2: [],
      // };
      // // console.log(replyItem);
      // this.commentList[this.currentIndex].reply.push(replyItem2);
      // this.$axios
      //   .post("/updatecomment", {
      //     params: {
      //       _id: this.diffId,
      //       comments: this.commentList,
      //     },
      //   })
      //   .then((result) => {
      //     console.log(result);
      //   });
      // this.replyComment = "";
      // document.getElementById("input"+index).style.display = "none"
    // },
    reply(index, reviewer) {
      document.getElementById("input"+index).style.display = "block"
      this.currentIndex = index;
      this.currentReviewer = reviewer; //当前被评论的人
      this.currentResponder = this.name; //当前用户
      //判断是否为回复评论，显示不同的按钮
      // if (reviewer == this.commentList[index].name) {
      //   this.isMainReply = true;
      // }
    },
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.diffId = this.$route.params.diffId;
    //请求数据
    this.$axios.get(this.api+"/currentTask?_id=" + this.diffId).then((res) => {
      this.commentList = res.data[0].comments;
    });
  },
};
</script>

<style scoped>
</style>