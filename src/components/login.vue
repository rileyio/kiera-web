<template>
  <div>
    <nav class="center">
      <span class="center-button" onclick="window.location='/login'">Login</span>
    </nav>
    <slot name="stats"></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";

@Component
export default class Login extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state;
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
}

.header .sub-title {
  width: 200px;
  margin: auto;
  background-color: #3b466e;
}

.header.img {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  color: #ffffff;
  background-image: url("/assets/img/abstract-astro-astronomy-956999.jpg");
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

nav.center {
  margin: 30px;
}

span {
  &.center-button {
    -webkit-transition: all 0.4s;
    transition: all 0.4s;
    padding: 10px 87px;
    background-color: #434f79d4;
    box-shadow: 0 0 7px 2px #15151587;
    margin: 2px;
    font-size: 15px;
    border-radius: 3px;
    &:hover {
      background-color: #2c376d;
      border-color: #2c376d;
      cursor: pointer;
    }
  }
}
</style>
