<template>
  <div id="sidebar">
    <el-row v-if="state.focusedView === 'all'">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="h3">All Permissions</div>
          <span class="panel-description">
            Permissions are broken up into 3 categories:
            <br>
            <span style="margin-left:10px;color: #666;">- Global status (Base Server Property)</span>
            <br>
            <span style="margin-left:10px;color: #666;">- (Expanded) By Channel</span>
            <br>
            <span style="margin-left:10px;color: #666;">- (Expanded) Coming Soon: By User | By Role</span>
            <br>
            <br>Priority will always be:
            <span class="md">user > role > channel > server</span>
            <br>
            <br>Coming Soon: Global stats toggle will modify the first descended level.
          </span>

          <el-table :data="permissions" style="width: 100%" v-loading="loading.isLoading">
            <el-table-column type="expand" prop="allowed">
              <template slot-scope="scope">
                <PermissionsSub :data="scope"/>
              </template>
            </el-table-column>
            <el-table-column label="Command" prop="command"></el-table-column>
            <el-table-column label="Global status" prop="enabled" align="right">
              <template slot-scope="scope">
                <div class="permission-override-stats">
                  <span>{{displaySubAllowed(scope.row)}} allowed</span>
                  <span>{{displaySubDenied(scope.row)}} denied</span>
                  <span>{{displaySubExceptions(scope.row)}} exceptions</span>
                </div>
                <el-switch
                  v-model="scope.row.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="updateGlobalPermission(scope.row._id, scope.row.serverID, $event)"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { newPermissionState } from "../defaults/permission";
import { buildRequestHeaders } from "../utils";

// import PermissionBuilder from "../components/permission-builder.vue";
import PermissionsSub from "../components/permissions-sub.vue";
import { user } from "../defaults/user";
import { mappedGuilds } from "../defaults/guilds";
import {
  CommandPermissions,
  CommandPermissionsAllowed
} from "../types/permissions";

@Component({
  components: {
    // PermissionBuilder
    PermissionsSub
  }
})
export default class PermissionsPanel extends Vue {
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
    default: () => []
  })
  public permissions!: Array<any>;

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false };
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean };

  constructor() {
    super();
    this.getChannelPermissions();
  }

  private async getChannelPermissions() {
    try {
      const resp = await Axios(`${process.env.BOT_HOST}/permissions`, {
        method: "POST",
        data: {
          serverID: this.state.focusedGuildId
        },
        headers: buildRequestHeaders()
      });

      if (resp.status === 200) {
        // Sort incoming data by channels
        (<Array<CommandPermissions>>resp.data)
          .map(pp => pp.allowed.sort((a, b) => a.name > b.name ? 1 : -1 ))

        // Update cached data
        this.permissions = resp.data;
        console.log(this.permissions);
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false;
  }

  private async updateGlobalPermission(_id: string, serverID: string, $e: any) {
    console.log(_id, $e);
    const resp = await Axios(
      `${process.env.BOT_HOST}/permission/global/update`,
      {
        method: "POST",
        data: {
          _id: _id,
          state: $e,
          serverID: serverID
        },
        headers: buildRequestHeaders()
      }
    );

    console.log("updateGlobalPermission outcome =>", resp.data);
  }

  private displaySubAllowed(data: CommandPermissions) {
    return data.allowed.filter(p => p.allow).length;
  }

  private displaySubDenied(data: CommandPermissions) {
    return data.allowed.filter(p => !p.allow).length;
  }

  private displaySubExceptions(data: CommandPermissions) {
    var count = 0;
    data.allowed.forEach(p => {
      count += p.exceptions ? p.exceptions.length : 0;
    });

    return count;
  }
}
</script>

<style lang="less">
i.header-icon.el-icon-info {
  position: absolute;
  right: 36px;
}

.permission-override-stats {
  position: absolute;
  right: 65px;
  top: 7px;
  color: #616161;
}

.permission-override-stats > span {
  font-size: 10px;
  display: block;
  line-height: 1em;
}

// Panel
.panel-description {
  font-size: 12px;
  display: block;
  padding: 10px 4px;
}

// Text modifiers
span.md {
  padding: 2px 4px;
  background-color: #e4e7edbd;
  font-family: monospace;
  font-size: 12px;
  color: #484848;
  border-radius: 2px;
}
</style>

