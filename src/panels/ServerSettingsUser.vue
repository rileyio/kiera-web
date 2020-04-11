<template>
  <div id="sidebar">
    <el-row>
      <el-table v-loading="loading.isLoading" :data="settings" style="width: 100%;" size="mini">
        <el-table-column label="Setting">
          <template slot-scope="scope">
            <span>{{ scope.row.key }}</span>
            <el-input placeholder="Setting value" v-model="scope.row.value" class="input" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Enable/Save" width="125">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" icon="el-icon-delete" :disabled="true"></el-button>
              <el-button size="mini" icon="el-icon-check" type="success" @click="updateSetting(scope.row.key, { state: scope.row.state, value: scope.row.value })"></el-button>
            </el-button-group>
            <el-switch
              style="display: block;"
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateSetting(scope.row.key, { state: $event, value: scope.row.value })"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'

import { Component, Prop } from 'vue-property-decorator'
import { state } from '../defaults/app-state'
import { defaultServerSettings, defaultServerSettingsUser } from '../defaults/setting'
import { TrackedServerSetting } from '../types/server-settings'
import { buildRequestHeaders, getUserID } from '../utils'
import { user } from '../defaults/user'
import { mappedGuilds } from '../defaults/guilds'

@Component({
  components: {
    //
  }
})
export default class ServerSettingsUserPanel extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state

  @Prop({
    default: () => {
      return { webToken: '', user: user, guilds: mappedGuilds }
    }
  })
  public bot!: {
    webToken: string
    user: typeof user
    guilds: typeof mappedGuilds
  }

  @Prop({
    default: () => []
  })
  private settings!: Array<TrackedServerSetting>

  @Prop({ default: '' })
  private search!: string

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false }
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean }

  constructor() {
    super()
    this.getServerSettings()
  }

  private async getServerSettings() {
    try {
      // Get defaults available first
      this.settings = await defaultServerSettingsUser()
      // Now get user's configiured
      const resp = await Axios(`${process.env.BOT_HOST}/user`, {
        data: {
          serverID: this.state.focusedGuildId
        },
        method: 'POST',
        headers: buildRequestHeaders()
      })

      if (resp.status === 200) {
        console.log('resp.data', resp.data)
        this.settings = resp.data.map((setting: TrackedServerSetting) => {
          // Handle local state changes
          ;(<TrackedServerSetting>setting)._originalValue = setting.value

          return setting
        })

        console.log(this.settings)
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false
  }

  private async updateSetting(key: string, update: { state: boolean; value: string }) {
    console.log(key, update)
    const resp = await Axios(`${process.env.BOT_HOST}/user/update`, {
      method: 'POST',
      data: {
        serverID: this.state.focusedGuildId,
        state: update.state === undefined ? (<TrackedServerSetting>this.settings.find((s) => s.key === key)).state : update.state,
        value: update.value
      },
      headers: buildRequestHeaders()
    })

    if (resp.status === 200) {
      const serverSetting = <TrackedServerSetting>this.settings.find((s) => s.key === key)
      serverSetting._originalValue = update.value
      this.$bvToast.toast(`Updated setting: ${key}`)
      console.log(this.settings)
    }
    console.log('updateSetting outcome =>', resp.data)
  }
}
</script>

<style lang="less"></style>
