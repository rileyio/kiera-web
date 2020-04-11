<template>
  <div>
    More coming soon!
    <br />
    <br />If you require any assistance in the meantime you can reach the author (Emma) via the Kiera-Bot development server.
    <br />
    <br />
    <img src="https://discordapp.com/api/guilds/389204362959781899/widget.png?style=banner2" alt="Join the Kiera-Bot development community" @click="openDiscord" />
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
export default class Account extends Vue {
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

  private openDiscord() {
    window.open('https://discord.gg/tuyk2k3', '_blank')
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
