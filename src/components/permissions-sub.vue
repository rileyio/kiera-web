<template>
  <div>
    <el-row>
      <el-input placeholder="Filter Channels" size="mini" v-model="filterInput"></el-input>
    </el-row>
    <br>
    <el-row>
      <div
        v-for="(allowed, i) in data.row.allowed.filter(a => !filterInput || a.name.toLowerCase().includes(filterInput.toLowerCase()))"
        :key="i"
      >
        <el-switch
          v-model="allowed.allow"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="updatePermission(data.row._id, data.row.serverID, data.row.command, allowed.target, $event)"
        ></el-switch>
        {{allowed.name}}
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { buildRequestHeaders } from "../utils";

@Component({
  components: {
    // PermissionBuilder
  }
})
export default class PermissionsSub extends Vue {
  @Prop()
  private data!: string;

  constructor() {
    super();
    console.log(this.data);
  }

  @Watch("data")
  private watchData(_old: any, _new: any) {
    console.log(_old, _new);
  }

  @Prop({ default: "" })
  private filterInput!: string;

  private async updatePermission(
    _id: string,
    serverID: string,
    command: string,
    target: string,
    $e: any
  ) {
    console.log(_id, $e);
    const resp = await Axios(
      `${process.env.BOT_HOST}/permission/allowed/update`,
      {
        method: "POST",
        data: {
          _id: _id,
          serverID: serverID,
          command: command,
          target: target,
          state: $e
        },
        headers: buildRequestHeaders()
      }
    );

    console.log("updatePermission outcome =>", resp.data);
  }
}
</script>