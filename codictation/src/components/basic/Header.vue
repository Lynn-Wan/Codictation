<template>
<div class="navigation-wrap bg-light start-header start-style">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <nav class="navbar navbar-expand-md navbar-light">

                    <a class="navbar-brand" href="#/"><img src="../../assets/logo/7.png"></a>

                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto py-4 py-md-0">
                            <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                <a class="nav-link" href="#/">Home</a>
                            </li>
                            <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                <a class="nav-link" href="#/dictation">Dictation</a>
                            </li>
                            <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                <a class="nav-link" href="#/">Other functions...</a>
                            </li>
                            <!--
                            <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Services</a>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="#">Action</a>
                                    <a class="dropdown-item" href="#">Another action</a>
                                    <a class="dropdown-item" href="#">Something else here</a>
                                    <a class="dropdown-item" href="#">Another action</a>
                                </div>
                            </li>
                            -->
                        </ul>
                        <b-navbar-nav class="ml-auto">
                            <!--
                            <form class="form-inline my-2 my-lg-0">
                                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
                                    <q-icon name="search" />
                                </button>
                            </form>
                            -->
                            <b-nav-item-dropdown right v-if="name">
                                <!--Using 'button-content' slot-->
                                <template v-slot:button-content>
                                    <em>{{ name }}</em>
                                </template>
                                <b-dropdown-item href="#/profile/">
                                    <q-icon name="account_circle" class="setting-icons"></q-icon>
                                    <span>Profile</span>
                                </b-dropdown-item>
                                <b-dropdown-item @click=" logout()">
                                    <q-icon name="exit_to_app" class="setting-icons"></q-icon>
                                    <span>Sign Out</span>
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                            <b-navbar-nav v-else>
                                <b-nav-item @click="login()">Sign In</b-nav-item>
                            </b-navbar-nav>
                        </b-navbar-nav>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            userId: "",
            name: "",
            api: "/api",
        };
    },
    methods: {
        login() {
            this.$router.replace("/login");
        },
        logout() {
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("elementToken");
            this.$router.replace("/");
        },
    },
    created() {
        this.name = sessionStorage.getItem("userName");
        console.log(this.name);
        this.$axios.get(this.api + "/profile?name=" + this.name).then((res) => {
            this.userId = res.data[0]._id; //找地方保存
        });
    },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=devanagari,latin-ext');

body {
    font-size: 17px;
    line-height: 24px;
    font-weight: 400;
    color: #212112;
    background-color: #fff;
    overflow-x: hidden;
    transition: all 200ms linear;
}

::selection {
    color: #fff;
    background-color: #8167a9;
}

::-moz-selection {
    color: #fff;
    background-color: #8167a9;
}

/* #Navigation
================================================== */

.start-header {
    opacity: 1;
    transform: translateY(0);
    padding: 10px 0 3px 0;
    box-shadow: 0 10px 30px 0 rgba(138, 155, 165, 0.15);
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
}

.start-header.scroll-on {
    box-shadow: 0 5px 10px 0 rgba(138, 155, 165, 0.15);
    padding: 10px 0;
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
}

.start-header.scroll-on .navbar-brand img {
    height: 24px;
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
}

.navigation-wrap {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
}

.navbar {
    padding: 0;
}

.navbar-brand img {
    height: 28px;
    width: auto;
    display: block;
    filter: brightness(10%);
    -webkit-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    transform: scale(1.1);
}

.navbar-toggler {
    float: right;
    border: none;
    padding-right: 0;
}

.navbar-toggler:active,
.navbar-toggler:focus {
    outline: none;
}

.navbar-light .navbar-toggler-icon {
    width: 24px;
    height: 17px;
    background-image: none;
    position: relative;
    border-bottom: 1px solid #000;
    transition: all 300ms linear;
}

.navbar-light .navbar-toggler-icon:after,
.navbar-light .navbar-toggler-icon:before {
    width: 24px;
    position: absolute;
    height: 1px;
    background-color: #000;
    top: 0;
    left: 0;
    content: '';
    z-index: 2;
    transition: all 300ms linear;
}

.navbar-light .navbar-toggler-icon:after {
    top: 8px;
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon:after {
    transform: rotate(45deg);
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon:before {
    transform: translateY(8px) rotate(-45deg);
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
    border-color: transparent;
}

.nav-link {
    color: #212121 !important;
    font-weight: 500;
    transition: all 200ms linear;
}

.nav-item:hover .nav-link {
    color: #8167a9 !important;
}

.nav-item.active .nav-link {
    color: #777 !important;
}

.nav-link {
    position: relative;
    padding: 5px 0 !important;
    display: inline-block;
}

.nav-item:after {
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    content: '';
    background-color: #8167a9;
    opacity: 0;
    transition: all 200ms linear;
}

.nav-item:hover:after {
    bottom: 0;
    opacity: 1;
}

.nav-item.active:hover:after {
    opacity: 0;
}

.nav-item {
    position: relative;
    transition: all 200ms linear;
    font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
}

/* #Primary style
================================================== */

.bg-light {
    background-color: #fff !important;
    transition: all 200ms linear;
}

.nav-item .dropdown-menu {
    transform: translate3d(0, 10px, 0);
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    display: block;
    padding: 0;
    margin: 0;
    transition: all 200ms linear;
}

.nav-item.show .dropdown-menu {
    opacity: 1;
    visibility: visible;
    max-height: 999px;
    transform: translate3d(0, 0px, 0);
}

.dropdown-menu {
    padding: 10px !important;
    margin: 0;
    font-size: 13px;
    letter-spacing: 1px;
    color: #212121;
    background-color: #fcfaff;
    border: none;
    border-radius: 3px;
    box-shadow: 0 5px 10px 0 rgba(138, 155, 165, 0.15);
    transition: all 200ms linear;
}

.dropdown-toggle::after {
    display: none;
}

.dropdown-item {
    padding: .35rem .8rem;
    border-radius: 2px;
    transition: all 200ms linear;
    font-size: 14px;
    font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;

    setting-icons {
        font-size: 1.5em;
        margin-right: 10px;
        color: #bea9dd;
    }
}

.dropdown-item:hover,
.dropdown-item:focus {
    color: #fff;
    background-color: rgba(129, 103, 169, .6);
}

.setting-icons {
    width: 24px;
    height: 24px;
    font-size: 24px;
    margin-right: 1em;
}
</style>
