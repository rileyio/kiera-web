<template>
  <div>
    You are now logged out!
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Axios from 'axios'
import { Component, Prop } from 'vue-property-decorator'

// Defaults
import { AppState } from '../defaults/app-state'

@Component({})
export default class LogoutView extends Vue {
  @Prop({ default: () => AppState })
  private AppState!: typeof AppState

  private async mounted() {
    await Axios(`${process.env.VUE_APP_BOT_HOST}/web/logout`, {
      method: 'POST',
      headers: this.$session.get()
    })
    this.$session.remove()

    this.AppState = AppState
    this.AppState.state.isLoggedIn = false
    this.$forceUpdate()
  }
}
</script>

<style lang="less"></style>
