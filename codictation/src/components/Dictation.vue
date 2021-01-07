<template>
  <div>
    <div><Header></Header></div>
    <q-layout>
    <div>    
      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="!drawer || miniState"
        @click.capture="drawerClick"

        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-1"
      >
        <q-scroll-area class="fit">
          <q-list padding         
            v-for="(item, index) in sideBar"
            :key="index"
          >
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section>
                {{item.name}}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
        <div class="q-mini-drawer-hide absolute" style="bottom: 40px; left: 70px;">
          <q-btn
            round
            color="purple-3"
            icon="chevron_left"
            @click="miniState = true"
          />
        </div>
      </q-drawer>
    
    </div>
    <q-page-container>
    <div class="cards-container">
    <div class="cards-box q-pa-md items-center q-gutter-md justify-center">
      <q-card class="my-card" v-for="(v, index) in taskList" :key="index">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom">
            <div class="text-subtitle1">{{ v.title }}</div>
          </div>
        </q-img>

        <q-card-actions>
          <q-badge outline align="middle" color="purple-3">
            {{ v.label }}
          </q-badge>
          <q-btn flat @click="startEx(index)">Launch</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    </div>
    </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Header from "../components/basic/Header.vue";
export default {
  data() {
    return {
      taskList: [],
      code: "", //当前输入的验证码
      name: "", //当前用户
      api:"/api",
      drawer: false,
      miniState: false,
      sideBar: [
        {"name": "Economy", "icon": "account_balance"},
        {"name": "Science", "icon": "science"},
        {"name": "Politics", "icon": "gavel"},
        {"name": "Literature", "icon": "local_library"},
        {"name": "Coronavirus", "icon": "coronavirus"},
        {"name": "Health", "icon": "accessibility_new"},
        {"name": "Nature", "icon": "nature_people"},
        {"name": "Sports", "icon": "run_circle"},
        {"name": "Celebrity", "icon": "movie_filter"},
        {"name": "Others", "icon": "widgets"},
      ],
    };
  },
  methods: {
    startEx(index) {
      var diffId = this.taskList[index]._id; //任务_id
      var path = "/diff/" + diffId;
      var authcode = this.taskList[index].authcode; //任务对应的验证码
      if (authcode !== "") {
        this.$prompt("请输入验证码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            if (authcode === value) {
              this.$router.push(path);
              //跳转到相应的练习页面
            } else {
              this.$message.error("验证码错误");
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
      } else {
        this.$router.push(path);
      }
    },
    drawerClick(e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false
        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation()
      }
    },
  },
  components: {
    Header,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axios.get(this.api+"/taskList").then((res) => {
      var data = res.data;
      for (var i = 0; i < data.length; i++) {
        this.taskList.push(data[i]);
      }
    });
  },
};
</script>

<style>
.box-card {
  width: 40%;
}

.cards-container {
  margin-top: 4em;
  /* margin-bottom: 2.5em; */
  text-align: center;
}

.cards-box {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}

.my-card {
  width: 100%;
  max-width: 255px;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin-right: 0;
    margin-left: 0;
}

.q-card__actions.q-card__actions--horiz.row.justify-start {
    justify-content: space-around;
}

aside.q-drawer.q-drawer--left.q-drawer--bordered.q-drawer--standard,
aside.q-drawer.q-drawer--left.q-drawer--bordered.q-drawer--mini {
    position: fixed;
    margin-top: 3em;
}

.q-layout.q-layout--standard {
    min-height: auto !important;
}
</style>