<template>
  <div>
    <div><Header></Header></div>
    <div class="content-box">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="purple-5"
        indicator-color="purple"
        align="justify"
      >
        <q-tab name="portfolio" label="Portfolio" />
        <q-tab name="alarms" label="Alarms" />
        <q-tab name="movies" label="Movies" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="portfolio" class="q-pa-none">
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs v-model="innerTab" vertical class="text-purple-9 tab-box">
                <q-img style="height: 150px">
                  <div class="absolute-center bg-transparent">
                    <avatar :username="name" class="avatar-box"></avatar>
                    <div class="text-subtitle1 account-name">{{ name }}</div>
                  </div>
                </q-img>
                <q-tab name="innerTasks" icon="assignment" label="Tasks" />
                <q-tab name="innerPosts" icon="send" label="Posts" />
                <q-tab name="innerComments" icon="comment" label="Comments" />
                <q-separator insert class="q-my-sm" />
                <q-tab name="innerNewTask" icon="add_task" label="New Task" />
                <q-tab
                  name="innerAddUsers"
                  icon="group_add"
                  label="Add Users"
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerTab"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerTasks">
                  <my-tasks></my-tasks>
                </q-tab-panel>

                <q-tab-panel name="innerPosts">
                  <my-posts></my-posts>
                </q-tab-panel>

                <q-tab-panel name="innerComments">
                  <my-comments></my-comments>
                </q-tab-panel>

                <q-tab-panel name="innerNewTask">
                  <new-task></new-task>
                </q-tab-panel>

                <q-tab-panel name="innerAddUsers">
                  <add-users></add-users>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>

        <q-tab-panel name="alarms">
          <div class="text-h6">Alarms</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="movies">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
import Header from "../../basic/Header.vue";
import Avatar from "vue-avatar";
import NewTask from "../task";
import AddUsers from "../addUsers";
import MyTasks from "../mytasks";
import MyPosts from "../published";
import MyComments from "../mycomments";

export default {
  data() {
    return {
      name: "", //当前用户的用户名
      userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
      api: "/api",
      tab: "portfolio",
      innerTab: "innerTasks",
      splitterModel: 20,
    };
  },
  components: {
    Header,
    Avatar,
    NewTask,
    AddUsers,
    MyTasks,
    MyPosts,
    MyComments,
  },
  created() {
    this.name = sessionStorage.getItem("userName");
    this.$axis.get(this.api + "/profile?name=" + this.name).then((res) => {
      this.userId = res.data[0]._id; //找地方保存
    });
  },
};
</script>

<style lang="scss">
.content-box {
  margin-top: 4.5em;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0px;
  margin-left: 0px;
}

.account-name {
  color: black;
  font-family: "Prata";
  font-size: 20px;
  margin-top: 0.6em;
  font-weight: bold;
  text-align: center;
}

.avatar-box {
  transform: scale(1.15);
}

.absolute-center {
  margin-top: 6px;
}

.column {
  flex-direction: row;
}

.q-tab__content {
  width: 100%;
}

.q-tab__icon {
  position: absolute;
  left: 0;
  margin: 0 10%;
}

.q-tab__label {
  margin-left: 25px;
}

.q-splitter__panel.q-splitter__before {
  width: 16% !important;
}

.q-tab--full {
  min-height: 56px;
}
</style>
