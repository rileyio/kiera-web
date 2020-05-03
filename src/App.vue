<template>
  <div id="app">
    <!-- Header -->
    <header><NavBar :state="state" :bot="bot" /></header>

    <!-- Main Content -->
    <!-- <b-container :class="$route.name === 'home' ? 'fill-height' : ''" :fluid="$route.name === 'home' ? true : false"> -->
    <router-view :state="state" :isAuthenticated="state.isLoggedIn"></router-view>
    <!-- </b-container> -->

    <!-- Footer -->
    <footer></footer>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'
import { Component, Prop } from 'vue-property-decorator'
import * as SocketIO from 'socket.io-client'
import * as Utils from './utils'
import { BotStatistics } from './types/statistics'

// Defaults
import { state, focusedGuild } from './defaults/app-state'
import { bot } from './defaults/bot'
import { mappedGuilds, DiscordGuild } from './defaults/guilds'
import { defaultStats } from './defaults/bot-statistics'

// Components
import NavBar from '@/components/NavBar.vue'
import Sidebar from './components/sidebar.vue'
import CenterLoader from './components/center-loader.vue'

@Component({
  components: {
    NavBar,
    Sidebar,
    CenterLoader
  }
})
export default class App extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state

  @Prop({
    default: () => SocketIO.connect(process.env.VUE_APP_BOT_SOCKET)
  })
  public socket!: SocketIOClient.Socket

  @Prop({ default: () => bot })
  public bot!: typeof bot

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
        }, 350)
      }
      // If user was already logged in and this was a socket reconnect
      if (this.bot.user && this.state.isLoggedIn === true) {
        // this.state.isLoggedIn = true;
      }
      console.log(this.bot)
    })
    this.socket.on('heartbeat', (data: any) => {
      // console.log('socket heartbeat', data)
      // Update stats
      this.bot.stats = data.stats
      // console.log('socket heartbeat', this.bot.stats)
    })
    this.socket.on('disconnect', () => {
      this.state.isConnected = false
      this.state.isConnecting = false
    })
  }

  private async getUser() {
    const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/user`, {
      method: 'POST',
      data: {
        id: Utils.getUserID()
      },
      headers: Utils.buildRequestHeaders()
    })

    // On valid resp
    if (resp.status === 200) return resp.data
    return null
  }

  private logout(url: string) {
    window.location.href = `/logout`
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  background-color: #333;
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
</style>
