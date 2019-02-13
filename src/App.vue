<template>
  <div id="app">
    <div class="header small top header-img" id="status-header">
      <span class="title center">Kiera Bot</span>
      <span class="sub-title center">Welcome to my web portal ^_^</span>
      <span class="sub-title center" id="bot-connectivity">
        <span v-if="state.isConnected">🔌</span>
        <span v-if="state.isConnecting">⛔</span>
      </span>

      <nav class="center"></nav>

      <nav class="right">
        <AccountDropdown :bot="bot"></AccountDropdown>
      </nav>
    </div>

    <div class="content centered max-width-1000">
      <div class="column-4">
        <el-select
          class="server-select"
          v-model="state.focusedGuildId"
          placeholder="Select a Discord server"
          @input="updateSelectedGuild"
        >
          <el-option-group
            v-for="guildGroup in bot.guilds"
            :key="guildGroup.label"
            :label="guildGroup.label"
          >
            <el-option
              v-for="guild in guildGroup.options"
              :key="guild.id"
              :label="guild.name"
              :value="guild.id"
            ></el-option>
          </el-option-group>
        </el-select>

        <Sidebar
          v-show="state.focusedGuildId !== ''"
          :state="state"
          v-on:onPanelChange="handlePanelChange"
        ></Sidebar>
      </div>
      <div class="column-8">
        <component v-bind:is="state.focusedPanel" :bot="bot" :state="state"></component>
      </div>
    </div>

    <transition name="fade">
      <CenterLoader v-if="state.isConnecting"/>
    </transition>
  </div>
</template>

<script <script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";
import { Component, Prop } from "vue-property-decorator";
import * as SocketIO from "socket.io-client";

// Defaults
import { state, focusedGuild } from "./defaults/app-state";
import { user } from "./defaults/user";
import { mappedGuilds, DiscordGuild } from "./defaults/guilds";

import AccountDropdown from "./components/account-dropdown.vue";
import CenterLoader from "./components/center-loader.vue";
import Sidebar from "./components/sidebar.vue";

// Panels
import WelcomePanel from "./panels/Welcome.vue";
import ServerNotificationsPanel from "./panels/ServerNotifications.vue";
import PermissionsPanel from "./panels/PermissionsList.vue";

export const routes: { [key: string]: any } = {
  "/app/": WelcomePanel,
  "/app/server/permissions": PermissionsPanel,
  "/app/server/notifications": ServerNotificationsPanel
};

@Component({
  components: {
    AccountDropdown,
    CenterLoader,
    Sidebar,
    // Panels
    WelcomePanel,
    ServerNotificationsPanel,
    PermissionsPanel
  }
})
export default class App extends Vue {
  @Prop({ default: "/app/" })
  private currentRoute!: string;
  @Prop({
    default: () => state
  })
  private state!: typeof state;
  @Prop({
    default: () => SocketIO.connect(process.env.BOT_SOCKET)
  })
  public socket!: SocketIOClient.Socket;
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

  public viewComponent() {
    return routes[this.currentRoute] || WelcomePanel;
  }

  public get isGuildOwner() {
    const _guild = this.bot.user.guilds.find(
      g => g.id === this.state.focusedGuildId
    );
    return _guild ? _guild.owner : false;
  }

  constructor() {
    super();

    console.log("state", this.state);

    this.socket.on("connect", async () => {
      console.log("socket connected");
      this.state.isConnected = true;
      this.state.isConnecting = false;
      // Connect and get user data
      this.bot.user = await this.getUser();
      // Remap guilds
      this.remapGuilds(this.bot.user.guilds);
      console.log(this.bot);
    });
    this.socket.on("heartbeat", (data: any) => {
      console.log("socket heartbeat", data);
    });
    this.socket.on("disconnect", () => {
      this.state.isConnected = false;
      this.state.isConnecting = false;
    });
  }

  private handlePanelChange($event: { panel: string; view: string }) {
    this.state.focusedPanel = $event.panel;
    this.state.focusedView = $event.view;
  }

  private async getUser() {
    const resp = await Axios(`${process.env.BOT_HOST}/user`, {
      method: "POST",
      data: {
        id: (<any>document.cookie)
          .match("(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)")
          .pop()
      },
      headers: {
        webToken: (<any>document.cookie)
          .match("(^|;)\\s*kiera-webToken\\s*=\\s*([^;]+)")
          .pop(),
        id: (<any>document.cookie)
          .match("(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)")
          .pop()
      }
    });

    // On valid resp
    if (resp.status === 200) return resp.data;
    return null;
  }

  private remapGuilds(guilds: Array<any>) {
    // Map guilds into remapped var
    for (let index = 0; index < guilds.length; index++) {
      const guild = guilds[index];
      if (guild.owner) (<any>this.bot.guilds[0].options).push(guild);
      else (<any>this.bot.guilds[1].options).push(guild);
    }
  }

  private updateSelectedGuild(id: any) {
    console.log("updateSelectedGuild =>", id);
    // Find guild in array of guilds
    const guild = this.bot.user.guilds.findIndex(
      (g: DiscordGuild, i: number) => {
        console.log(i, g.id);
        return g.id === id;
      }
    );
    console.log("guild", guild);

    if (guild > -1) {
      console.log("updateSelectedGuild.index =>", guild);
      // Update focused Guild object
      this.state.focusedGuild = this.bot.user.guilds[guild];
      console.log("state.focusedGuild =>", this.state);
      // If guild is now owned by this user clear the panel
      this.state.focusedPanel = "";
      this.state.focusedView = "";
      this.state.isGuildOwner = this.bot.user.guilds[guild].owner;
      console.log("guild.owner", this.bot.user.guilds[guild].owner);
    } else {
      this.state.isGuildOwner = false;
    }
  }
}
</script>

<style lang="less">
@import "./less/kii.less";
@import "https://unpkg.com/element-ui/lib/theme-chalk/index.css";
.header {
  .sub-title {
    width: 200px;
    margin: auto;
    background-color: #3b466e;
  }
  &.header-img {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: #ffffff;
    background-image: url("/assets/img/abstract-astro-astronomy-956999.jpg");
  }
  #bot-connectivity {
    width: 33px;
    margin-left: 10px;
  }
}

// Loader transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Dropdown
.server-select {
  width: 100%;
}
</style>