<template>
  <div id="sidebar">
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
      <!-- Menu Item -->
      <el-menu-item index="1-1" v-show="AppState.isGuildOwner" @click="$emit('onPanelChange', { panel: 'ServerSettingsPanel', view: 'all' })">
        <i class="el-icon-setting"></i>
        <span>Server Settings (Server Owner)</span>
      </el-menu-item>
      <!-- Menu Item -->
      <!-- <el-menu-item
        index="1-2"
        @click="$emit('onPanelChange', { panel: 'ServerSettingsUserPanel', view: 'all' })"
      >
        <i class="el-icon-edit"></i>
        <span>Server/User Settings</span>
      </el-menu-item>-->
      <!-- Menu Item -->
      <el-menu-item index="1-3" v-show="AppState.isGuildOwner" @click="$emit('onPanelChange', { panel: 'PermissionsPanel', view: 'all' })">
        <i class="el-icon-menu"></i>
        <span>Command Permission</span>
      </el-menu-item>
      <!-- Menu Item -->
      <el-menu-item index="1-4" @click="$emit('onPanelChange', { panel: 'ServerNotificationsPanel', view: 'all' })">
        <i class="el-icon-bell"></i>
        <span>Server Notifications</span>
      </el-menu-item>
      <!-- Menu Item -->
      <el-menu-item index="1-5" @click="$emit('onPanelChange', { panel: 'DecisionsPanel', view: 'all' })">
        <i class="el-icon-tickets"></i>
        <span>Decisions Manager</span>
      </el-menu-item>
      <!-- Menu Item (Only shown if a member of the ChastiKey server) -->
      <el-menu-item index="1-10" v-if="AppState.focusedGuildId === '473856867768991744'" @click="$emit('onPanelChange', { panel: 'ChastiKey', view: 'all' })">
        <i class="chastikey-icon"></i>
        <span>ChastiKey Account</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Import Component Base
import BaseComponent from '@/components/BaseComponent.vue'

@Component
export default class Sidebar extends BaseComponent {}
</script>

<style lang="less">
.chastikey-icon {
  background-image: url(https://www.chastikey.com/images/chastikey-website-logo-122x122.png);
  margin-right: 5px;
  width: 24px;
  height: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  display: inline-block;
  background-size: contain;
}
</style>
