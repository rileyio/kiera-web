<template>
  <div class="nav-dropdown" id="navmenu-autoid-0">
    <div class="ui avatar image"></div>
  </div>
</template>

<script <script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class AccountDropdown extends Vue {
  constructor() {
    super();
  }
}
</script>

<style lang="less">
.ui {
  &.avatar.image {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    background-image: url("//cdn.discordapp.com/avatars/146439529824256000/c261586002cc23c078500f749e62a9e4.png");
    background-size: contain;
    cursor: pointer;
  }
}
</style>