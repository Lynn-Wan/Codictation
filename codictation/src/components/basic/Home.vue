<template>
<div>
    <Header></Header>
    <section class="banner-area">
        <!--<div class="overlay overlay-bg"></div>-->
        <div class="banner-content">
            <div class="subtitle">
                <span>It's Time To Modify Others' Dictation!</span>
            </div>
            <h1 class="headline">Welcome to Co-Dictation!</h1>
            <p>
                Listen & Watch, Read & Modify, Record & Share New Information <br>
                Based on what you have captured from these diverse media. Everyone's welcome.
            </p>
            <a class="button" href="#/dictation" target=" /black">It's time to codictate!</a>
        </div>
    </section>
</div>
</template>

<script>
import Header from "../basic/Header.vue";
export default {
    components: {
        Header
    },
    data() {
        return {
            slide: 1,
            autoplay: true
        }
    }
};
</script>

<style lang="scss">
html,
body,
#app {
    width: 100vw;
    height: 100vh;
    // overflow: hidden;
}

.banner-content {
    text-align: center;
}

// .overlay-bg {
//     background: rgba(0, 0, 0, 0.7);
// }

// .overlay {
//     position: absolute;
//     left: 0;
//     right: 0;
//     top: 0;
//     bottom: 0;
// }

.banner-area {
    position: absolute;
    padding-top: 9em;
    height: 100%;
    width: 100%;
    display: block;
    background: url("../../assets/logo/bg-2.jpg") no-repeat center center/cover;
    // min-height: 800px;

    // @media (max-width: 992px) {
    //     min-height: 700px;
    // }
}

.headline {
    font-size: 78px;
    line-height: 1.2;
    font-weight: 400;
    color: rgba(8, 8, 8, 1);
    text-align: center;
    font-feature-settings: 'pnum'on, 'lnum'on;
    font-family: gt-super, Georgia, Cambria, "Times New Roman", Times, serif;
    letter-spacing: -0.05em;
    // line-height: 74px;
    margin-top: 0.45em;
    margin-bottom: 0.2em;
}

p {
    margin: 0;
    padding-top: 10px;
    opacity: 1;
    transform: translate(0);
    transition: all 300ms linear;
    transition-delay: 1500ms;
    color: rgb(153, 153, 153);
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.subtitle {
    position: relative;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 700;
    font-size: 14px;
}

.subtitle:before {
    margin-left: -68px;
    text-align: right;
}

.subtitle:after {
    margin-left: 15px;
}

.subtitle:before,
.subtitle:after {
    position: absolute;
    top: 50%;
    overflow: hidden;
    width: 50px;
    height: 1px;
    border-top: 1px solid #cdcfd6;
    content: '';
}

.button {
    font-family: 'Roboto Mono', sans-serif;
    text-decoration: none;
    font-weight: 800;
    text-transform: uppercase;
    font-size: 2vmin;
    display: inline-block;
    position: relative;
    border: 3px solid purple;
    box-shadow: -0.5vmin 0.5vmin 0 rgba(purple, 0.5);
    background: transparent;
    margin-top: 7vmin;
    mix-blend-mode: multiply;
    color: purple;
    padding: 2vmin 2vmin 1.8vmin 2vmin;
    letter-spacing: 0.1em;
    text-shadow: none;
    line-height: 1;
    transform: translate3d(0.5vmin, -0.5vmin, 0);
    transition: all 100ms linear;

    &:hover {
        transform: translate3d(1vmin, -1vmin, 0);
        box-shadow: -1vmin 1vmin 0 rgba(rgb(184, 95, 184), 0.5);
        border: 3px solid rgb(185, 114, 185);
        background: rgb(185, 114, 185);
        color: white;
    }

    &:active {
        transform: translate3d(0px, 0px, 0);
        box-shadow: -0px 0px 0 rgba(purple, 0.5);
    }
}
</style>
