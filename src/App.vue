<template>
  <div id="app">
    <div
      class="header top header-img"
      :style="{ 'background-image': `url('/assets/img/${state.randomBG}.jpg')` }"
      :class="{ page: !state.isLoggedIn, small: state.isLoggedIn }"
      id="status-header"
    >
      <span class="title center">Kiera Bot</span>
      <span class="sub-title center">
        <span>Welcome to my web portal ^_^</span>
      </span>
      <span class="sub-title center" id="bot-connectivity" v-if="state.isLoggedIn">
        <span v-if="state.isConnected">🔌</span>
        <span v-if="state.isConnecting">⛔</span>
      </span>

      <Login :bot="bot" :state="state" v-if="!state.isLoggedIn"></Login>

      <!-- <AccountDropdown :bot="bot" v-if="state.isLoggedIn"></AccountDropdown> -->
      <div :class="['account-dropdown']">
        <span class="username">{{ bot.user.username }}#{{ bot.user.discriminator }}</span>
        <div class="ui avatar image" :style="{ 'background-image': `url('https://cdn.discordapp.com/avatars/146439529824256000/${bot.user.avatar}.png')` }"></div>
      </div>
    </div>

    <div class="content centered max-width-1000" v-if="state.isLoggedIn && state.isConnected">
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"> <i class="el-icon-s-operation"></i> Server </span>
          <div class="column-4">
            <el-select class="server-select" v-model="state.focusedGuildId" placeholder="Select a Discord server" @input="updateSelectedGuild">
              <el-option-group v-for="guildGroup in bot.guilds" :key="guildGroup.label" :label="guildGroup.label">
                <el-option v-for="guild in guildGroup.options" :key="guild.id" :label="guild.name" :value="guild.id"></el-option>
              </el-option-group>
            </el-select>

            <Sidebar v-show="state.focusedGuildId !== ''" :state="state" v-on:onPanelChange="handlePanelChange"></Sidebar>
          </div>
          <div class="column-8">
            <component v-bind:is="state.focusedPanel" :bot="bot" :state="state"></component>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Audit Log">
          <span slot="label"> <i class="el-icon-tickets"></i> Audit Log </span>
          <AuditPanel :bot="bot" :state="state" />
        </el-tab-pane>
        <el-tab-pane label="Account">
          <span slot="label"> <i class="el-icon-user"></i> Account </span>
          <Account :bot="bot" :state="state" />
        </el-tab-pane>
        <el-tab-pane label="Logout">
          <span slot="label">
            <el-link type="danger" @click="logout()"> <i class="el-icon-user"></i> Logout </el-link>
          </span>
          <el-row>Logging you out...</el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <transition name="fade">
      <CenterLoader :state="state" v-if="!state.isConnected" />
    </transition>
  </div>
</template>

<script <script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'
import { Component, Prop } from 'vue-property-decorator'
import * as SocketIO from 'socket.io-client'

// Defaults
import { state, focusedGuild } from './defaults/app-state'
import { user } from './defaults/user'
import { mappedGuilds, DiscordGuild } from './defaults/guilds'
import { defaultStats } from './defaults/bot-statistics'

// Components
// import AccountDropdown from "./components/account-dropdown.vue";
import CenterLoader from './components/center-loader.vue'
import Login from './components/login.vue'
import Sidebar from './components/sidebar.vue'

// Panels
import Account from './panels/Account.vue'
import AuditPanel from './panels/AuditLog.vue'
import ChastiKey from './panels/ChastiKey.vue'
import PermissionsPanel from './panels/PermissionsList.vue'
import ServerNotificationsPanel from './panels/ServerNotifications.vue'
import ServerSettingsUserPanel from './panels/ServerSettingsUser.vue'
import ServerSettingsPanel from './panels/ServerSettings.vue'
import WelcomePanel from './panels/Welcome.vue'
import { BotStatistics } from './types/statistics'

export const routes: { [key: string]: any } = {
  '/app/': WelcomePanel,
  '/app/server/permissions': PermissionsPanel,
  '/app/server/notifications': ServerNotificationsPanel
}

@Component({
  components: {
    // AccountDropdown,
    CenterLoader,
    Login,
    Sidebar,
    // Panels
    Account,
    AuditPanel,
    ChastiKey,
    PermissionsPanel,
    ServerNotificationsPanel,
    ServerSettingsPanel,
    ServerSettingsUserPanel,
    WelcomePanel
  }
})
export default class App extends Vue {
  @Prop({ default: '/app/' })
  private currentRoute!: string

  @Prop({
    default: () => state
  })
  private state!: typeof state

  @Prop({
    default: () => SocketIO.connect(process.env.BOT_SOCKET)
  })
  public socket!: SocketIOClient.Socket

  @Prop({
    default: () => {
      return {
        webToken: '',
        user: user,
        guilds: mappedGuilds,
        stats: defaultStats
      }
    }
  })
  public bot!: {
    webToken: string
    user: typeof user
    guilds: typeof mappedGuilds
    stats: BotStatistics
  }

  public viewComponent() {
    return routes[this.currentRoute] || WelcomePanel
  }

  public get isGuildOwner() {
    const _guild = this.bot.user.guilds.find((g) => g.id === this.state.focusedGuildId)
    return _guild ? _guild.owner : false
  }

  constructor() {
    super()

    console.log('state', this.state)

    // On socket connection event
    this.socket.on('connect', async () => {
      console.log('socket connected', this)
      // Short delay to prevent flickering
      setTimeout(() => {
        this.state.isConnected = true
      }, 500)
      this.state.isConnecting = false
      // Connect and get user data
      this.bot.user = await this.getUser()
      // If user is newly authenticated
      if (this.bot.user && this.state.isLoggedIn === false) {
        setTimeout(() => {
          // Remap guilds
          this.state.isLoggedIn = true
          this.remapGuilds(this.bot.user.guilds)
        }, 350)
      }
      // If user was already logged in and this was a socket reconnect
      if (this.bot.user && this.state.isLoggedIn === true) {
        // this.state.isLoggedIn = true;
      }
      console.log(this.bot)
    })
    this.socket.on('heartbeat', (data: any) => {
      console.log('socket heartbeat', data)
      // Update stats
      this.bot.stats = data.stats
      console.log('socket heartbeat', this.bot.stats)
    })
    this.socket.on('disconnect', () => {
      this.state.isConnected = false
      this.state.isConnecting = false
    })
  }

  private handlePanelChange($event: { panel: string; view: string }) {
    this.state.focusedPanel = $event.panel
    this.state.focusedView = $event.view
  }

  private async getUser() {
    const resp = await Axios(`${process.env.BOT_HOST}/user`, {
      method: 'POST',
      data: {
        id: (<any>document.cookie).match('(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)').pop()
      },
      headers: {
        webToken: (<any>document.cookie).match('(^|;)\\s*kiera-webToken\\s*=\\s*([^;]+)').pop(),
        id: (<any>document.cookie).match('(^|;)\\s*kiera-discord-id\\s*=\\s*([^;]+)').pop()
      }
    })

    // On valid resp
    if (resp.status === 200) return resp.data
    return null
  }

  private remapGuilds(guilds: Array<any>) {
    // Map guilds into remapped var
    for (let index = 0; index < guilds.length; index++) {
      const guild = guilds[index]
      if (guild.owner) (<any>this.bot.guilds[0].options).push(guild)
      else (<any>this.bot.guilds[1].options).push(guild)
    }
  }

  private updateSelectedGuild(id: any) {
    console.log('updateSelectedGuild =>', id)
    // Find guild in array of guilds
    const guild = this.bot.user.guilds.findIndex((g: DiscordGuild, i: number) => {
      console.log(i, g.id)
      return g.id === id
    })
    console.log('guild', guild)

    if (guild > -1) {
      console.log('updateSelectedGuild.index =>', guild)
      // Update focused Guild object
      this.state.focusedGuild = this.bot.user.guilds[guild]
      console.log('state.focusedGuild =>', this.state)
      // If guild is now owned by this user clear the panel
      this.state.focusedPanel = ''
      this.state.focusedView = ''
      this.state.isGuildOwner = this.bot.user.guilds[guild].owner
      console.log('guild.owner', this.bot.user.guilds[guild].owner)
    } else {
      this.state.isGuildOwner = false
    }
  }

  private logout(url: string) {
    window.location.href = `/logout`
  }
}
</script>

<style lang="less">
@import './less/kii.less';
@import 'https://unpkg.com/element-ui/lib/theme-chalk/index.css';

#app {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.header {
  position: fixed;
  -webkit-transition: all 0.6s;
  z-index: 100;
  .sub-title {
    position: relative;
    width: 200px;
    margin: auto;
    background-color: #013955;
    background: inherit;
    overflow: hidden;
    &:after {
      position: absolute;
      content: '';
      width: 1000px;
      height: 500px;
      background: inherit;
      left: -25px;
      top: -10px;
      box-shadow: inset 0 0 0 150px rgba(76, 76, 76, 0.05);
      filter: blur(5px);
      z-index: 1;
    }
    > span {
      position: relative;
      margin-top: 60px;
      text-align: center;
      z-index: 2;
      color: #fff;
    }
  }
  &.header-img {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    color: #ffffff;
  }
  #bot-connectivity {
    position: absolute;
    bottom: 10px;
    width: 33px;
    margin-left: 10px;
  }
}

// Content
.content.centered {
  margin-top: 200px;
}

// Loader transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Dropdown
.server-select {
  width: 100%;
}

// Account - top right
.account-dropdown {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 195px;
  height: 55px;
  display: block;
  -webkit-transition: all 0.12s;
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

span.username {
  position: absolute;
  right: 55px;
  top: 20px;
  display: block;
}
</style>
