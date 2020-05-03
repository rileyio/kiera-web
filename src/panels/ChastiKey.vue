<template>
  <div>
    <b-row v-if="state.focusedView === 'all'">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="h3">Your ChastiKey Account</div>
          <span class="panel-description"></span>

          <el-form label-width="200px" size="mini">
            <el-form-item label="[ChastiKey] Username">
              <el-input v-model="bot.user.ChastiKey.username">
                <el-button slot="append" @click="updateUser('ChastiKey.username', bot.user.ChastiKey.username)">Save</el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="[ChastiKey] Stats/Ticker">
              <el-radio-group v-model="bot.user.ChastiKey.ticker.type" @change="updateUser('ChastiKey.ticker.type', $event)" border>
                <el-radio :label="1">Keyholder</el-radio>
                <el-radio :label="2">Lockee</el-radio>
                <el-radio :label="3">Both</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="[ChastiKey] Show Rating">
              <el-switch v-model="bot.user.ChastiKey.ticker.showStarRatingScore" @change="updateUser('ChastiKey.ticker.showStarRatingScore', $event)"></el-switch>
            </el-form-item>

            <el-form-item label="[ChastiKey] Ticker start date">
              <el-date-picker
                type="date"
                placeholder="Start date"
                v-model="bot.user.ChastiKey.ticker.date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="updateUser('ChastiKey.ticker.date', $event)"
              ></el-date-picker>
            </el-form-item>

            <el-form-item size="large">
              <el-button type="primary" plain @click="showAccountSettings = false">Close</el-button>
              <el-button type="info" @click="logout()" plain>Logout</el-button>
              <el-button type="danger" disabled="disabled">Delete Profile</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </b-row>
  </div>
</template>

<script lang="ts">
declare let process: any

import Vue from 'vue'
import Axios from 'axios'

import { Component, Prop, Watch } from 'vue-property-decorator'
import { state } from '../defaults/app-state'
import { mappedGuilds } from '../defaults/guilds'
import { user } from '../defaults/user'
import { bot } from '../defaults/bot'

@Component({
  components: {
    // AccountPopup
  }
})
export default class ChastiKey extends Vue {
  @Prop({ default: () => state })
  private state!: typeof state

  @Prop({ default: bot })
  public bot!: typeof bot

  @Prop({ default: false })
  private showAccountSettings!: boolean

  private async updateUser(key: string, value: any) {
    console.log(key, value)
    const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/user/update`, {
      method: 'POST',
      data: {
        key: key,
        value: value
      },
      headers: this.$session.get()
    })

    console.log('updateUser outcome =>', resp.data)
  }

  private logout(url: string) {
    window.location.href = `/logout`
  }
}
</script>
