<template>
<div>
    <q-layout>
        <q-header elevated class="bg-grey-1">
            <q-toolbar>
                <q-toolbar-title>
                    <a class="navbar-brand" href="#/"><img src="../../../assets/logo/7.png"></a>
                </q-toolbar-title>
                <q-btn flat @click="drawer = !drawer" round dense icon="menu" text-color="purple" />
            </q-toolbar>
        </q-header>

        <q-drawer v-model=" drawer" show-if-above :width="220" :breakpoint="400">
            <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
                <q-list padding>
                    <q-item active clickable v-ripple to="/profile/mytasks">
                        <q-item-section avatar>
                            <q-icon name=" star" />
                        </q-item-section>

                        <q-item-section>
                            <span class="sidebar-item-name">Tasks</span>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/profile/mycomments">
                        <q-item-section avatar>
                            <q-icon name="inbox" />
                        </q-item-section>

                        <q-item-section>
                            <span class="sidebar-item-name">Comments</span>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/profile/published">
                        <q-item-section avatar>
                            <q-icon name=" send" />
                        </q-item-section>

                        <q-item-section>
                            <span class="sidebar-item-name">Posts</span>
                        </q-item-section>
                    </q-item>

                    <q-separator inset class="q-my-sm" />

                    <q-item clickable v-ripple to="/task">
                        <q-item-section avatar>
                            <q-icon name=" drafts" />
                        </q-item-section>

                        <q-item-section>
                            <span class="sidebar-item-name">New Task</span>
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/addUsers">
                        <q-item-section avatar>
                            <q-icon name=" drafts" />
                        </q-item-section>

                        <q-item-section>
                            <span class="sidebar-item-name">Import Student List</span>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>

            <q-img class="absolute-top" style="height: 150px; background-color: #f4f4f4">
                <div class="absolute-bottom bg-transparent">
                    <avatar :username="name" class="avatar-box"></avatar>
                    <div class="text-weight-bold account-name">{{ name }}</div>
                </div>
            </q-img>
        </q-drawer>
    </q-layout>
</div>
</template>

<script>
import Avatar from "vue-avatar";
export default {
    name: "MySideBar",
    data() {
        return {
            name: "", //当前用户的用户名
            userId: "", //当前用户的_id  可根据这两个信息去数据库User取数据
            api: "/api",
            drawer: false,
        };
    },
    components: {
        Avatar,
    },
    methods: {

    },
    created() {
        this.name = sessionStorage.getItem("userName");
        this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
            this.userId = res.data[0]._id; //找地方保存
        });
    },
}
</script>

<style>
.q-list--padding {
    padding: 8px 5px 8px 20px;
}

.q-toolbar__title:first-child {
    padding: 12px 30px 10px;
    padding-left: 3em;
}

.q-item__section--avatar {
    min-width: 20px;
}

.avatar-box {
    transform: scale(1.15)
}

.vue-avatar--wrapper {
    margin: 0 auto;
    margin-bottom: 12px;
    text-align: center;
}

.account-name {
    margin-top: 15px;
    margin: 0 auto;
    margin-bottom: 5px;
    text-align: center;
    color: black;
    font-family: "Prata";
    font-size: 1.25em;
}

i.material-icons.q-icon.notranslate {
    color: #a37eba;
}

.q-item.q-router-link--active,
.q-item--active {
    color: purple;
}

a:hover {
    color: purple;
    text-decoration: none;
}

.sidebar-item-name {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
}
</style>
