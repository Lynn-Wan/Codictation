<template>
  <div style="margin-top: 5%">
    <Header></Header>
    <div>
      <video
        :src="require('../assets/video/' + fileName)"
        controls
        width="400"
        height="300"
        id="video"
        v-if="isVideo"
      ></video>
      <audio
        :src="require('../assets/video/' + fileName)"
        id="audio"
        controls
        v-else
      ></audio>
      <br />
      选择难度：<select
        v-model="rateSelected"
        id="selected"
        @change="handleSpeed"
      >
        <option value="0.5">0.5</option>
        <option value="1.0">1.0</option>
        <option value="1.25">1.25</option>
        <option value="1.5">1.5</option>
        <option value="2.0">2.0</option>
      </select>
      <br />
      <input @click="goBack" type="button" value="倒退10s" />
      <input @click="goForward" type="button" value="前进10s" />
      <br />
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12" v-if="isversion1">
            <p>最优版本：</p>
            <div id="textDiv">
              <div>
                <span v-for="(item, index) in final_context" :key="index">
                  <span
                    v-for="(final_word, final_word_index) in item.final_words"
                    :key="final_word_index"
                    @click="showAll(final_word_index, index)"
                    :class="{ active: isActive }"
                  >
                    <span v-if="regtest.test(final_word)" v-html="final_word">
                    </span>
                    <span v-else>
                      {{ final_word }}
                    </span>
                  </span>
                </span>
              </div>
            </div>

            <el-button type="info" @click="changev1()">修改</el-button>
            <!-- <el-button type="success" @click="createFinalVersion()"
              >更新综合版</el-button
            > --> <!-- 可以做成刷新图标 -->
          </el-col>
          <el-col :span="13" v-else>
            <div>
              <p>
                当前还没有同学贡献听写版本哦~
                快来贡献自己的版本吧！或者稍后再来！
              </p>
              <el-input
                type="textarea"
                :rows="10"
                placeholder="开始听写···"
                v-model="text1"
              ></el-input>
              <el-button type="primary" @click="submitv1()">确认提交</el-button>
            </div>
          </el-col>
          <el-col :span="12" v-if="isedit">
            <div>
              <p>请修改：</p>
              <div v-for="(item, i) in sentenceList" :key="i">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="sentenceList[i]"
                ></el-input>
              </div>
              <el-button type="primary" @click="submitmv()">确认修改</el-button>
              <el-button type="primary" @click="cancelChangev1()"
                >取消</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-card class="box-card" v-if="isShowAll">
          <el-table
            :data="
              tableData.slice((currpage - 1) * pagesize, currpage * pagesize)
            "
            style="width: 100%"
          >
            <el-table-column
              type="String"
              prop="diff"
              label="修改版本"
              width="300"
            >
              <template slot-scope="scope">
                <span v-html="scope.row.diff"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="names"
              label="用户"
              width="300"
            >
              <template slot-scope = "scope">
                <span v-for="name in scope.row.names" :key="name">
                  {{name + " "}}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="closeShow()">关闭</el-button>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pagesize"
            :current-page="currpage"
            :total="tableData.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </el-card>
      </el-main>
    </div>
    <!-- 改用标签页 -->
    <el-button type="primary" @click="comment()">进入评论页面</el-button>
  </div>
</template>

<script>
// import { version } from 'xlsx/types';
import Header from "./basic/Header.vue";
import Vue from "vue/dist/vue.esm.js";
var differ = require("../diff.js").differ;

export default {
  data() {
    return {
      text1: "", //当前用户作为第一个用户提交的第一版本
      isversion1: false, //判断是否有第一个版本
      isFinal: false, //判断是否有修改记录可以生成综合版本
      text_v1: "", //从数据库取得的第一个用户提交的第一版本，可能与text1不一样
      text_fn: "",
      isedit: false, //控制是否显示修改框
      textDiv: "", //当前页面的textDiv的值, 记录当前用户的修改版本
      currentCompareText: "", //当前页面的textDiv的值, 用来做比较基础
      sentences: [], //第一个用户提交的第一版本的分句结果
      username: "",
      diffList: [],
      isShowAll: false,
      tableData: [], //分页相关
      pagesize: 3, //分页相关
      currpage: 1, //分页相关
      isActive: false,
      seen: false,
      tempindex: 0,
      current: 0,
      diffId: "", //当前任务的_id
      fileName: "",
      userList: [],
      inUserList: false,
      api: "/api",
      player: "", //播放器
      rateSelected: "1.0", //播放速度
      isVideo: false, //文件类型是否为视频
      videoType: ["AVI", "baiwma", "rmvb", "rm", "flash", "mp4", "mid", "3GP"], //视频类型
      sentenceList: [], //获得去掉标签之后各句子的综合版本，遍历填充修改框
      final_context: [],
      dbList: [],
      regtest: /[<ins>|<del>]/g,
    };
  },
  components: {
    Header,
  },
  methods: {
    //确定是音频播放器还是视频播放器
    decidePlayer() {
      if (this.isVideo) {
        this.player = document.getElementById("video");
      } else {
        this.player = document.getElementById("audio");
      }
    },
    //控制播放速度
    handleSpeed() {
      this.player.playbackRate = this.rateSelected;
    },
    //控制后退10秒
    goBack() {
      this.player.currentTime -= 10;
    },
    //控制前进10秒
    goForward() {
      this.player.currentTime += 10;
    },
    //跳转至评论页面
    comment() {
      this.$router.push("/diff/" + this.diffId + "/comment");
    },
    //分页相关
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //分页相关
    handleSizeChange(val) {
      this.pagesize = val;
    },
    //提交第一份，只执行一次，但会决定数据库的结构
    submitv1() {
      //获得当前时间
      let date = new Date();
      let newdate = date.toLocaleString("chinese", {
        hour12: false,
      });
      //输入的内容非空
      if (this.text1) {
        this.$axios
          .post(this.api + "/updateVersion", {
            //整篇更新到版本列表
            params: {
              _id: this.diffId,
              time: newdate,
              new_version: this.text1,
              username: this.username,
            },
          })
          .then((result) => {
            //以下内容未被执行
            // console.log("aaa");
            this.$axios
              .get(this.api + "/currentTask?_id=" + this.diffId)
              .then((res) => {
                // console.log("111");
                this.diffList = res.data[0].diffList;
                // console.log("diffList1", this.diffList)
                this.userList = res.data[0].userList;
                if (this.diffList.length == 0) {
                  this.$axios
                    .get(this.api + "/allVersions?_id=" + this.diffId)
                    .then((res) => {
                      var owner = res.data[0].name; //第一个提交的用户
                      if (owner == this.username) {
                        this.$message({
                          message: "成功提交当前任务的第1个版本！获得...积分",
                          type: "success",
                        });
                      } else {
                        this.$message({
                          message:
                            "非常遗憾，已有其他用户提交当前任务的第1个版本！下次加油(ง •_•)ง",
                          type: "warning",
                        });
                      }
                      this.isversion1 = true;
                      this.text_v1 = res.data[0].version;
                      var diffList1 = [];
                      //分句并存储到数据库中
                      this.sentences = this.text_v1.split(
                        /(?<=[^A-Z].[.?]) +(?=[A-Z])/g
                      );
                      // console.log(this.sentences);
                      for (var sen = 0; sen < this.sentences.length; sen++) {
                        let words = this.sentences[sen].split(" "); //分词
                        let word_list = []; //分词列表，包括用户列表
                        var names = new Array;
                        names.push(this.username);
                        for (var wor = 0; wor < words.length; wor++) {
                          var wordItem = {
                            word: words[wor],
                            diffs: [
                              {
                                diff: words[wor],
                                names: names,
                                num: 1,
                                time: newdate,
                              },
                            ],
                          };
                          word_list.push(wordItem);
                        }
                        var sentence_item = {
                          sentence: this.sentences[sen],
                          words: word_list,
                        };
                        diffList1.push(sentence_item);
                      }
                      // console.log("deffList2", diffList1)
                      this.$axios
                        .post(this.api + "/updatediff", {
                          //将分词分句结果更新到数据库
                          params: {
                            _id: this.diffId,
                            diffList: diffList1,
                            userList: this.userList,
                          },
                        })
                        .then((res) => {
                          console.log("-------" + res);
                        });
                    });
                    this.$router.go(0); //
                    // this.createFinalVersion();
                } else {
                  this.isversion1 = true;
                  this.isFinal = true;
                  //形成综合版本
                  this.$router.go(0);
                  // this.createFinalVersion();
                  this.$message({
                    message:
                      "非常遗憾，已有其他用户提交当前任务的第1个版本！下次加油(ง •_•)ง",
                    type: "warning",
                  });
                }
              });
          });
          // this.$router.go(0);
        // this.createFinalVersion();
      } else {
        //输入的内容为空
        this.$message({
          message: "请重新确认，您并未输入内容哦~",
          type: "warning",
        });
      }
      // this.$router.go(0); //刷新页面
    },
    //点击修改按钮
    changev1() {
      //点击修改按钮
      this.isedit = true;
      //当前用户要提交的版本
      this.textDiv = document
        .getElementById("textDiv")
        .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");
      //用于比较的文本，去除标签
      this.currentCompareText = document
        .getElementById("textDiv")
        .innerHTML.replace(/(<span[^>]*?>)|(<\/span>)/g, "");
    },
    //取消修改
    cancelChangev1() {
      this.isedit = false;
    },
    //确定数组里是否有某个元素
    findElem(arrayToSearch, attr, val) {
      for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
          return i;
        }
      }
      return -1;
    },
    //提交当前用户的版本
    submitmv() {
      //获得当前时间
      let date = new Date();
      let newdate = date.toLocaleString("chinese", {
        hour12: false,
      });
      //获得最新的修改列表
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          this.dbList = res.data[0].diffList;
        });
      // console.log("dbDiffList", this.dbList);
      // console.log("sentenceList", this.sentenceList);
      var listLen = this.dbList.length;
      //与第一版本比较，根据句子的数量进行循环（修改后提交内容对应的句子）
      var final_result = []; //记录所有的修改情况
      for (var len = 0; len < listLen; len++) {
        var sen_result = []; //记录当前句子的修改情况
        var s_result1 = differ
          .parse(" " + this.dbList[len].sentence, " " + this.sentenceList[len])
          .replace(/%2C/g, ",")
          .replace(/%3F/g, "?")
          .replace(/%27/g, "'")
          .replace(/%3A/g, ":");
        //将单独的ins标签替换为del-ins标签
        // console.log(s_result1);
        var reg = /([a-zA-Z0-9]+[\-\'\.\:]?[a-zA-Z0-9]*\s(<ins[^>]*?>.*?<\/ins>\s)+)/g;
        var insMatchResult = s_result1.match(reg);
        // console.log("insMatchResult", insMatchResult);
        if (insMatchResult !== null) {
          for (var m = 0; m < insMatchResult.length; m++) {
            //去掉空的匹配结果
            if (insMatchResult[m] == "") {
              insMatchResult.splice(m, 1);
              m = m - 1;
            } else {
              s_result1 = s_result1.replace(insMatchResult[m], "<>"); //替换成特殊的符号 占位
              var del_content = insMatchResult[m].split(" ")[0]; //原词
              var edited_ver =
                "<del>" + del_content + "</del> <ins>" + del_content + "</ins>";
              insMatchResult[m] = insMatchResult[m].replace(
                del_content,
                edited_ver
              );
            }
            s_result1 = s_result1.replace("<>", insMatchResult[m]);
          }
        }
        // console.log("after", s_result1);
        var s_result_del = s_result1.replace(/<ins[^>]*?>.*?<\/ins>\s/g, "");
        //去掉所有ins标签，用于确认del标签的index
        var s_result_arr = s_result_del.trim().split(" ");
        // console.log("s_result_arr", s_result_arr);
        //匹配出所有的修改
        var allMatchResult = s_result1.match(
          /((<del[^>]*?>.*?<\/del>\s)*(<ins[^>]*?>.*?<\/ins>\s)*)/g
        );
        //对所有的匹配结果（修改）进行进一步的整合
        for (var n = 0; n < allMatchResult.length; n++) {
          //去掉空的匹配结果
          if (allMatchResult[n] == "") {
            allMatchResult.splice(n, 1);
            n = n - 1;
          } else {
            var matchSplit = allMatchResult[n].trim().split(" ");
            // console.log("matchResult", matchSplit);
            var del = [];
            var ins = [];
            // var re1 = /<del[^>]*?>.*?<\/del>/g;
            // var re2 = /<ins[^>]*?>.*?<\/ins>/g;
            for (var t = 0; t < matchSplit.length; t++) {
              //存储到相反的数组？？？
              // console.log("m");
              if (matchSplit[t].indexOf("<ins>")) {
                var del_index = s_result_arr.indexOf(matchSplit[t]);
                // console.log("--del_index--", del_index);
                var del_item = {
                  del: matchSplit[t],
                  del_index: del_index,
                };
                del.push(del_item);
              }
              if (matchSplit[t].indexOf("<del>")) {
                ins.push(matchSplit[t]);
              }
            }
            // console.log("ins arr", del);
            // console.log("del arr", ins);
            if (ins.length == 0) {
              for (var d = 0; d < del.length; d++) {
                var diff1 = del[d].del;
                // console.log("a", diff1)
                var del_content1 = del[d].del.replace(
                  /(<del[^>]*?>)|(<\/del>)/g,
                  ""
                );
                // console.log("a", del_content1)
                var item1 = {
                  word: del_content1,
                  diff: diff1,
                  index: del[d].del_index,
                };
                sen_result.push(item1);
              }
            }
            if (del.length == 1) {
              // console.log("del_del", del[0]);
              var del_content2 = del[0].del.replace(
                /(<del[^>]*?>)|(<\/del>)/g,
                ""
              );
              var diff2 = del[0].del + " " + ins.join(" ");
              // console.log("b", diff2)
              // console.log("b", del_content2)
              var item2 = {
                word: del_content2,
                diff: diff2,
                index: del[0].del_index,
              };
              sen_result.push(item2);
            }
            if (del.length > 1) {
              if (del.length == ins.length) {
                for (var a = 0; a < del.length; a++) {
                  // console.log(del[a])
                  var del_content3 = del[a].del.replace(
                    /(<del[^>]*?>)|(<\/del>)/g,
                    ""
                  );
                  var ins_content3 = ins[a].replace(
                    /(<ins[^>]*?>)|(<\/ins>)/g,
                    ""
                  );
                  // console.log("c", del_content3)
                  if (del_content3 !== ins_content3) {
                    var item3 = {
                      word: del_content3,
                      diff: del[a].del + ins[a],
                      index: del[a].del_index,
                    };
                    sen_result.push(item3);
                  }
                }
              }
              if (del.length < ins.length) {
                for (var b = 0; b < del.length; b++) {
                  var del_content4 = del[b].del.replace(
                    /(<del[^>]*?>)|(<\/del>)/g,
                    ""
                  );
                  // console.log("d", del_content4)
                  var diff4 = "";
                  if (b == del.length - 1) {
                    var temp_ins = ins.slice(b);
                    diff4 = del[b].del + " " + temp_ins.join(" ");
                  } else {
                    diff4 = del[b].del + ins[b];
                  }
                  // console.log("d", diff4)
                  var ins_content4 = ins[b].replace(
                    /(<ins[^>]*?>)|(<\/ins>)/g,
                    ""
                  );
                  if (del_content4 !== ins_content4) {
                    var item4 = {
                      word: del_content4,
                      diff: diff4,
                      index: del[b].del_index,
                    };
                    sen_result.push(item4);
                  }
                }
              }
              if (del.length > ins.length) {
                for (var c = 0; c < ins.length; c++) {
                  var del_content5 = del[c].del.replace(
                    /(<del[^>]*?>)|(<\/del>)/g,
                    ""
                  );
                  var ins_content5 = ins[c].replace(
                    /(<ins[^>]*?>)|(<\/ins>)/g,
                    ""
                  );
                  // console.log("e", del_content5)
                  if (del_content5 !== ins_content5) {
                    var item5 = {
                      word: del_content5,
                      diff: del[c].del + ins[c],
                      index: del[c].del_index,
                    };
                    sen_result.push(item5);
                  }
                }
                var temp_del = del.slice(ins.length, del.length);
                for (var f = 0; f < temp_del.length; f++) {
                  var diff6 = temp_del[f].del;
                  var del_content6 = temp_del[f].del.replace(
                    /(<del[^>]*?>)|(<\/del>)/g,
                    ""
                  );
                  // console.log("e", diff6)
                  // console.log("e", del_content6)
                  var item6 = {
                    word: del_content6,
                    diff: diff6,
                    index: temp_del[f].del_index,
                  };
                  sen_result.push(item6);
                }
              }
            }
          }
        }
        final_result.push(sen_result);
      }
      // console.log("--", final_result);
      //再取一次数据，判断是属于哪个单词的修改，判断该修改是否存在
      //如果存在，直接加入用户，如果不存在，加入该修改以及用户
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          this.dbList = res.data[0].diffList;
        });
      // console.log("dbDiffList2", this.dbList);

      for (var r = 0; r < final_result.length; r++) {
        //r表示文本中的第r句
        var s_orders = final_result[r]; //第r句的修改记录
        var s_words = this.dbList[r].words; //第r句的分词结果
        if (s_words.length == 0) {
          //第r句的修改记录为空
          for (var v = 0; v < s_words.length; v++) {
            s_words[v].diffs[0].names.push(this.username);
            s_words[v].diffs[0].num++;
            s_words[v].diffs[0].time = newdate;
          }
        } else {
          //第r句的修改记录不为空
          for (var w = 0; w < s_words.length; w++) {
            //x表示第x个修改
            for (var x = 0; x < s_orders.length; x++) {
              //w表示该句中的第w个单词
              if (
                s_orders[x].word == s_words[w].word &&
                s_orders[x].index == w
              ) {
                //如果找到对应的词
                //再加一个判断：判断单词的位置
                var find_result = this.findElem(
                  s_words[w].diffs,
                  "diff",
                  s_orders[x].diff
                );
                if (find_result == -1) {
                  //不存在
                  var names = [];
                  names.push(this.username);
                  var diff_item = {
                    diff: s_orders[x].diff,
                    names: names,
                    num: 1,
                    time: newdate,
                  };
                  s_words[w].diffs.push(diff_item);
                } else {
                  s_words[w].diffs[find_result].names.push(this.username); //将当前用户加入列表
                  s_words[w].diffs[find_result].num++; //数量加1
                  s_words[w].diffs[find_result].time = newdate; //更新日期
                }
              } else {
                //没有做出修改的单词
                // console.log("lllll", s_words[w].diffs[0].names)
                s_words[w].diffs[0].names.push(this.username);
                s_words[w].diffs[0].num++;
                s_words[w].diffs[0].time = newdate;
              }
            }
          }
        }
      }
      // console.log("bbb", this.dbList);
      //判断当前用户是否在userList中
      for (var h = 0; h < this.userList.length; h++) {
        if (this.username == this.userList[h].name) {
          this.inUserList = true;
        }
      }
      //如果没有则增加
      if (this.inUserList == false) {
        this.userList.push({ name: this.username });
      }
      //更新相应数据到数据库
      this.$axios
        .post(this.api + "/updatediff", {
          params: {
            _id: this.diffId,
            userList: this.userList,
            diffList: this.dbList,
          },
        })
        .then((result) => {
          console.log(result);
        });

      var new_version = this.sentenceList.join(" ");
      this.$axios
        .post(this.api + "/updateVersion", {
          params: {
            _id: this.diffId,
            new_version: new_version,
            time: newdate,
            username: this.username,
          },
        })
        .then((result) => {
          console.log(result);
        });
      //关闭输入框
      this.isedit = false;
      //显示提示信息
      this.$message({
        message: "修改成功",
        type: "success",
      });
      this.createFinalVersion();
    },
    //生成综合版本
    createFinalVersion() {
      this.$axios
        .get(this.api + "/currentTask?_id=" + this.diffId)
        .then((res) => {
          this.dbList = res.data[0].diffList;
          // console.log("dbList", this.dbList);
          var final_sentences = [];
          var only_sentences = [];
          var only_sentences1 = [];
          for (var k = 0; k < this.dbList.length; k++) {
            var original_sentence = this.dbList[k].sentence;
            var words = this.dbList[k].words;
            var most_words = [];
            for (var w = 0; w < words.length; w++) {
              var words_diffs = this.dbList[k].words[w].diffs;
              var most_edited_word = words_diffs[words_diffs.length - 1].diff; //初始值
              //按时间排序
              var words_diffs1 = words_diffs.sort(this.compare("time"));
              //按用户数量排序
              var words_diffs2 = words_diffs1.sort(this.compare("num"));
              most_edited_word = words_diffs2[words_diffs2.length - 1].diff;
              most_words.push(most_edited_word);
            }
            for (var s = 0; s < most_words.length; s++) {
              most_words[s].trim();
              most_words[s] = most_words[s] + " ";
            }
            var final_sentence = most_words.join("");
            final_sentences.push({
              final_sentence: final_sentence,
              final_words: most_words,
            });
            only_sentences.push(final_sentence);
          }
          for (var t = 0; t < only_sentences.length; t++) {
            var final_sentence1 = only_sentences[t]
              .replace(/(<del[^>]*?>.*?<\/del>)/g, "")
              .replace(/(<ins[^>]*?>)|(<\/ins>)/g, "");
            // console.log(only_sentences[t])
            only_sentences1.push(final_sentence1);
          }
          // console.log(only_sentences1);
          this.final_context = final_sentences;
          this.sentenceList = only_sentences1;
        });
      // console.log("aaaa", this.dbList);
      //显示提示信息
      this.$message({
        message: "已更新",
        type: "success",
      });
    },
    //排序相关
    compare(key) {
      return function (value1, value2) {
        var val1 = value1.key;
        var val2 = value2.key;
        return val1 - val2;
      };
    },
    //ES6语法 数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    showAll(index, s_index) {
      //s_index表示句子序号；index表示单词序号
      this.seen = true;
      this.current = index;
      this.tempindex = index;
      this.isActive = true;
      this.isShowAll = true;
      var words = this.dbList[s_index].words;
      this.tableData = words[index].diffs;
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].names = this.unique(this.tableData[i].names)
        // this.tableData[i].names = unique_names.join(", ");
      }
    },
    closeShow() {
      this.seen = false;
      this.current = null;
      this.tempindex = null;
      this.isActive = false;
      this.isShowAll = false;
    },
  },
  //页面生成前要做的工作
  created() {
    //可以考虑加个动画，因为有较多数据要加载，不然会显得页面卡顿
    this.diffId = this.$route.params.diffId;
    this.username = sessionStorage.getItem("userName");
    //渲染之前请求数据，判断是否有第一版本
    this.$axios
      .get(this.api + "/currentTask?_id=" + this.diffId)
      .then((res) => {
        var video_id = res.data[0].videoId; //对应视频的_id
        this.userList = res.data[0].userList;
        this.diffList = res.data[0].diffList;
        // console.log(this.userList);
        //获取视频路径，从服务器获取
        this.$axios
          .get(this.api + "/currentVideo?_id=" + video_id)
          .then((res) => {
            this.fileName = res.data[0].fileName;
            var filetype = this.fileName.split(".")[1];
            for (var i = 0; i < this.videoType.length; i++) {
              if (filetype == this.videoType[i]) {
                this.isVideo = true;
              }
            }
          });
        //先判断是否有修改记录，再判断是否有第一版本
        if (this.diffList.length == 0) {
          this.$axios
            .get(this.api + "/allVersions?_id=" + this.diffId)
            .then((res) => {
              if (res.data.length == 0) {
                //当前无人提交版本，显示输入框
                this.isversion1 = false;
              } else {
                this.isversion1 = true;
                this.text_v1 = res.data[0].version;
              }
            });
        } else {  
          //形成综合版本
          this.createFinalVersion();
          this.isversion1 = true;
          this.isFinal = true;
        }
      });
  },
  updated() {
    //判断是音频还是视频
    this.decidePlayer();
  },
};
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.edit {
  background-color: lavender;
}

ins {
  color: green;
}

del {
  color: red;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
#textDiv {
  margin-top: 0;
  padding: 1% 2%;
  font-size: 14px;
  background-color: white;
  border-radius: 6px;
  width: 90%;
  height: 200px;
  text-align: left;
}
p {
  word-wrap: break-word;
  word-break: break-all;
}
#insertText {
  text-decoration: none;
  color: #21bf73;
}

#deleteText {
  color: #ef6c57;
  text-decoration: line-through #ea4c4c solid;
}
.box-card {
  width: 1000px;
  margin-top: 2%;
}
.active:hover {
  color: rgb(0, 0, 95);
  border-radius: 2px;
  border-bottom: 1px solid black;
}
</style>
