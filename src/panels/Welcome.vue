<template>
  <div>
    <el-row>
      <el-col>
        <div class="welcome-text">
          Welcome to the Kiera Bot webportal!
          <br>
          <br>If you're a server owner you'll find options on any servers containing the ⭐️
          listed under the owners category of the dropdown.
          <br>
          <br>Every user will see all other available Bot options in the left menu
          after selecting a server.
        </div>
      </el-col>
    </el-row>
    <el-row class="statistics">
      <BotStatistic :text="'Bot Uptime'" :value="calculateHumanTime(bot.stats.uptime)"/>
    </el-row>
    <el-row class="statistics">
      <BotStatistic :text="'Total Users Seen'" :value="bot.stats.users.total"/>
      <BotStatistic :text="'Users Online'" :value="bot.stats.users.online"/>
      <BotStatistic :text="'Users Registered'" :value="bot.stats.users.registered"/>
    </el-row>
    <el-row class="statistics">
      <BotStatistic
        :text="'Completed Commands'"
        :value="bot.stats.commands.completed"
        :backgroundColor="'#05b770'"
        :fontColor="'#fff'"
      />
      <BotStatistic
        :text="'Total Commands'"
        :value="(bot.stats.commands.completed + bot.stats.commands.invalid)"
        :backgroundColor="'#13506d'"
        :fontColor="'#fff'"
        :percentageBar="{ show: true, values: generateCommandStatsArray(), colors: [ '#05b770', '#cb4332' ] }"
      />
      <BotStatistic
        :text="'Invalid Commands'"
        :value="bot.stats.commands.invalid"
        :backgroundColor="'#c0392b'"
        :fontColor="'#fff'"
      />

      <BotStatistic :text="'Messages Seen'" :value="bot.stats.messages.seen"/>
      <BotStatistic :text="'Messages Sent'" :value="bot.stats.messages.sent"/>
      <BotStatistic :text="'DMs Received'" :value="bot.stats.dms.received"/>
      <BotStatistic :text="'DMs Sent'" :value="bot.stats.dms.sent"/>
    </el-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { user } from "../defaults/user";
import { mappedGuilds, DiscordGuild } from "../defaults/guilds";
import { defaultStats } from "../defaults/bot-statistics";
import { BotStatistics } from "../types/statistics";

import BotStatistic from "../components/statistic.vue";

@Component({
  components: {
    BotStatistic
  }
})
export default class WelcomePanel extends Vue {
  @Prop({
    default: () => {
      return {
        webToken: "",
        user: user,
        guilds: mappedGuilds,
        stats: defaultStats
      };
    }
  })
  public bot!: {
    webToken: string;
    user: typeof user;
    guilds: typeof mappedGuilds;
    stats: BotStatistics;
  };

  private calculateHumanTime(mili: number) {
    // Calculate human readible time for lock from seconds
    var sec = Math.floor(mili / 1000);
    var min = Math.floor(sec / 60);
    var min = Math.floor(sec / 60);
    var hrs = Math.floor(min / 60);
    min = min % 60;
    var days = Math.floor(hrs / 24);
    hrs = hrs % 24;

    const timeToShowDays = `${days > 9 ? +days : "0" + days}d`;
    const timeToShowHours = `${hrs > 9 ? +hrs : "0" + hrs}h`;
    const timeToShowMins = `${min > 9 ? +min : "0" + min}m`;

    return `${timeToShowDays}:${timeToShowHours}:${timeToShowMins}`;
  }

  private generateCommandStatsArray() {
    return [this.bot.stats.commands.completed, this.bot.stats.commands.invalid];
  }

  private calculateSuccessPerc() {
    return (
      (this.bot.stats.commands.completed /
        (this.bot.stats.commands.completed + this.bot.stats.commands.invalid)) *
      100
    );
  }

  private calculateFailedPerc() {
    return (
      (this.bot.stats.commands.invalid /
        (this.bot.stats.commands.completed + this.bot.stats.commands.invalid)) *
      100
    );
  }
}
</script>

<style lang="less">
.welcome-text {
  font-size: 12px;
}

.statistics {
  margin: 15px 0px;
}
</style>
