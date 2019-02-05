<template>
  <div id="sidebar">
    <el-row v-if="state.focusedView === 'all'">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <span class="h3">All Permissions</span>

          <el-table :data="permissions" style="width: 100%">
            <el-table-column type="expand" prop="allowed">
              <template slot-scope="scope">
                <PermissionsSub :data="scope"/>
              </template>
            </el-table-column>
            <el-table-column label="Command" prop="command"></el-table-column>
            <el-table-column label="Global status" prop="enabled" align="right">
              <template slot-scope="scope">
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
import Vue from "vue";
import Axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { state } from "../defaults/app-state";
import { Permission } from "../types/permissions";
import { permissionDefault, newPermissionState } from "../defaults/permission";
import { buildRequestHeaders } from "../utils";

// import PermissionBuilder from "../components/permission-builder.vue";
import PermissionsSub from "../components/permissions-sub.vue";
import { user } from "../defaults/user";
import { mappedGuilds } from "../defaults/guilds";

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

  constructor() {
    super();
    this.getChannelPermissions();
  }

  private async getChannelPermissions() {
    const resp = await Axios("https://dev.tdm.io:8234/api/permissions", {
      method: "POST",
      data: {
        serverID: this.state.focusedGuildId
      },
      headers: buildRequestHeaders()
    });

    if (resp.status === 200) {
      this.permissions = resp.data;
      console.log(this.permissions);
    }
  }

  private async updateGlobalPermission(_id: string, serverID: string, $e: any) {
    console.log(_id, $e);
    const resp = await Axios(
      "https://dev.tdm.io:8234/api/permission/global/update",
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
}
</script>

<style lang="less">
i.header-icon.el-icon-info {
  position: absolute;
  right: 36px;
}
</style>

