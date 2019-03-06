<template>
  <div :class="[ {  } , 'account-dropdown' ]" @click="showAccountDropdown = !showAccountDropdown">
    <span class="username">{{bot.user.username}}#{{bot.user.discriminator}}</span>
    <div
      class="ui avatar image"
      :style="{ 'background-image': `url('https://cdn.discordapp.com/avatars/146439529824256000/${bot.user.avatar}.png')` }"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { mappedGuilds } from "../defaults/guilds";
import { user } from "../defaults/user";

@Component
export default class AccountDropdown extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state;

  @Prop({
    default: () => {
      return { webToken: "", user: user, guilds: mappedGuilds };
    }
  })
  public bot!: {
    webToken: string;
    user: typeof user;
    guilds: typeof mappedGuilds;
  };

  @Prop({ default: false })
  private showAccountDropdown!: boolean;

  constructor() {
    super();
  }
}
</script>

<style lang="less">
.account-dropdown {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 195px;
  height: 55px;
  display: block;
  cursor: pointer;
  -webkit-transition: all 0.12s;
  &:hover {
    background-color: #16171da1;
  }
}

span.username {
  position: absolute;
  right: 55px;
  top: 20px;
  display: block;
}

.ui.avatar.image {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  background-size: contain;
}

// .ui {
//   &.avatar.image {
//     border-radius: 50%;
//     width: 36px;
//     height: 36px;
//     // background-image: url("//cdn.discordapp.com/avatars/146439529824256000/c261586002cc23c078500f749e62a9e4.png");
//     background-size: contain;
//     cursor: pointer;
//   }
//   .username {
//     position: absolute;
//     bottom: 23px;
//     right: 50px;
//     font-size: 15px;
//     color: #a8afb5;
//   }
// }
</style>