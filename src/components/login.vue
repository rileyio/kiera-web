<template>
  <div>
    <nav class="center">
      <!--<span v-if="!state.isLoggedIn" class="center-button" onclick="window.location='/login'">
        <span v-if="bot.user._id === ''">Login</span>
        <span v-else>...</span>
      </span>-->
    </nav>
    <el-row type="flex" class="row-bg" justify="center">
      <BotStatistic :span="3" :text="'Total Users Seen'" :value="bot.stats.users.total" :backgroundColor="'#1f273adb'" />
      <BotStatistic :span="3" :text="'Users Online'" :value="bot.stats.users.online" :backgroundColor="'#1f273adb'" />
      <BotStatistic :span="3" :text="'Users Registered'" :value="bot.stats.users.registered" :backgroundColor="'#1f273adb'" />
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <BotStatistic span="4" :text="'Completed Commands'" :value="bot.stats.commands.completed" :backgroundColor="'#05b770c4'" :fontColor="'#fff'" />
      <BotStatistic
        span="4"
        :text="'Total Commands'"
        :value="(bot.stats.commands.completed + bot.stats.commands.invalid)"
        :backgroundColor="'#13506dc4'"
        :fontColor="'#fff'"
        :percentageBar="{ show: true, values: [bot.stats.commands.completed, bot.stats.commands.invalid], colors: ['#05b770c4', '#c0392bc4'] }"
      />
      <BotStatistic span="4" :text="'Invalid Commands'" :value="bot.stats.commands.invalid" :backgroundColor="'#c0392bc4'" :fontColor="'#fff'" />
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { BotStatistics } from '../types/statistics'

// Components
import BotStatistic from './BotStatistic.vue'

// Defaults
import { state } from '../defaults/app-state'
import { user } from '../defaults/user'
import { mappedGuilds } from '../defaults/guilds'
import { defaultStats } from '../defaults/bot-statistics'

@Component({
  components: {
    BotStatistic
  }
})
export default class Login extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state

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
}
</script>

<style lang="less">
nav.center {
  margin: 30px;
}

span {
  &.center-button {
    -webkit-transition: all 0.4s;
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
