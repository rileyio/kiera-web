<template>
  <div id="sidebar">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item
        index="1-2"
        v-show="state.isGuildOwner"
        @click="$emit('onPanelChange', { panel: 'PermissionsPanel', view: 'all' })"
      >
        <i class="el-icon-menu"></i>
        <span>Command Permission</span>
      </el-menu-item>
      <el-menu-item
        index="1-3"
        @click="$emit('onPanelChange', { panel: 'ServerNotificationsPanel', view: 'all' })"
      >
        <i class="el-icon-bell"></i>
        <span>Server Notifications</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script <script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { state } from "../defaults/app-state";

@Component
export default class Sidebar extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state;
}
</script>
