<template>
  <div id="sidebar">
    <el-row>
      <el-table v-loading="loading.isLoading" :data="notifications" style="width: 100%">
        <el-table-column label="Name" prop="_title"></el-table-column>
        <el-table-column align="right" label="Notification state" prop="state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateNotification(scope.row.name, { _discordEnabled: scope.row._discordEnabled, state: $event })"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="right" label="Notify in" prop="_discordEnabled">
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row._discordEnabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              inactive-text="Web"
              active-text="Discord"
              @change="updateNotification(scope.row.name, { _discordEnabled: $event, state: scope.row.state })"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";

import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import {
  defaultNotifications,
  TrackedNotification
} from "../defaults/notification";
import { buildRequestHeaders, getUserID } from "../utils";
import { user } from "../defaults/user";
import { mappedGuilds } from "../defaults/guilds";

@Component({
  components: {
    //
  }
})
export default class ServerSettingsPanel extends Vue {
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

  @Prop({
    default: () => defaultNotifications
  })
  private notifications!: Array<TrackedNotification>;

  @Prop({ default: "" })
  private search!: string;

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false };
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean };

  constructor() {
    super();
    this.getServerNotifications();
  }

  private async getServerNotifications() {
    try {
      const resp = await Axios(`${process.env.BOT_HOST}/notifications`, {
        method: "POST",
        data: {
          serverID: this.state.focusedGuildId
        },
        headers: buildRequestHeaders()
      });

      if (resp.status === 200) {
        resp.data.forEach((notification: TrackedNotification) => {
          var defaultNotification = this.notifications.find(
            n => n.name === notification.name
          );
          // Merge objects
          Object.assign(defaultNotification || {}, notification);
          // Handle where override
          (<TrackedNotification>defaultNotification)._discordEnabled =
            (<TrackedNotification>defaultNotification).where === "Discord";
        });
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false;
  }

  private async updateNotification(
    name: string,
    update: Partial<TrackedNotification>
  ) {
    console.log(name, update, {
      owner: this.bot.user._id,
      authorID: getUserID(),
      serverID: this.state.focusedGuildId,
      name: name,
      state: update.state,
      where: update._discordEnabled ? "Discord" : "Web"
    });

    const resp = await Axios(`${process.env.BOT_HOST}/notification/update`, {
      method: "POST",
      data: {
        owner: this.bot.user._id,
        authorID: getUserID(),
        serverID: this.state.focusedGuildId,
        name: name,
        state: update.state,
        where: update._discordEnabled ? "Discord" : "Web"
      },
      headers: buildRequestHeaders()
    });

    console.log("updateNotification outcome =>", resp.data);
  }
}
</script>

<style lang="less">
</style>

