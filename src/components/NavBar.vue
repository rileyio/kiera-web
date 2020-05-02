<template>
  <b-navbar toggleable="lg" type="dark">
    <b-navbar-brand href="#">Kiera Bot </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">Home</b-nav-item>
        <b-nav-item href="#">Commands</b-nav-item>
        <b-nav-item href="https://github.com/rileyio/kiera-bot">GitHub</b-nav-item>
        <b-nav-item href="https://status.kierabot.xyz">Status</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right v-if="state.isLoggedIn">
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <em>{{ bot.user.username }}</em>
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item>
          <span class="bot-connectivity">
            <span v-if="state.isConnected">🔌</span>
            <span v-if="state.isConnecting">⛔</span>
          </span>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

// Defaults
import { bot } from '@/defaults/bot'
import { state } from '@/defaults/app-state'

// Components
import CenterLoader from '@/components/center-loader.vue'

@Component({
  components: {
    CenterLoader
  }
})
export default class NavBar extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state

  @Prop({ default: () => bot })
  private bot!: typeof bot
}
</script>

<style lang="less" scoped></style>
