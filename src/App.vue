<template>
  <div id="app">
    <!-- Header -->
    <header :style="{ 'z-index': 1 }">
      <div class="bg" :style="{ 'background-image': `url('/img/${AppState.state.randomBG}.jpg')` }"></div>
      <NavBar :AppState="AppState" />
    </header>

    <!-- Main Content -->
    <div class="content" :class="{ home: $route.name === 'home' }">
      <router-view :AppState="AppState" :isAuthenticated="AppState.state.isLoggedIn"> </router-view>
    </div>

    <!-- Footer -->
    <footer></footer>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'
import * as SocketIO from 'socket.io-client'
import { Component, Prop } from 'vue-property-decorator'
import { BotStatistics } from './types/statistics'

// Defaults
import { mappedGuilds, DiscordGuild } from './defaults/guilds'
import { defaultStats } from './defaults/bot-statistics'
import { AppState } from './defaults/app-state'

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
  @Prop({ default: () => AppState })
  private AppState!: typeof AppState

  @Prop({
    default: () => {
      console.log('ws:', process.env.VUE_APP_BOT_SOCKET ? process.env.VUE_APP_BOT_SOCKET : 'https://alpha.kierabot.xyz/')
      return SocketIO.connect(process.env.VUE_APP_BOT_SOCKET ? process.env.VUE_APP_BOT_SOCKET : 'https://alpha.kierabot.xyz/', { secure: true })
    }
  })
  public socket!: SocketIOClient.Socket

  constructor() {
    super()
    console.log('ws:', process.env.VUE_APP_BOT_SOCKET ? process.env.VUE_APP_BOT_SOCKET : 'https://alpha.kierabot.xyz/')
    console.log('state', this.AppState.state)

    // On socket connection event
    this.socket.on('connect', async () => {
      console.log('socket connected', this)
      // Short delay to prevent flickering
      setTimeout(() => {
        this.AppState.state.isConnected = true
      }, 500)
      this.AppState.state.isConnecting = false
      // Connect and get user data
      this.AppState.user = await this.verifyAuth()
      // If user is newly authenticated
      if (this.AppState.user && this.AppState.state.isLoggedIn === false) {
        setTimeout(() => {
          // Remap guilds
          this.AppState.state.isLoggedIn = true
        }, 350)
      }
      // If user was already logged in and this was a socket reconnect
      if (this.AppState.user && this.AppState.state.isLoggedIn === true) {
        // this.AppState.state.isLoggedIn = true;
      }
      console.log(this.AppState)
    })
    this.socket.on('heartbeat', (data: any) => {
      // console.log('socket heartbeat', data)
      // Update stats
      this.AppState.stats = data.stats
      // console.log('socket heartbeat', this.AppState.stats)
    })
    this.socket.on('disconnect', () => {
      this.AppState.state.isConnected = false
      this.AppState.state.isConnecting = false
    })
  }

  private async verifyAuth() {
    const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/web/verify`, {
      method: 'POST',
      headers: this.$session.get()
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
}

// Content
.content {
  position: relative;
  background-color: #fff;
  padding: 10px;
  &.home {
    padding: 0;
  }
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

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  filter: blur(8px);
  transform: scale(1.05);
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.navbar {
  height: 60px;
  background-color: rgba(0, 0, 0, 0.2) !important;
}
</style>
