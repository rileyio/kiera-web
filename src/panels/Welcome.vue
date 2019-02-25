<template>
  <div id="app">
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
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Bot Uptime</div>
        <div class="grid-content value">{{calculateHumanTime(bot.stats.uptime)}}</div>
      </el-col>
    </el-row>
    <el-row class="statistics">
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Total Users Seen</div>
        <div class="grid-content value">{{bot.stats.users.total}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Users Online</div>
        <div class="grid-content value">{{bot.stats.users.online}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Users Registered</div>
        <div class="grid-content value">{{bot.stats.users.registered}}</div>
      </el-col>
    </el-row>
    <el-row class="statistics">
      <el-col :span="6" class="statistic success">
        <div class="grid-content title">Completed Commands</div>
        <div class="grid-content value">{{bot.stats.commands.completed}}</div>
      </el-col>
      <el-col :span="6" class="statistic success-ish">
        <div class="success-perc">
          <div class="successful" :style="{ 'width': calculateSuccessPerc() + '%' }"></div>
          <div class="failed" :style="{ 'width': calculateFailedPerc() + '%' }"></div>
        </div>
        <div class="grid-content title">Total Commands</div>
        <div
          class="grid-content value"
        >{{(bot.stats.commands.completed + bot.stats.commands.invalid)}}</div>
      </el-col>
      <el-col :span="6" class="statistic fail">
        <div class="grid-content title">Invalid Commands</div>
        <div class="grid-content value">{{bot.stats.commands.invalid}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Messages Seen</div>
        <div class="grid-content value">{{bot.stats.messages.seen}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">Messages Sent</div>
        <div class="grid-content value">{{bot.stats.messages.sent}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">DMs Received</div>
        <div class="grid-content value">{{bot.stats.dms.received}}</div>
      </el-col>
      <el-col :span="6" class="statistic">
        <div class="grid-content title">DMs Sent</div>
        <div class="grid-content value">{{bot.stats.dms.sent}}</div>
      </el-col>
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

@Component({
  components: {
    //
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

  private calculateSuccessPerc() {
    return (
      this.bot.stats.commands.completed /
      (this.bot.stats.commands.completed + this.bot.stats.commands.invalid)
    ) * 100;
  }

  private calculateFailedPerc() {
    return (
      this.bot.stats.commands.invalid /
      (this.bot.stats.commands.completed + this.bot.stats.commands.invalid)
    ) * 100;
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

.statistic {
  padding: 10px;
  text-align: center;
  color: rgb(142, 150, 179);
  display: block;
  line-height: 1.5em;
  background-color: #1f273a;
  border-radius: 2px;
  margin: 2px;
  display: block;
  position: relative;
  overflow: hidden;
  &.success {
    background-color: #27ae60;
    color: #fff;
  }
  &.success-ish {
    background-color: #13506d;
    color: #ffffff;
  }
  &.fail {
    background-color: #c0392b;
    color: #fff;
  }
}

.statistic > .title {
  font-size: 12px;
  font-weight: 200;
}

.statistic > .value {
  font-size: 20px;
  font-weight: 100;
}

.success-perc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  > .successful {
    position: absolute;
    top: 0;
    left: 0;
    width: 66.6%;
    height: 100%;
    background-color: #05b770;
  }

  > .failed {
    position: absolute;
    top: 0;
    right: 0;
    width: 66.6%;
    height: 100%;
    background-color: #cb4332;
  }
}
</style>
