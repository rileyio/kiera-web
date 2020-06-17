<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-card no-body>
          <b-tabs pills card vertical>
            <b-tab title="Audit Log"
              ><b-card-text><AuditLog /></b-card-text
            ></b-tab>
            <b-tab title="Decision Rolls"><b-card-text>Decision Rolls</b-card-text></b-tab>
            <b-tab title="My Data"><b-card-text>My Data</b-card-text></b-tab>
          </b-tabs>
        </b-card>
        <!-- <img src="https://discordapp.com/api/guilds/389204362959781899/widget.png?style=banner2" alt="Join the Kiera-Bot development community" @click="openDiscord" /> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
declare let process: any

import Vue from 'vue'
import Axios from 'axios'

// Import Component Base
import AuditLog from '@/panels/AuditLog.vue'
import BaseComponent from '@/components/BaseComponent.vue'

import { Component, Prop, Watch } from 'vue-property-decorator'
import { mappedGuilds } from '../defaults/guilds'
import { user } from '../defaults/user'

@Component({
  components: {
    AuditLog
  }
})
export default class Account extends BaseComponent {
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

  private openDiscord() {
    window.open('https://discord.gg/tuyk2k3', '_blank')
  }
}
</script>

<style lang="less">
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
    background-image: url(/img/abstract-art-590697.jpg);
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
