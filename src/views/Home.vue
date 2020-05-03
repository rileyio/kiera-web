<template>
  <div>
    <div
      class="header top header-img home"
      :style="{ 'background-image': `url('/img/${AppState.state.randomBG}.jpg')` }"
      :class="{ page: !AppState.isLoggedIn, small: AppState.isLoggedIn }"
    >
      <div class="center-login-invite">
        <b-button variant="dark" size="lg" @click="openInviteURL">Invite to Server</b-button>
        <b-button variant="info" size="lg" @click="openLoginURL" v-if="!$session.isSession()">Login</b-button>
      </div>
      <div class="center-stats">
        <b-row class="mt-2">
          <b-col>
            <BotStatistic :span="3" :text="'Servers: Count'" :value="AppState.stats.servers.total" :backgroundColor="'#1f273ae8'" />
          </b-col>
          <b-col>
            <BotStatistic :span="3" :text="'Servers: Users Total'" :value="AppState.stats.users.total" :backgroundColor="'#1f273ae8'" />
          </b-col>
          <b-col>
            <BotStatistic :span="3" :text="'Servers: Users Online'" :value="AppState.stats.users.online" :backgroundColor="'#1f273ae8'" />
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <BotStatistic span="4" :text="'Commands: Successful'" :value="AppState.stats.commands.completed" :backgroundColor="'#05b770de'" :fontColor="'#fff'" />
          </b-col>
          <b-col>
            <BotStatistic
              span="4"
              :text="'Commands: Total Processed'"
              :value="(AppState.stats.commands.completed + AppState.stats.commands.invalid)"
              :backgroundColor="'#13506dc4'"
              :fontColor="'#fff'"
              :percentageBar="{ show: true, values: [AppState.stats.commands.completed, AppState.stats.commands.invalid], colors: ['#05b770c4', '#c0392bc4'] }"
            />
          </b-col>
          <b-col>
            <BotStatistic span="4" :text="'Commands: Invalid / Failed'" :value="AppState.stats.commands.invalid" :backgroundColor="'#c0392bd6'" :fontColor="'#fff'" />
          </b-col>
        </b-row>
      </div>
    </div>

    <transition name="fade">
      <CenterLoader :AppState="AppState" v-if="!AppState.state.isConnected" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Import Component Base
import BaseComponent from '@/components/BaseComponent.vue'

// Defaults
import { AppState } from '@/defaults/app-state'

// Components
import BotStatistic from '@/components/BotStatistic.vue'
import CenterLoader from '@/components/center-loader.vue'

@Component({
  components: {
    BotStatistic,
    CenterLoader
  }
})
export default class Home extends BaseComponent {
  private openInviteURL() {
    window.location = process.env.VUE_APP_BOT_INVITE_URL
  }

  private openLoginURL() {
    window.location = process.env.VUE_APP_SERVER_LOGIN_URL
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  transition: all 0.6s;
  z-index: 100;
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

.home {
  height: 100%;
  width: 100%;
  .center-login-invite {
    position: relative;
    max-width: 1000px;
    width: 100%;
    margin: auto;
    top: 20%;
    text-align: center;
    button {
      margin: 0 10px;
    }
  }
  .center-stats {
    position: relative;
    max-width: 800px;
    width: 100%;
    margin: auto;
    top: 27%;
  }
}

span {
  &.center-button {
    transition: all 0.4s;
    transition: all 0.4s;
    padding: 10px 87px;
    background-color: #434f79d4;
    box-shadow: 0 0 8px 2px #15151530;
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
