<template>
  <div>
    <b-row>
      <b-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div class="h4">
            Audit Log ({{ auditEvents.length }})

            <b-overlay :show="loading.isLoading" rounded opacity="0.6" spinner-variant="primary" class="d-inline-block"
              ><b-button ref="button" :disabled="loading.isLoading" variant="primary" @click="getAuditEntries()"> <b-icon icon="arrow-clockwise"></b-icon></b-button
            ></b-overlay>
          </div>
          <span class="panb-description"></span>

          <b-overlay :show="loading.isLoading" spinner-variant="primary" spinner-type="grow" spinner-small rounded="sm">
            <b-table :items="auditEvents" :fields="['successful', 'owner', 'runtime', 'details', 'timestamp', 'type', 'where', 'name', 'guild']">
              <!-- Column: Successful -->
              <template v-slot:cell(successful)="data">
                <b-badge size="mini" v-if="data.item.successful" variant="success">Successful</b-badge>
                <b-badge size="mini" v-else variant="danger">Error</b-badge>
                <b-badge size="mini" v-if="data.item.type === 'api.oauth'" variant="primary">Auth</b-badge>
              </template>
              <!-- Column: Owner -->
              <template v-slot:cell(owner)="data">
                <b-badge size="mini" v-if="data.item.owner === AppState.user.userID">You</b-badge>
                <b-badge size="mini" v-else>{{ data.item.owner }}</b-badge>
              </template>
              <!-- Column: Runtime -->
              <template v-slot:cell(runtime)="data">
                <b-badge v-if="data.item.runtime <= 1500" variant="success">{{ data.item.runtime }}ms</b-badge>
                <b-badge v-if="data.item.runtime > 1500 && data.item.runtime <= 4500" variant="warning">{{ data.item.runtime }}ms</b-badge>
                <b-badge v-if="data.item.runtime > 4500" variant="danger">{{ data.item.runtime }}ms</b-badge>
              </template>
              <!-- Column: Details -->
              <template v-slot:cell(details)="data">
                <code>{{ data.item.details }}</code>
              </template>
              <!-- Column: Timestamp -->
              <template v-slot:cell(timestamp)="data">
                {{ DateTimeUtils.convertToLocaleDateString(data.item.timestamp) }}
              </template>
              <!-- Column: Timestamp -->
              <template v-slot:cell(guild)="data"> [{{ data.item.guild.name }}] #{{ data.item.guild.channel }} </template>
            </b-table>
          </b-overlay>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
declare var process: any

import Vue from 'vue'
import Axios from 'axios'
import { Component, Prop, Watch } from 'vue-property-decorator'

// Import Component Base
import BaseComponent from '@/components/BaseComponent.vue'

import { user } from '../defaults/user'
import { AuditEntry } from '../types/audit'

// Utils
import * as DateTimeUtils from '@/utils/date'

@Component({})
export default class AuditPanel extends BaseComponent {
  public auditEvents: Array<any> = []

  @Prop({ default: () => DateTimeUtils })
  private DateTimeUtils!: typeof DateTimeUtils

  @Prop({
    default: () => {
      return { isLoading: true, loaded: false }
    }
  })
  public loading!: { isLoading: boolean; loaded: boolean }

  private async mounted() {
    await this.getAuditEntries()
  }

  private async getAuditEntries() {
    try {
      this.loading.isLoading = true
      const resp = await Axios(`${process.env.VUE_APP_BOT_HOST}/audit`, {
        method: 'POST',
        data: {
          serverLimited: false
        },
        headers: this.$session.get()
      })

      if (resp.status === 200) {
        // Update cached data
        this.auditEvents = resp.data
        console.log(resp.data)
      }
    } catch (error) {}
    // Stop spinner
    this.loading.isLoading = false
  }
}
</script>

<style lang="less"></style>
