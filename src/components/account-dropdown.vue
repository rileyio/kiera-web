<template>
  <div>
    <div :class="['account-dropdown']" @click="showAccountSettings = !showAccountSettings">
      <span class="username">{{ bot.user.username }}#{{ bot.user.discriminator }}</span>
      <div class="ui avatar image" :style="{ 'background-image': `url('https://cdn.discordapp.com/avatars/146439529824256000/${bot.user.avatar}.png')` }"></div>
    </div>

    <div class="account-settings-wrap" v-if="showAccountSettings">
      <div class="account-settings modal">
        <div class="modal-title">Account Settings</div>
        <div class="modal-body">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'

import { Component, Prop, Watch } from 'vue-property-decorator'
import { state } from '../defaults/app-state'
import { mappedGuilds } from '../defaults/guilds'
import { user } from '../defaults/user'
import { buildRequestHeaders } from '../utils'

@Component({
  components: {
    // AccountPopup
  }
})
export default class AccountDropdown extends Vue {
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

  @Prop({ default: false })
  private showAccountSettings!: boolean

  private async updateUser(key: string, value: any) {
    console.log(key, value)
    const resp = await Axios(`${process.env.BOT_HOST}/user/update`, {
      method: 'POST',
      data: {
        key: key,
        value: value
      },
      headers: buildRequestHeaders()
    })

    console.log('updateUser outcome =>', resp.data)
  }

  private logout(url: string) {
    window.location.href = `/logout`
  }
}
</script>

<style lang="less">
.account-dropdown {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 195px;
  height: 55px;
  display: block;
  cursor: pointer;
  -webkit-transition: all 0.12s;
  &:hover {
    background-color: #16171da1;
  }
}

span.username {
  position: absolute;
  right: 55px;
  top: 20px;
  display: block;
}

.ui.avatar.image {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  background-size: contain;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  max-width: 600px;
  max-height: 321px;
  width: 98%;
  height: 100%;
  margin: auto;
  box-shadow: 0 0 15px 2px #0003;
  z-index: 999;
  padding: 55px 0 0 0;
  box-sizing: border-box;
  .modal-title {
    position: absolute;
    display: block;
    color: #000;
    font-size: 18px;
    padding: 14px;
    color: #fff;
    margin: 0 0 5px 0;
    top: 0;
    left: 0;
    background-image: url(/assets/img/abstract-art-590697.jpg);
    width: 100%;
  }
  .modal-body {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: auto;
    z-index: 1;
  }
}

.account-settings-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2b2b2b57;
  z-index: 2;
}
</style>
